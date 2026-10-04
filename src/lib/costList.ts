import type {
  CostBreakdown,
  DiscountPercent,
  GeneratedList,
  PurchaseLine,
  Unit,
  ValueBox,
} from '../types'
import { isBoxOnly } from './value'

// ---------------------------------------------------------------------------
// Costing
//
// Turn a generated army list into a shopping list of boxes, minimising cost by
// preferring value boxes (Combat Patrols) whenever they actually save money.
//
// Strategy:
//  1. Compute how many models of each datasheet we need.
//  2. Try every combination of value boxes (0…a few of each box that covers
//     >= 2 needed unit-types) and keep the cheapest total. Exhaustive rather
//     than greedy: estimating a box's saving per unit mis-prices combo kits (a
//     €66 box building 2 Obliterators AND a Venomcrawler counted as €132) and
//     let a big Battleforce beat a cheaper Combat Patrol (fixed 2026-10-04).
//  3. Cover whatever remains with individual unit kits (ceil by box size).
//  4. Track surplus (paid-for but unused) models — reported as notes and as
//     structured `spare` models, which the generator fields when it can.
// ---------------------------------------------------------------------------

interface Need {
  unitId: string
  name: string
  modelsNeeded: number
}

/** Most copies of one value box ever tried (and combinations tried overall). */
const MAX_BOX_QTY = 3
const MAX_COMBOS = 256

export function costList(list: GeneratedList): CostBreakdown {
  const { faction, entries } = list

  // 1. Needs in models.
  const needs = new Map<string, Need>()
  for (const e of entries) {
    const modelsNeeded = e.unit.models * e.count
    const existing = needs.get(e.unit.id)
    if (existing) existing.modelsNeeded += modelsNeeded
    else needs.set(e.unit.id, { unitId: e.unit.id, name: e.unit.name, modelsNeeded })
  }

  // 2. Candidate boxes (cover >= 2 needed unit-types) and how many of each could
  //    still be used; then every combination, keeping the cheapest result.
  const candidates = faction.valueBoxes
    .filter((box) => box.builds.filter((b) => (needs.get(b.unitId)?.modelsNeeded ?? 0) > 0).length >= 2)
    .map((box) => ({
      box,
      max: Math.min(
        MAX_BOX_QTY,
        Math.max(...box.builds.map((b) => Math.ceil((needs.get(b.unitId)?.modelsNeeded ?? 0) / b.models))),
      ),
    }))
  let combos: number[][] = [[]]
  for (const { max } of candidates) {
    combos = combos.flatMap((c) => Array.from({ length: max + 1 }, (_, q) => [...c, q]))
    if (combos.length > MAX_COMBOS) combos = combos.slice(0, MAX_COMBOS)
  }
  let best: CostBreakdown | undefined
  let bestBoxes = 0
  for (const combo of combos) {
    const counts = new Map(candidates.map((c, i) => [c.box.id, combo[i] ?? 0] as const))
    const result = costWithBoxes(faction, needs, counts)
    const boxes = combo.reduce((a, b) => a + b, 0)
    // Cheapest wins; on a tie prefer more value boxes (more spare models).
    if (!best || result.rrpTotalEUR < best.rrpTotalEUR - 0.001 ||
        (Math.abs(result.rrpTotalEUR - best.rrpTotalEUR) <= 0.001 && boxes > bestBoxes)) {
      best = result
      bestBoxes = boxes
    }
  }
  return best!
}

/** Steps 2b–4 for a fixed choice of value boxes (`counts`: box id → quantity). */
function costWithBoxes(
  faction: GeneratedList['faction'],
  baseNeeds: Map<string, Need>,
  counts: Map<string, number>,
): CostBreakdown {
  const unitById = new Map(faction.units.map((u) => [u.id, u]))
  const needs = new Map([...baseNeeds].map(([id, n]) => [id, { ...n }]))

  const lines: PurchaseLine[] = []
  const notes: string[] = []
  const valueBoxCounts = new Map<string, number>()
  const spare = new Map<string, number>() // unitId -> paid-for, unfielded models
  const addSpare = (unitId: string, models: number) => {
    if (models > 0 && unitById.has(unitId)) spare.set(unitId, (spare.get(unitId) ?? 0) + models)
  }

  // Consume the chosen boxes: subtract their contents from needs; the rest is spare.
  for (const box of faction.valueBoxes) {
    const qty = counts.get(box.id) ?? 0
    for (let k = 0; k < qty; k++) {
      for (const b of box.builds) {
        const need = needs.get(b.unitId)
        const used = need ? Math.min(b.models, need.modelsNeeded) : 0
        if (need) need.modelsNeeded -= used
        addSpare(b.unitId, b.models - used)
      }
    }
    if (qty > 0) valueBoxCounts.set(box.id, qty)
  }

  for (const [boxId, qty] of valueBoxCounts) {
    const box: ValueBox = faction.valueBoxes.find((b) => b.id === boxId)!
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
  //    `alsoBuilds`) are costed first so their credits reach the byproducts —
  //    units sold as themselves before box-only ones (a Sporocyst's 6 Spore
  //    Mines must be credited before Spore Mines would buy Biovore boxes).
  const credits = new Map<string, number>() // unitId -> free models already owned
  const remainingNeeds = [...needs.values()].filter((n) => n.modelsNeeded > 0)
  const costOrder = (unitId: string) => {
    const u = unitById.get(unitId)
    if (!u?.kit.alsoBuilds?.length) return 2
    return isBoxOnly(u) ? 1 : 0
  }
  remainingNeeds.sort((a, b) => costOrder(a.unitId) - costOrder(b.unitId))
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
