import type {
  Faction,
  GeneratedList,
  ListEntry,
  Mode,
  PointsBracket,
  Unit,
} from '../types'

// ---------------------------------------------------------------------------
// List generation
//
// Two modes:
//  - casual: build a legal, flavourful list up to the points target, honouring
//    a simplified version of the 40k rules of engagement.
//  - competitive: use the faction's curated netlist, trimmed to fit the target.
//
// Simplified legality rules enforced for casual lists:
//  - Exactly one WARLORD-tier leader minimum (we always include >=1 character).
//  - Epic Heroes are unique (max 1 of each, and they are 0-3 total by taste).
//  - Any non-character datasheet may appear at most 3 times.
//  - Battleline units may appear more often (up to 6) to fill bodies.
// ---------------------------------------------------------------------------

const MAX_DUPES_DEFAULT = 3
const MAX_DUPES_BATTLELINE = 6

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
  if (total <= 0) return undefined
  let r = rand() * total
  for (const it of items) {
    r -= Math.max(0, weightOf(it))
    if (r <= 0) return it
  }
  return items[items.length - 1]
}

function maxDupesFor(unit: Unit): number {
  if (unit.epicHero) return 1
  if (unit.role === 'battleline') return MAX_DUPES_BATTLELINE
  return MAX_DUPES_DEFAULT
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

// --- Casual --------------------------------------------------------------

function generateCasual(faction: Faction, target: PointsBracket, seed: number): GeneratedList {
  const rand = mulberry32(seed)
  const entries: ListEntry[] = []
  const notes: string[] = []

  const characters = faction.units.filter((u) => u.role === 'character')
  const epicHeroes = faction.units.filter((u) => u.epicHero)
  const battleline = faction.units.filter((u) => u.role === 'battleline')
  const others = faction.units.filter(
    (u) => u.role !== 'character' && u.role !== 'battleline' && !u.epicHero,
  )

  // 1. Always start with at least one leader.
  if (characters.length) {
    const leader = pickWeighted(characters, (u) => u.flavor ?? 1, rand)!
    addUnit(entries, leader)
  }

  // 2. At larger games, sometimes headline an Epic Hero (never over-budget it).
  if (epicHeroes.length && target >= 1000 && rand() < 0.7) {
    const affordable = epicHeroes.filter((u) => u.points <= target * 0.3)
    const hero = pickWeighted(affordable.length ? affordable : epicHeroes, (u) => u.flavor ?? 1, rand)
    if (hero && pointsOf(entries) + hero.points <= target) addUnit(entries, hero)
  }

  // 3. Guarantee some battleline bodies (roughly one unit per 500 pts).
  const wantBattleline = Math.max(1, Math.round(target / 500))
  for (let i = 0; i < wantBattleline && battleline.length; i++) {
    const bl = pickWeighted(
      battleline.filter((u) => countIn(entries, u.id) < maxDupesFor(u)),
      (u) => u.flavor ?? 1,
      rand,
    )
    if (bl && pointsOf(entries) + bl.points <= target) addUnit(entries, bl)
  }

  // 4. Fill the remaining points, biased toward flavourful picks.
  const pool = [...battleline, ...others, ...characters]
  let guard = 0
  while (guard++ < 500) {
    const remaining = target - pointsOf(entries)
    if (remaining <= 0) break

    const legal = pool.filter(
      (u) => u.points <= remaining && countIn(entries, u.id) < maxDupesFor(u),
    )
    if (!legal.length) break

    // Bias toward bigger, iconic units early and cheaper filler as we top off.
    const pick = pickWeighted(
      legal,
      (u) => (u.flavor ?? 1) * (remaining > target * 0.25 ? u.points : 100 / Math.max(1, u.points)),
      rand,
    )
    if (!pick) break
    addUnit(entries, pick)
  }

  const total = pointsOf(entries)
  notes.push(
    `Casual list assembled to ${total} / ${target} pts. Max 3 of any datasheet (6 for battleline); Epic Heroes are unique.`,
  )
  if (target - total > 40) {
    notes.push(`~${target - total} pts left over — reroll for a tighter fit, or add wargear/upgrades.`)
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

  // Materialise the netlist.
  const entries: ListEntry[] = []
  for (const e of base) {
    const unit = faction.units.find((u) => u.id === e.unitId)
    if (unit) addUnit(entries, unit, e.count)
  }

  // Trim to fit smaller brackets: drop the least "core" units (lowest flavor,
  // then cheapest support) until we are at or under the target.
  if (target < 2000) {
    notes.push(
      `Scaled a 2000 pt tournament list down to ${target} pts by trimming support units. ` +
        `Treat this as a starting skeleton, not an event-legal list.`,
    )
    const trimOrder = [...entries].sort(
      (a, b) => (a.unit.flavor ?? 1) - (b.unit.flavor ?? 1) || a.unit.points - b.unit.points,
    )
    let ti = 0
    while (pointsOf(entries) > target && ti < trimOrder.length * 4) {
      const target2 = trimOrder[ti % trimOrder.length]
      const live = entries.find((e) => e.unit.id === target2.unit.id)
      if (live && live.count > 0) {
        live.count -= 1
        if (live.count === 0) entries.splice(entries.indexOf(live), 1)
      }
      ti++
    }
  } else {
    notes.push('Curated 2000 pt list based on recent 11th-edition event archetypes.')
  }

  const total = pointsOf(entries)
  entries.sort((a, b) => roleOrder(a.unit) - roleOrder(b.unit) || b.unit.points - a.unit.points)
  return { faction, mode: 'competitive', targetPoints: target, entries, totalPoints: total, notes }
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
  mode: Mode,
  target: PointsBracket,
  seed = Date.now(),
): GeneratedList {
  return mode === 'competitive'
    ? generateCompetitive(faction, target)
    : generateCasual(faction, target, seed)
}
