import type { Faction, GeneratedList, ListEntry, PointsBracket, Unit } from '../types'
import { copiesOf, isLeader, matchLeaders } from './attachments'
import { costList } from './costList'
import {
  copyPoints,
  entryPoints,
  isBoxOnly,
  isCharacter,
  pointsPerEuro,
  unitCategory,
  unitCostEUR,
  unitPoints,
} from './value'
import type { UnitCategory } from '../types'

// ---------------------------------------------------------------------------
// List generation — "affordable above all", with a thematic backbone.
//
// `augmentList` grows an existing list up to a points target and is the shared
// core of both modes:
//   - Quick list: augment an empty list to the chosen bracket.
//   - Escalation: augment 500 → 1000 → 1500 → 2000, carrying each list forward,
//     so a collection grows by re-using everything already bought.
//
// Steps: (1) seed the Combat Patrol — cheapest units first, as many as fit the
// budget (a >500pt Combat Patrol is fielded as a subset at 500 and completed as
// the list escalates); (2) leaders for leadable units; (3) guarantee a
// character; (4) value fill. Battleline is not forced — it competes on value /
// flavour like everything else.
//
// Leaders need a bodyguard: a character with a `leads` list only joins while a
// unit it can lead is in the list and not yet led (one leader per unit, checked
// as a bipartite matching). Characters that lead nothing (Daemon Princes,
// Knights, lone operatives…) aren't limited this way, so HQ-heavy armies keep
// their big characters; Combat Patrol / paid-for spares are exempt too.
// On top of that, each HQ-sized character already in the list (the 'character'
// category — not monster / vehicle characters) halves the appeal of the next
// one (`CHARACTER_DECAY`): a count-based brake the points-share profile can't
// give, since 20% of 2000 pts is one big hero or six cheap ones.
//
// Rules (official MFM unit limits): per datasheet max 1 @500, 2 @1000, 3 @1500,
// 3 @2000 — doubled for Battleline / Dedicated Transport (so 6 @2000). Epic
// Heroes unique. Characters stricter: unique unless a sub-100pt leader has 2+
// units to lead. Later copies cost the escalated price (from the copy each
// datasheet escalates at). No non-Combat-Patrol unit over the bracket size cap
// (120/200/350/∞).
//
// Combo boxes: a kit whose `alsoBuilds` yields complete units of other datasheets
// (Horrors of the Hive, Heroes of the Chapter, Talons of the Emperor…) is valued
// as the WHOLE box — every unit it builds over its price — and picking one unit
// adds its box-mates too, as long as they're legal and all fit the points left.
// Otherwise the unit is valued and added alone.
//
// Value ↔ Flavour (`GenerateOptions.flavour`, 0..1): every pick is weighted by a
// blend of points-per-euro (value) and a theme score (flavour): the unit's own
// `flavor` rating, a big bonus for faction-`exclusive` units, and its `tags`
// matched against the faction's `identity` (e.g. Salamanders favour flamer/melta).
// Default (`defaultFlavour`): factions WITH an identity (the SM Chapters) build
// pure-flavour lists — simulations showed they cost about the same as value lists
// (−4…+8% at 2000 pts; White Scars +17%, bikes being dear). Factions without one
// keep pure value: there "flavour" is just the generic rating and mostly raises
// the price (Custodes +47%). Aeldari Craftworlds sit halfway (`Faction.flavour`
// 0.5): their signature units are poor value, so full flavour cost +10…32% while
// halfway is clearly themed for +7…14%. There is no UI control for it.
//
// Use what you buy: before every pick, anything the shopping list has paid for
// but the army doesn't field (`costList(...).spare` — e.g. the Screamer-Killer of
// a Horrors of the Hive box, a gaunt box's Ripper, unused Combat Patrol units) is
// fielded first, whenever it's legal and fits. Like Combat Patrol units, these
// are exempt from the size cap — the box is already bought.
// ---------------------------------------------------------------------------

const LEADER_CHANCE = 0.5
const CHARACTER_DECAY = 0.5
export const BRACKETS: PointsBracket[] = [500, 1000, 1500, 2000]
const SIZE_CAP: Record<number, number> = { 500: 120, 1000: 200, 1500: 350, 2000: Infinity }
// Official per-datasheet copy limit by bracket (doubled for battleline/transport).
const DATASHEET_LIMIT: Record<number, number> = { 500: 1, 1000: 2, 1500: 3, 2000: 3 }

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
  return entries.reduce((s, e) => s + entryPoints(e.unit, e.count), 0)
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

