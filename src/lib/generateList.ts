import type { Faction, GeneratedList, ListEntry, PointsBracket, Unit } from '../types'
import { isCharacter, pointsPerEuro } from './value'

// ---------------------------------------------------------------------------
// Casual list generation — "affordable above all", with a thematic backbone.
//
// Process:
//  1. Seed the whole Combat Patrol (all units it builds) unless its points
//     exceed the limit — the cheapest way to buy several units at once.
//  2. Ensure a battleline backbone: at least 100 pts of battleline per 1000 pts.
//  3. Guarantee a leader character.
//  4. Fill the rest by best points-per-euro.
//
// Copy caps: max 1 of any datasheet at 500 pts, max 2 at higher brackets;
// Epic Heroes unique.
//
// (Competitive netlists were removed for now — see faction competitiveLists,
//  kept as a future TODO.)
// ---------------------------------------------------------------------------

/** Battleline points wanted per 1000 pts of army. */
const BATTLELINE_PTS_PER_1000 = 100

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

function battlelinePointsOf(entries: ListEntry[]): number {
  return entries
    .filter((e) => e.unit.role === 'battleline')
    .reduce((s, e) => s + e.unit.points * e.count, 0)
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

export function generateList(
  faction: Faction,
  target: PointsBracket,
  seed = Date.now(),
): GeneratedList {
  const rand = mulberry32(seed)
  const entries: ListEntry[] = []
  const notes: string[] = []

  // Per-datasheet copy cap: no duplicates at 500, otherwise up to two.
  const dupeCap = target === 500 ? 1 : 2
  const capFor = (u: Unit) => (u.epicHero ? 1 : dupeCap)

  // 1. Seed the whole Combat Patrol unless its models already exceed the limit.
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
  } else {
    notes.push('No Combat Patrol exists for this faction — built from individual kits.')
  }

  // 2. Battleline backbone — at least 100 pts of battleline per 1000 pts.
  const minBattleline = Math.round((target / 1000) * BATTLELINE_PTS_PER_1000)
  let bGuard = 0
  while (battlelinePointsOf(entries) < minBattleline && bGuard++ < 50) {
    const remaining = target - pointsOf(entries)
    const legal = faction.units.filter(
      (u) => u.role === 'battleline' && u.points <= remaining && countIn(entries, u.id) < capFor(u),
    )
    if (!legal.length) break
    const pick = pickWeighted(legal, (u) => pointsPerEuro(u) * (u.flavor ?? 1), rand)
    if (!pick) break
    addUnit(entries, pick)
  }
  const blNow = battlelinePointsOf(entries)
  if (blNow >= minBattleline) {
    notes.push(`Battleline backbone: ${blNow} pts (target ≥ ${minBattleline}).`)
  } else if (minBattleline > 0) {
    notes.push(`Only ${blNow} pts of battleline available (wanted ≥ ${minBattleline}).`)
  }

  // 3. Guarantee a leader if nothing so far is a character.
  if (!entries.some((e) => isCharacter(e.unit))) {
    const chars = faction.units.filter((u) => u.role === 'character')
    const leader = pickWeighted(chars, (u) => pointsPerEuro(u) * (u.flavor ?? 1), rand)
    if (leader && pointsOf(entries) + leader.points <= target) addUnit(entries, leader)
  }

  // 4. Fill the rest with the best points-per-euro kits.
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
