import type {
  Faction,
  GeneratedList,
  ListEntry,
  Mode,
  PointsBracket,
  Unit,
} from '../types'
import { isCharacter, pointsPerEuro } from './value'

// ---------------------------------------------------------------------------
// List generation
//
// Two modes:
//  - casual: "affordable above all". Seed the whole Combat Patrol, guarantee a
//    leader, then fill the remaining points with the best points-per-euro kits.
//  - competitive: use the faction's curated 11th-edition event netlist.
//
// Casual legality / taste rules:
//  - Epic Heroes are unique (max 1 of each).
//  - Any other datasheet: max 1 copy at 500 pts, max 2 copies at higher brackets
//    (keep lists varied, avoid spamming the same box).
// ---------------------------------------------------------------------------

/** Small seeded RNG so a given "seed" reproduces the same list. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted<T>(items: T[], weightOf: (t: T) => number, rand: () => number): T | undefined {
  const total = items.reduce((s, it) => s + Math.max(0, weightOf(it)), 0)
  if (total <= 0) return items.length ? items[Math.floor(rand() * items.length)] : undefined
  let r = rand() * total
  for (const it of items) {
    r -= Math.max(0, weightOf(it))
    if (r <= 0) return it
  }
  return items[items.length - 1]
}

function pointsOf(entries: ListEntry[]): number {
  return entries.reduce((s, e) => s + e.unit.points * e.count, 0)
}

function countIn(entries: ListEntry[], unitId: string): number {
  return entries.find((e) => e.unit.id === unitId)?.count ?? 0
}

function addUnit(entries: ListEntry[], unit: Unit, n = 1): void {
  const existing = entries.find((e) => e.unit.id === unit.id)
  if (existing) existing.count += n
  else entries.push({ unit, count: n })
}

function roleOrder(u: Unit): number {
  const order: Record<string, number> = {
    'epic-hero': 0,
    character: 1,
    battleline: 2,
    infantry: 3,
    mounted: 4,
    monster: 5,
    vehicle: 6,
    transport: 7,
  }
  return order[u.role] ?? 9
}

// --- Casual --------------------------------------------------------------

function generateCasual(faction: Faction, target: PointsBracket, seed: number): GeneratedList {
  const rand = mulberry32(seed)
  const entries: ListEntry[] = []
  const notes: string[] = []

  // Per-datasheet copy cap: no duplicates at 500, otherwise up to two.
  const dupeCap = target === 500 ? 1 : 2
  const capFor = (u: Unit) => (u.epicHero ? 1 : dupeCap)

  // 1. Seed the whole Combat Patrol (all its units) — the cheapest way to start
  //    an army — unless the models it builds already cost more than the limit.
  const cp = faction.valueBoxes[0]
  if (cp) {
    const cpEntries: ListEntry[] = []
    let cpPoints = 0
    for (const b of cp.builds) {
      const unit = faction.units.find((u) => u.id === b.unitId)
      if (!unit) continue
      const count = Math.max(1, Math.round(b.models / unit.models))
      cpEntries.push({ unit, count })
      cpPoints += unit.points * count
    }
    if (cpEntries.length && cpPoints <= target) {
      for (const e of cpEntries) addUnit(entries, e.unit, e.count)
      notes.push(
        `Seeded ${cp.name} (${cpPoints} pts of models) first — it's the cheapest way to buy these units.`,
      )
    } else if (cpEntries.length) {
      notes.push(`${cp.name} skipped: its ${cpPoints} pts of models exceed the ${target} pt limit.`)
    }
  }

  // 2. Guarantee a leader if the Combat Patrol didn't already provide one.
  const hasLeader = entries.some((e) => isCharacter(e.unit))
  if (!hasLeader) {
    const chars = faction.units.filter((u) => u.role === 'character')
    const leader = pickWeighted(chars, (u) => pointsPerEuro(u) * (u.flavor ?? 1), rand)
    if (leader && pointsOf(entries) + leader.points <= target) addUnit(entries, leader)
  }

  // 3. Fill the rest with the best points-per-euro kits (value dominates, with a
  //    light flavour nudge and randomness so rerolls vary), honouring the caps.
  const weight = (u: Unit) => Math.pow(pointsPerEuro(u), 2) * (0.6 + 0.4 * ((u.flavor ?? 1) / 5))
  let guard = 0
  while (guard++ < 500) {
    const remaining = target - pointsOf(entries)
    if (remaining <= 0) break
    const legal = faction.units.filter(
      (u) => u.points <= remaining && countIn(entries, u.id) < capFor(u),
    )
    if (!legal.length) break
    const pick = pickWeighted(legal, weight, rand)
    if (!pick) break
    addUnit(entries, pick)
  }

  const total = pointsOf(entries)
  notes.push(
    `Built for value: best points-per-euro kits, max ${dupeCap} of any datasheet` +
      `${dupeCap === 1 ? ' (no duplicates at 500 pts)' : ''}; Epic Heroes are unique.`,
  )
  if (target - total > 45) {
    notes.push(`${total} / ${target} pts — reroll for a tighter fit, or spend the rest on wargear.`)
  }

  entries.sort((a, b) => roleOrder(a.unit) - roleOrder(b.unit) || b.unit.points - a.unit.points)
  return { faction, mode: 'casual', targetPoints: target, entries, totalPoints: total, notes }
}

// --- Competitive ---------------------------------------------------------

function generateCompetitive(faction: Faction, target: PointsBracket): GeneratedList {
  const notes: string[] = []
  const base = faction.competitiveLists[2000] ?? faction.competitiveLists[target]

  if (!base) {
    return {
      faction,
      mode: 'competitive',
      targetPoints: target,
      entries: [],
      totalPoints: 0,
      notes: ['No competitive list is seeded for this faction yet.'],
    }
  }

  const entries: ListEntry[] = []
  for (const e of base) {
    const unit = faction.units.find((u) => u.id === e.unitId)
    if (unit) addUnit(entries, unit, e.count)
  }
  notes.push('Curated 2000 pt list based on recent 11th-edition event archetypes.')

  const total = pointsOf(entries)
  entries.sort((a, b) => roleOrder(a.unit) - roleOrder(b.unit) || b.unit.points - a.unit.points)
  return { faction, mode: 'competitive', targetPoints: target, entries, totalPoints: total, notes }
}

export function generateList(
  faction: Faction,
  mode: Mode,
  target: PointsBracket,
  seed = Date.now(),
): GeneratedList {
  return mode === 'competitive'
    ? generateCompetitive(faction, target)
    : generateCasual(faction, target, seed)
}
