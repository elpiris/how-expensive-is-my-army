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
 * guard it leads, or -1. Leaders earlier in the array get first pick.
 */
export function matchLeaders(leaders: Unit[], guards: Unit[]): number[] {
  const owner: number[] = guards.map(() => -1)
  const tryLeader = (li: number, seen: boolean[]): boolean => {
    for (let g = 0; g < guards.length; g++) {
      if (seen[g] || !leaders[li].leads?.includes(guards[g].id)) continue
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
