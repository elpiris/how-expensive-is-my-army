import type { ListEntry, Unit } from '../types'
import { isCharacter } from './value'

// ---------------------------------------------------------------------------
// Leader attachments — which character leads which unit.
//
// A character with a `leads` list can be attached to one unit it may lead, and
// (as a simplification) each unit takes one leader. The best pairing is a
// maximum bipartite matching between leader copies and bodyguard copies. The
// generator uses it to only add a leader while a unit is free for it; the list
// view uses it to show each leader together with the unit it leads.
// ---------------------------------------------------------------------------

/** One model-unit copy of a datasheet in a list (`copy` is 1-based). */
export interface UnitCopy {
  unit: Unit
  copy: number
}

export interface Attachment {
  leader: UnitCopy
  unit: UnitCopy
}

/** A character that can be attached to other units as a Leader. */
export function isLeader(u: Unit): boolean {
  return isCharacter(u) && !!u.leads?.length
}

/**
 * Maximum matching of `leaders` to `guards`: for each leader, the index of the
 * guard it leads, or -1. Leaders earlier in the array get first pick, and each
 * leader tries units in the order of its `leads` list (its preference — e.g.
 * Huron Blackheart always takes his Masters of the Maelstrom when both are in).
 */
export function matchLeaders(leaders: Unit[], guards: Unit[]): number[] {
  const owner: number[] = guards.map(() => -1)
  const order = leaders.map((l) =>
    guards
      .map((g, i) => ({ i, rank: l.leads?.indexOf(g.id) ?? -1 }))
      .filter((x) => x.rank >= 0)
      .sort((a, b) => a.rank - b.rank)
      .map((x) => x.i),
  )
  const tryLeader = (li: number, seen: boolean[]): boolean => {
    for (const g of order[li]) {
      if (seen[g]) continue
      seen[g] = true
      if (owner[g] < 0 || tryLeader(owner[g], seen)) {
        owner[g] = li
        return true
      }
    }
    return false
  }
  leaders.forEach((_, li) => tryLeader(li, guards.map(() => false)))
  const led = leaders.map(() => -1)
  owner.forEach((li, g) => {
    if (li >= 0) led[li] = g
  })
  return led
}

/** Every copy in the list, in entry order. */
export function copiesOf(entries: ListEntry[]): UnitCopy[] {
  return entries.flatMap((e) => Array.from({ length: e.count }, (_, i) => ({ unit: e.unit, copy: i + 1 })))
}

/** A unit with whatever is attached to it: its leader and/or the transport carrying it. */
export interface UnitGroup {
  leader?: UnitCopy
  unit: UnitCopy
  transport?: UnitCopy
}

/**
 * Leaders paired with their units (`attachLeaders`), then each transport assigned
 * to a unit it can carry — the most valuable blocks (unit + leader) first, as the
 * generator mounts the priciest squads most often. Returns the groups with
 * anything attached, and the remaining loose copies.
 */
export function attachAll(entries: ListEntry[]): { groups: UnitGroup[]; rest: UnitCopy[] } {
  const { attached, rest } = attachLeaders(entries)
  const blockPts = (g: UnitGroup) => g.unit.unit.points + (g.leader?.unit.points ?? 0)
  const blocks: UnitGroup[] = [
    ...attached.map((a) => ({ leader: a.leader, unit: a.unit })),
    ...rest.filter((c) => !isCharacter(c.unit) && c.unit.role !== 'transport').map((c) => ({ unit: c })),
  ].sort((a, b) => blockPts(b) - blockPts(a))
  const transports = rest.filter((c) => c.unit.role === 'transport').sort((a, b) => b.unit.points - a.unit.points)
  const loose: UnitCopy[] = []
  for (const t of transports) {
    const g = blocks.find((b) => !b.transport && t.unit.transports?.includes(b.unit.unit.id))
    if (g) g.transport = t
    else loose.push(t)
  }
  const groups = blocks.filter((b) => b.leader || b.transport)
  const grouped = new Set(groups.map((g) => g.unit))
  return {
    groups,
    rest: [...rest.filter((c) => c.unit.role !== 'transport' && !grouped.has(c)), ...loose],
  }
}

/**
 * Split a list into leader + led-unit pairs and the remaining unattached copies.
 * The priciest leaders pick first, so a big hero is shown with its unit when
 * two leaders compete for the same one.
 */
export function attachLeaders(entries: ListEntry[]): { attached: Attachment[]; rest: UnitCopy[] } {
  const all = copiesOf(entries)
  const leaders = all.filter((c) => isLeader(c.unit)).sort((a, b) => b.unit.points - a.unit.points)
  const guards = all.filter((c) => !isCharacter(c.unit))
  const led = matchLeaders(
    leaders.map((c) => c.unit),
    guards.map((c) => c.unit),
  )
  const attached: Attachment[] = []
  const used = new Set<UnitCopy>()
  leaders.forEach((leader, li) => {
    if (led[li] < 0) return
    attached.push({ leader, unit: guards[led[li]] })
    used.add(leader).add(guards[led[li]])
  })
  return { attached, rest: all.filter((c) => !used.has(c)) }
}
