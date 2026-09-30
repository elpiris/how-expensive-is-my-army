import type {
  CostBreakdown,
  DiscountPercent,
  GeneratedList,
  PurchaseLine,
  ValueBox,
} from '../types'

// ---------------------------------------------------------------------------
// Costing
//
// Turn a generated army list into a shopping list of boxes, minimising cost by
// preferring value boxes (Combat Patrols) whenever they actually save money.
//
// Strategy:
//  1. Compute how many models of each datasheet we need.
//  2. Greedily add value boxes while a box covers >= 2 needed unit-types AND
//     the euro value of the units it covers is at least its own price (i.e. it
//     is cheaper than buying those units as individual kits). Using euro value
//     rather than model count avoids buying a €130 box for a few cheap models.
//  3. Cover whatever remains with individual unit kits (ceil by box size).
//  4. Track surplus (paid-for but unused) models for transparency.
// ---------------------------------------------------------------------------

interface Need {
  unitId: string
  name: string
  modelsNeeded: number
}

export function costList(list: GeneratedList): CostBreakdown {
  const { faction, entries } = list
  const unitById = new Map(faction.units.map((u) => [u.id, u]))

  // 1. Needs in models.
  const needs = new Map<string, Need>()
  for (const e of entries) {
    const modelsNeeded = e.unit.models * e.count
    const existing = needs.get(e.unit.id)
    if (existing) existing.modelsNeeded += modelsNeeded
    else needs.set(e.unit.id, { unitId: e.unit.id, name: e.unit.name, modelsNeeded })
  }

  /** Per-model RRP of a unit's own kit, used to value value-box contents. */
  const pricePerModel = (unitId: string): number => {
    const u = unitById.get(unitId)
    if (!u) return 0
    return u.kit.priceEUR / u.kit.models
  }

  /** Euro value of the box contents that would actually be used right now. */
  const usefulValue = (box: ValueBox): number => {
    let value = 0
    for (const b of box.builds) {
      const need = needs.get(b.unitId)
      if (need) value += Math.min(b.models, need.modelsNeeded) * pricePerModel(b.unitId)
    }
    return value
  }

  /** How many distinct needed unit-types a value box covers. */
  const coveredTypes = (box: ValueBox): number =>
    box.builds.filter((b) => (needs.get(b.unitId)?.modelsNeeded ?? 0) > 0).length

  const lines: PurchaseLine[] = []
  const notes: string[] = []
  const valueBoxCounts = new Map<string, number>()

  // 2. Greedily consume value boxes while they pull their weight.
  let guard = 0
  while (guard++ < 50) {
    let best: ValueBox | undefined
    let bestValue = 0
    for (const box of faction.valueBoxes) {
      if (coveredTypes(box) < 2) continue
      const value = usefulValue(box)
      // Only take the box if the units it covers would cost at least as much
      // bought individually — i.e. the box genuinely saves (or breaks even on)
      // money — and prefer the box that saves the most.
      if (value >= box.priceEUR && value > bestValue) {
        best = box
        bestValue = value
      }
    }
    if (!best) break

    // Consume the box: subtract its contents from needs.
    for (const b of best.builds) {
      const need = needs.get(b.unitId)
      if (need) need.modelsNeeded = Math.max(0, need.modelsNeeded - b.models)
    }
    valueBoxCounts.set(best.id, (valueBoxCounts.get(best.id) ?? 0) + 1)
  }

  for (const [boxId, qty] of valueBoxCounts) {
    const box = faction.valueBoxes.find((b) => b.id === boxId)!
    lines.push({
      name: box.name,
      quantity: qty,
      unitPriceEUR: box.priceEUR,
      lineTotalEUR: box.priceEUR * qty,
      isValueBox: true,
      onlineOnly: !!box.onlineOnly,
      verified: !!box.verified,
      covers: box.builds.map((b) => {
        const u = unitById.get(b.unitId)
        return u ? `${b.models}× ${u.name}` : b.unitId
      }),
      url: box.url,
    })
  }

  // 3. Cover the remainder with individual kits.
  for (const need of needs.values()) {
    if (need.modelsNeeded <= 0) continue
    const unit = unitById.get(need.unitId)!
    const boxes = Math.ceil(need.modelsNeeded / unit.kit.models)
    const surplus = boxes * unit.kit.models - need.modelsNeeded
    lines.push({
      name: unit.kit.name,
      quantity: boxes,
      unitPriceEUR: unit.kit.priceEUR,
      lineTotalEUR: unit.kit.priceEUR * boxes,
      isValueBox: false,
      onlineOnly: !!unit.kit.onlineOnly,
      verified: !!unit.kit.verified,
      covers: [`${need.modelsNeeded}× ${unit.name}`],
      url: unit.kit.url,
    })
    if (surplus > 0) {
      notes.push(`${unit.name}: ${boxes} box(es) leaves ${surplus} spare model(s).`)
    }
  }

  // Order: value boxes first, then by price descending.
  lines.sort((a, b) => Number(b.isValueBox) - Number(a.isValueBox) || b.lineTotalEUR - a.lineTotalEUR)

  const rrpTotalEUR = round2(lines.reduce((s, l) => s + l.lineTotalEUR, 0))
  const nonDiscountableEUR = round2(
    lines.filter((l) => l.onlineOnly).reduce((s, l) => s + l.lineTotalEUR, 0),
  )
  const discountableEUR = round2(rrpTotalEUR - nonDiscountableEUR)

  return { lines, rrpTotalEUR, discountableEUR, nonDiscountableEUR, notes }
}

/** Apply a retailer discount to the discountable portion only. */
export function discountedTotal(cost: CostBreakdown, pct: DiscountPercent): number {
  const discounted = cost.discountableEUR * (1 - pct / 100)
  return round2(discounted + cost.nonDiscountableEUR)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
