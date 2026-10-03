import type { Unit, UnitCategory } from '../types'

// ---------------------------------------------------------------------------
// Value metrics — the heart of the "affordable above all" philosophy.
//
// pointsPerEuro answers "how much army do I get per euro spent?" for a single
// unit at its default size. Higher = better value. The casual builder uses it
// to prefer good-value kits when filling a list.
// ---------------------------------------------------------------------------

/**
 * Euro cost to actually field one unit at its default size — you buy WHOLE
 * boxes, so a unit that only uses part of a box (e.g. one Screamer-Killer from a
 * €87 box that builds two) costs the full box and is correctly poor value.
 */
export function unitCostEUR(unit: Unit): number {
  const boxes = Math.ceil(unit.models / unit.kit.models)
  return boxes * unit.kit.priceEUR
}

/** Effective points for a base-rate copy: base + the chosen (highest) wargear. */
export function unitPoints(unit: Unit): number {
  return unit.points + (unit.wargear?.points ?? 0)
}

/** Effective points for an escalated copy (escalating cost) + wargear. */
export function unitPointsEscalated(unit: Unit): number {
  return (unit.pointsEscalated ?? unit.points) + (unit.wargear?.points ?? 0)
}

/**
 * 1-based copy index at which the escalated cost begins. Defaults to the 3rd
 * copy ("1st–2nd / 3rd+"); units declare `escalateAt: 2` or `4` for the other
 * MFM patterns.
 */
export function escalateAt(unit: Unit): number {
  return unit.escalateAt ?? 3
}

/** Points for the `n`-th copy (1-based), applying the escalation threshold. */
export function copyPoints(unit: Unit, n: number): number {
  return n >= escalateAt(unit) ? unitPointsEscalated(unit) : unitPoints(unit)
}

/** Extra points the `n`-th copy pays over the base rate (0 if not escalated). */
export function copySurcharge(unit: Unit, n: number): number {
  return copyPoints(unit, n) - unitPoints(unit)
}

/** Total points for `count` copies, applying the escalation threshold. */
export function entryPoints(unit: Unit, count: number): number {
  const nBase = Math.min(count, escalateAt(unit) - 1)
  const nEsc = Math.max(0, count - (escalateAt(unit) - 1))
  return unitPoints(unit) * nBase + unitPointsEscalated(unit) * nEsc
}

/**
 * A box-only unit: its kit is another unit's box (Neurotyrant → Horrors of the
 * Hive, Ripper Swarms → Termagants). `Unit.boxOnly` overrides the name guess.
 */
export function isBoxOnly(unit: Unit): boolean {
  return unit.boxOnly ?? (!!unit.kit.alsoBuilds?.length && unit.kit.name !== unit.name)
}

/** Points obtained per euro spent on this unit at its default size (incl. wargear). */
export function pointsPerEuro(unit: Unit): number {
  const cost = unitCostEUR(unit)
  return cost > 0 ? unitPoints(unit) / cost : 0
}

/**
 * Whether a datasheet belongs in the "Characters" section. Driven by the actual
 * CHARACTER keyword (from Wahapedia) rather than the coarse `role`, so units
 * that are both Monster and Character (e.g. Hive Tyrant) group correctly.
 */
export function isCharacter(unit: Unit): boolean {
  return (
    unit.role === 'epic-hero' ||
    unit.role === 'character' ||
    !!unit.keywords?.some((k) => k.toLowerCase() === 'character')
  )
}

/**
 * Coarse composition bucket for list shaping. A big monster/vehicle wins over the
 * CHARACTER keyword (so a Hive Tyrant or Mortarion counts as a monster, not a
 * cheap HQ), which keeps the profile's "character" share about actual HQs.
 */
export function unitCategory(unit: Unit): UnitCategory {
  const kw = unit.keywords?.map((k) => k.toLowerCase()) ?? []
  if (unit.role === 'monster' || kw.includes('monster')) return 'monster'
  if (unit.role === 'vehicle' || unit.role === 'transport' || kw.includes('vehicle')) return 'vehicle'
  if (unit.role === 'mounted') return 'mounted'
  if (isCharacter(unit)) return 'character'
  return 'infantry'
}
