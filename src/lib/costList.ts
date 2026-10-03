import type {
  CostBreakdown,
  DiscountPercent,
  GeneratedList,
  PurchaseLine,
  Unit,
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
//  4. Track surplus (paid-for but unused) models — reported as notes and as
//     structured `spare` models, which the generator fields when it can.
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
  const spare = new Map<string, number>() // unitId -> paid-for, unfielded models
  const addSpare = (unitId: string, models: number) => {
    if (models > 0 && unitById.has(unitId)) spare.set(unitId, (spare.get(unitId) ?? 0) + models)
  }

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

    // Consume the box: subtract its contents from needs; the rest is spare.
    for (const b of best.builds) {
      const need = needs.get(b.unitId)
      const used = need ? Math.min(b.models, need.modelsNeeded) : 0
      if (need) need.modelsNeeded -= used
      addSpare(b.unitId, b.models - used)
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

  // 3. Cover the remainder with individual kits, crediting bonus sprues that a
  //    box also builds (e.g. a Termagants box also yields a Ripper Swarm base),
  //    so we don't buy models we already got for free. Producers (kits with
  //    `alsoBuilds`) are costed first so their credits reach the byproducts.
  const credits = new Map<string, number>() // unitId -> free models already owned
  const remainingNeeds = [...needs.values()].filter((n) => n.modelsNeeded > 0)
  remainingNeeds.sort(
    (a, b) =>
      (unitById.get(b.unitId)?.kit.alsoBuilds ? 1 : 0) -
      (unitById.get(a.unitId)?.kit.alsoBuilds ? 1 : 0),
  )
  // Datasheets sharing a plain kit (no bonus builds) pool their models into whole
  // boxes — e.g. a €83 War Dogs box builds any 2 War Dogs, so a Huntsman + a
  // Stalker need ONE box, not two.
  const pools = new Map<string, { units: Unit[]; models: number }>()
  for (const need of remainingNeeds) {
    const unit = unitById.get(need.unitId)!
    const credit = credits.get(need.unitId) ?? 0
    const netModels = Math.max(0, need.modelsNeeded - credit)
    credits.set(need.unitId, Math.max(0, credit - need.modelsNeeded))
    if (netModels <= 0) {
      notes.push(`${unit.name}: covered by bonus models from other kits.`)
      continue
    }
    if (!unit.kit.alsoBuilds?.length) {
      const key = `${unit.kit.name}|${unit.kit.priceEUR}|${unit.kit.models}`
      const pool = pools.get(key) ?? { units: [], models: 0 }
      pool.units.push(unit)
      pool.models += netModels
      pools.set(key, pool)
      continue
    }
    const boxes = Math.ceil(netModels / unit.kit.models)
    const surplus = boxes * unit.kit.models - netModels
    // Several datasheets can share one kit (a combo box, or a box-only unit whose
    // kit is another unit's box) — merge into a single line per kit.
    const sameKit = lines.find((l) => !l.isValueBox && l.name === unit.kit.name)
    if (sameKit) {
      sameKit.quantity += boxes
      sameKit.lineTotalEUR = sameKit.unitPriceEUR * sameKit.quantity
    } else {
      lines.push({
        name: unit.kit.name,
        quantity: boxes,
        unitPriceEUR: unit.kit.priceEUR,
        lineTotalEUR: unit.kit.priceEUR * boxes,
        isValueBox: false,
        onlineOnly: !!unit.kit.onlineOnly,
        verified: !!unit.kit.verified,
        // Describe ONE box (the quantity column says how many) so the label is
        // correct both here and when an escalation step shows only the boxes added.
        covers: [
          `${unit.kit.models}× ${unit.name}`,
          ...(unit.kit.alsoBuilds ?? []).map(
            (ab) => `${ab.models}× ${unitById.get(ab.unitId)?.name ?? ab.unitId}`,
          ),
        ],
        url: unit.kit.url,
      })
    }
    for (const ab of unit.kit.alsoBuilds ?? []) {
      credits.set(ab.unitId, (credits.get(ab.unitId) ?? 0) + boxes * ab.models)
    }
    if (surplus > 0) {
      notes.push(`${unit.name}: ${boxes} box(es) leaves ${surplus} spare model(s).`)
      addSpare(unit.id, surplus)
    }
  }
  for (const { units, models } of pools.values()) {
    const kit = units[0].kit
    const boxes = Math.ceil(models / kit.models)
    const surplus = boxes * kit.models - models
    lines.push({
      name: kit.name,
      quantity: boxes,
      unitPriceEUR: kit.priceEUR,
      lineTotalEUR: kit.priceEUR * boxes,
      isValueBox: false,
      onlineOnly: !!kit.onlineOnly,
      verified: !!kit.verified,
      // One box; a shared kit builds any mix of the listed datasheets.
      covers: [`${kit.models}× ${units.map((u) => u.name).join(' / ')}`],
      url: kit.url,
    })
    if (surplus > 0) {
      notes.push(`${kit.name}: ${boxes} box(es) leaves ${surplus} spare model(s).`)
      // The spare can be built as any of the pooled datasheets.
      for (const u of units) addSpare(u.id, surplus)
    }
  }
  // Bonus models (alsoBuilds) nothing in the list used.
  for (const [unitId, models] of credits) addSpare(unitId, models)

  // Order: value boxes first, then by price descending.
  lines.sort((a, b) => Number(b.isValueBox) - Number(a.isValueBox) || b.lineTotalEUR - a.lineTotalEUR)

  const rrpTotalEUR = round2(lines.reduce((s, l) => s + l.lineTotalEUR, 0))
  const nonDiscountableEUR = round2(
    lines.filter((l) => l.onlineOnly).reduce((s, l) => s + l.lineTotalEUR, 0),
  )
  const discountableEUR = round2(rrpTotalEUR - nonDiscountableEUR)

  return {
    lines,
    rrpTotalEUR,
    discountableEUR,
    nonDiscountableEUR,
    notes,
    spare: [...spare].map(([unitId, models]) => ({ unitId, models })),
  }
}

/** Apply a retailer discount to the discountable portion only. */
export function discountedTotal(cost: CostBreakdown, pct: DiscountPercent): number {
  const discounted = cost.discountableEUR * (1 - pct / 100)
  return round2(discounted + cost.nonDiscountableEUR)
}

/**
 * New purchases needed to go from `prev` to `curr` (escalation step): boxes whose
 * quantity grew. Since each escalation list is a superset, box counts only rise,
 * so this is what you actually buy at this stage.
 */
export function purchaseDelta(prev: CostBreakdown | null, curr: CostBreakdown): PurchaseLine[] {
  const prevQty = new Map<string, number>()
  if (prev) for (const l of prev.lines) prevQty.set(l.name, (prevQty.get(l.name) ?? 0) + l.quantity)
  const out: PurchaseLine[] = []
  for (const l of curr.lines) {
    const had = prevQty.get(l.name) ?? 0
    const dq = l.quantity - had
    if (dq > 0) out.push({ ...l, quantity: dq, lineTotalEUR: round2(l.unitPriceEUR * dq) })
  }
  return out
}

/** Totals for an arbitrary set of purchase lines, honouring online-only discount rules. */
export function sumLines(lines: PurchaseLine[], pct: DiscountPercent): { rrp: number; pay: number } {
  const rrp = round2(lines.reduce((s, l) => s + l.lineTotalEUR, 0))
  const nonDisc = lines.filter((l) => l.onlineOnly).reduce((s, l) => s + l.lineTotalEUR, 0)
  const pay = round2((rrp - nonDisc) * (1 - pct / 100) + nonDisc)
  return { rrp, pay }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