/** Grow `base` into a list of `target` points, carrying over everything in base. */
/** Generation options (no UI; mainly for tests / experiments). */
export interface GenerateOptions {
  /** 0 = pick on value (points per euro) only … 1 = pick on theme only. */
  flavour?: number
}

/**
 * The faction's own `flavour` if set; else full flavour with a thematic identity
 * (SM Chapters), pure value without one.
 */
export function defaultFlavour(faction: Faction): number {
  if (faction.flavour !== undefined) return faction.flavour
  return faction.identity && Object.keys(faction.identity).length ? 1 : 0
}

/**
 * How well a unit fits its faction's theme (≈ 0.5 … 15): its own flavour rating,
 * ×3 if the faction alone can field it (or it's a `signature` unit), and
 * ×(1 + identity-tag weights, max 6).
 */
export function themeScore(faction: Faction, u: Unit): number {
  const base = (u.flavor ?? 3) / 3
  const tagScore = Math.min(
    6,
    (u.tags ?? []).reduce((s, t) => s + (faction.identity?.[t] ?? 0), 0),
  )
  const special = u.exclusive || faction.signature?.includes(u.id)
  return base * (special ? 3 : 1) * (1 + tagScore)
}

function augmentList(
  faction: Faction,
  base: ListEntry[],
  target: PointsBracket,
  rand: () => number,
  opts: GenerateOptions = {},
): GeneratedList {
  // Clone so escalation never mutates the previous stage.
  const entries: ListEntry[] = base.map((e) => ({ unit: e.unit, count: e.count }))
  const startedEmpty = base.length === 0
  const notes: string[] = []

  // Official per-datasheet copy limit (doubled for battleline / dedicated transport).
  const baseLimit = DATASHEET_LIMIT[target] ?? 3
  const datasheetLimit = (u: Unit) =>
    target === 500 ? 1 : baseLimit * (u.role === 'battleline' || u.role === 'transport' ? 2 : 1)
  const capFor = (u: Unit): number => {
    if (u.epicHero) return 1
    if (!isCharacter(u)) return datasheetLimit(u)
    // Characters are stricter: unique, unless a sub-100pt leader has 2+ units to lead.
    if (u.points >= 100) return 1
    const leads = u.leads ?? []
    const leadableUnits = leads.length
      ? entries.filter((e) => leads.includes(e.unit.id)).reduce((s, e) => s + e.count, 0)
      : 0
    return Math.min(leadableUnits >= 2 ? 2 : 1, datasheetLimit(u))
  }
  // Cost of adding the NEXT copy of a unit (escalated once past its threshold).
  const nextCopyCost = (u: Unit) => copyPoints(u, countIn(entries, u.id) + 1)
  const maxUnitPoints = faction.ignoreSizeCap ? Infinity : SIZE_CAP[target] ?? Infinity
  const withinSize = (u: Unit) => u.points <= maxUnitPoints
  // Flavour exclusivity: at most one model across a mutex group (e.g. the three
  // Hive Tyrant variants) — addable only while the group is empty.
  const groupFree = (u: Unit) =>
    !u.exclusiveGroup ||
    entries
      .filter((e) => e.unit.exclusiveGroup === u.exclusiveGroup)
      .reduce((s, e) => s + e.count, 0) === 0
  // A Dedicated Transport is only ever added to carry a unit already in the
  // list, and (as a simplification) each transport carries a single unit — so
  // it's addable only while a transportable unit remains uncovered.
  const transportOK = (u: Unit) => {
    if (u.role !== 'transport') return true
    const carriable = entries
      .filter((e) => (u.transports ?? []).includes(e.unit.id))
      .reduce((s, e) => s + e.count, 0)
    return carriable > countIn(entries, u.id)
  }

  // Leaders need a bodyguard — adding character `u` (if it leads anything) must
  // grow the maximum leader↔unit matching, i.e. some unit it can lead is still
  // free once every leader already in the list has one (one leader per unit).
  const leaderOK = (u: Unit): boolean => {
    if (!isLeader(u)) return true
    const all = copiesOf(entries)
    const leaders = all.filter((c) => isLeader(c.unit)).map((c) => c.unit)
    const guards = all.filter((c) => !isCharacter(c.unit)).map((c) => c.unit)
    const matched = (ls: Unit[]) => matchLeaders(ls, guards).filter((g) => g >= 0).length
    return matched([...leaders, u]) > matched(leaders)
  }

  // Diminishing returns on HQ-sized characters (see header).
  const hqDecay = () =>
    Math.pow(
      CHARACTER_DECAY,
      entries.filter((e) => unitCategory(e.unit) === 'character').reduce((s, e) => s + e.count, 0),
    )
  const characterDecay = (u: Unit) => (unitCategory(u) === 'character' ? hqDecay() : 1)

  // Combo boxes — the box-mates a pick of `u` would bring along: enough copies of
  // each complete unit its kit also builds to match one more box, skipping any
  // mate that's capped, over the size cap or blocked by its exclusive group.
  const comboMates = (u: Unit): { unit: Unit; n: number }[] =>
    (u.kit.alsoBuilds ?? []).flatMap((b) => {
      const mate = faction.units.find((x) => x.id === b.unitId)
      const perBox = mate ? Math.floor(b.models / mate.models) : 0
      // No size cap for mates: buying the box already commits to them.
      if (!mate || perBox < 1 || !groupFree(mate)) return []
      const have = countIn(entries, mate.id)
      const want = (countIn(entries, u.id) + 1) * perBox - have
      const n = Math.min(want, capFor(mate) - have)
      return n > 0 ? [{ unit: mate, n }] : []
    })
  const matesCost = (mates: { unit: Unit; n: number }[]) =>
    mates.reduce((s, { unit, n }) => {
      const have = countIn(entries, unit.id)
      for (let k = 1; k <= n; k++) s += copyPoints(unit, have + k)
      return s
    }, 0)
  // Mates to add with `u`, or none if the whole group doesn't fit `remaining`.
  const comboFor = (u: Unit, remaining: number) => {
    const mates = comboMates(u)
    return mates.length && nextCopyCost(u) + matesCost(mates) <= remaining ? mates : []
  }
  // Value of picking `u`: the whole box's points over its price when the combo fits.
  const valueOf = (u: Unit, remaining: number) => {
    const mates = comboFor(u, remaining)
    if (!mates.length) return pointsPerEuro(u)
    const pts = unitPoints(u) + mates.reduce((s, m) => s + unitPoints(m.unit) * m.n, 0)
    return pts / unitCostEUR(u)
  }
  // A box-only unit (its kit is a shared box under another name — Neurotyrant →
  // Horrors of the Hive, Apothecary → Heroes of the Chapter) may only be picked
  // when its box-mates fit too, so buying the box never strands half of it.
  // Units with their own kit + a bonus extra (Termagants + Ripper) pick freely.
  const comboOK = (u: Unit, remaining: number) =>
    !isBoxOnly(u) ||
    !comboMates(u).length ||
    comboFor(u, remaining).length > 0

  // Value ↔ Flavour blend for a pick. `power` sharpens the preference (the main
  // fill uses 3; the backbone / leader picks a gentler 1). Theme gets 1.5× the
  // exponent so the default middle setting already reads clearly as the faction.
  const flavour = Math.max(0, Math.min(1, opts.flavour ?? defaultFlavour(faction)))
  const appeal = (u: Unit, remaining: number, power: number) =>
    Math.pow(valueOf(u, remaining), power * (1 - flavour)) *
    Math.pow(themeScore(faction, u), 1.5 * power * flavour)

  // Add `u` plus its box-mates (when they all fit).
  const addPick = (u: Unit, remaining: number) => {
    const mates = comboFor(u, remaining)
    addUnit(entries, u)
    for (const m of mates) addUnit(entries, m.unit, m.n)
  }

  // Field one whole spare unit (paid-for but unused models), if any is legal and
  // fits; the biggest first so the most bought value gets used. True if added.
  const fieldSpare = (): boolean => {
    const remaining = target - pointsOf(entries)
    const shopping = costList({ faction, mode: 'casual', targetPoints: target, entries, totalPoints: 0, notes: [] })
    const options = shopping.spare
      .map((s) => ({ unit: faction.units.find((u) => u.id === s.unitId)!, models: s.models }))
      .filter(
        ({ unit, models }) =>
          unit &&
          models >= unit.models &&
          groupFree(unit) &&
          transportOK(unit) &&
          countIn(entries, unit.id) < capFor(unit) &&
          nextCopyCost(unit) <= remaining,
      )
      .sort((a, b) => nextCopyCost(b.unit) - nextCopyCost(a.unit))
    if (!options.length) return false
    addUnit(entries, options[0].unit)
    return true
  }
  const fieldSpares = () => {
    let g = 0
    while (g++ < 50 && fieldSpare()) {
      /* keep fielding */
    }
  }

  // Composition profile — softly steer the list toward the army's thematic shape
  // (target share of points per category). Unshaped factions keep a flat bias.
  const profile = faction.profile
  const profileSum = profile ? Object.values(profile).reduce((a, b) => a + (b ?? 0), 0) : 0
  const targetPts = (cat: UnitCategory) =>
    profile && profileSum > 0 ? ((profile[cat] ?? 0) / profileSum) * target : null
  const pointsInCat = (cat: UnitCategory) =>
    entries
      .filter((e) => unitCategory(e.unit) === cat)
      .reduce((s, e) => s + entryPoints(e.unit, e.count), 0)
  // A gentle nudge: >1 when the unit's category is under its target share, easing
  // toward a floor once it's over. Soft on purpose — an army that's meant to be
  // character- or monster-heavy still fields 1–2 big centrepieces happily; this
  // only stops a category from running away (e.g. a list of 15 cheap HQs).
  const profileFactor = (u: Unit) => {
    const tgt = targetPts(unitCategory(u))
    if (tgt === null) return 1
    const f = (tgt - pointsInCat(unitCategory(u))) / Math.max(tgt, 1) + 0.15
    return Math.max(0.03, Math.min(1.2, f))
  }

  // 1. Combat Patrol — ensure its units are present, cheapest first, adding only
  //    what fits the budget (the rest waits for a bigger bracket). CP units are
  //    exempt from the size cap. Only when the faction can field the whole box:
  //    a sub-faction that excludes some of its units (a Catachan regiment can't
  //    use the Cadian Combat Patrol's Kasrkin) doesn't force the leftovers in.
  const cp = faction.valueBoxes[0]
  const cpUsable = !!cp && cp.builds.every((b) => faction.units.some((u) => u.id === b.unitId))
  if (cp && cpUsable) {
    const builds = cp.builds
      .map((b) => {
        const unit = faction.units.find((u) => u.id === b.unitId)
        return unit ? { unit, count: Math.max(1, Math.round(b.models / unit.models)) } : null
      })
      .filter((x): x is { unit: Unit; count: number } => !!x)
      .sort((a, b) => a.unit.points - b.unit.points)
    // Round-robin: one copy of every box unit before any second copies, so a
    // partly-fielded box still covers as many of its unit types as possible
    // (e.g. Captain + Sanguinary Guard + Assault Intercessors, not 2× Guard).
    let added = 0
    let deferred = 0
    const maxCopies = Math.max(0, ...builds.map((b) => b.count))
    for (let copy = 1; copy <= maxCopies; copy++) {
      for (const { unit, count } of builds) {
        if (copy > count || countIn(entries, unit.id) >= copy) continue
        if (pointsOf(entries) + nextCopyCost(unit) <= target) {
          addUnit(entries, unit, 1)
          added++
        } else {
          deferred++
        }
      }
    }
    if (added > 0) {
      notes.push(
        deferred > 0
          ? `Started with ${cp.name} — ${deferred} of its unit(s) held back until a larger list, but buy the whole box now.`
          : `Includes the whole ${cp.name} (cheapest way to buy these units).`,
      )
    }
  } else if (startedEmpty) {
    notes.push(
      cp
        ? `${cp.name} doesn't fit this sub-faction — built from individual kits.`
        : 'No Combat Patrol exists for this faction — built from individual kits.',
    )
  }

  // Use anything already paid for (e.g. escalation: last stage's spare box-mates).
  fieldSpares()

  // 2. Leaders — give a leadable unit a character to lead it (sometimes).
  const leadableSet = new Set(faction.units.flatMap((u) => u.leads ?? []))
  const hasLeaderFor = (unitId: string) => entries.some((e) => (e.unit.leads ?? []).includes(unitId))
  for (const e of [...entries]) {
    if (!leadableSet.has(e.unit.id) || hasLeaderFor(e.unit.id)) continue
    // Half the time, less with every HQ already in (diminishing returns).
    if (rand() > LEADER_CHANCE * hqDecay()) continue
    // Respect a character-light profile: stop attaching extra HQs once characters
    // run well past their share (keeps a sane cap without flattening HQ-led armies).
    const charTgt = targetPts('character')
    if (charTgt !== null && pointsInCat('character') > 1.3 * charTgt) continue
    const candidates = faction.units.filter(
      (u) =>
        (u.leads ?? []).includes(e.unit.id) &&
        withinSize(u) &&
        groupFree(u) &&
        leaderOK(u) &&
        countIn(entries, u.id) < capFor(u) &&
        pointsOf(entries) + nextCopyCost(u) <= target &&
        comboOK(u, target - pointsOf(entries)),
    )
    const remaining = target - pointsOf(entries)
    const leader = pickWeighted(candidates, (u) => appeal(u, remaining, 1) * (u.flavor ?? 1), rand)
    if (leader) addPick(leader, remaining)
  }

  // 3. Guarantee at least one character — one with a unit to lead if possible.
  if (!entries.some((e) => isCharacter(e.unit))) {
    const remaining = target - pointsOf(entries)
    const all = faction.units.filter(
      (u) => u.role === 'character' && withinSize(u) && comboOK(u, remaining),
    )
    const led = all.filter(leaderOK)
    const chars = led.length ? led : all
    const leader = pickWeighted(chars, (u) => appeal(u, remaining, 1) * (u.flavor ?? 1), rand)
    if (leader && nextCopyCost(leader) <= remaining) addPick(leader, remaining)
  }

  // 4. Fill the rest with the best points-per-euro kits.
  const weight = (u: Unit, remaining: number) =>
    appeal(u, remaining, 3) * (0.6 + 0.4 * ((u.flavor ?? 1) / 5)) * profileFactor(u) * characterDecay(u) *
    (u.pickWeight ?? 1)
  let guard = 0
  while (guard++ < 500) {
    if (target - pointsOf(entries) <= 0) break
    // Paid-for-but-unused units always come before new purchases.
    if (fieldSpare()) continue
    const remaining = target - pointsOf(entries)
    const legal = faction.units.filter(
      (u) =>
        withinSize(u) &&
        groupFree(u) &&
        transportOK(u) &&
        leaderOK(u) &&
        nextCopyCost(u) <= remaining &&
        countIn(entries, u.id) < capFor(u) &&
        comboOK(u, remaining),
    )
    if (!legal.length) break
    const pick = pickWeighted(legal, (u) => weight(u, remaining), rand)
    if (!pick) break
    addPick(pick, remaining)
  }

  const total = pointsOf(entries)
  const limitNote =
    target === 500 ? 'no duplicate datasheets' : `max ${baseLimit} of a datasheet (${baseLimit * 2} battleline)`
  notes.push(
    `${limitNote}; Epic Heroes unique; characters single unless a sub-100 pt leader has 2+ units to lead` +
      `${Number.isFinite(maxUnitPoints) ? `; no unit over ${maxUnitPoints} pts outside the Combat Patrol` : ''}.`,
  )
  if (target - total > 45) {
    notes.push(`${total} / ${target} pts — reroll for a tighter fit, or add wargear.`)
  }

  entries.sort((a, b) => roleOrder(a.unit) - roleOrder(b.unit) || b.unit.points - a.unit.points)
  return { faction, mode: 'casual', targetPoints: target, entries, totalPoints: total, notes }
}

/** Quick list: build a single list at the chosen bracket. */
export function generateList(
  faction: Faction,
  target: PointsBracket,
  seed = Date.now(),
  opts: GenerateOptions = {},
): GeneratedList {
  return augmentList(faction, [], target, mulberry32(seed), opts)
}

/** Escalation: 500 → 2000, each list re-using the content of the previous one. */
export function generateEscalation(
  faction: Faction,
  seed = Date.now(),
  opts: GenerateOptions = {},
): GeneratedList[] {
  const rand = mulberry32(seed)
  const stages: GeneratedList[] = []
  let base: ListEntry[] = []
  for (const target of BRACKETS) {
    const list = augmentList(faction, base, target, rand, opts)
    stages.push(list)
    base = list.entries
  }
  return stages
}
