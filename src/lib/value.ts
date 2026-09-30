import type { Unit } from '../types'

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

/** Points obtained per euro spent on this unit at its default size. */
export function pointsPerEuro(unit: Unit): number {
  const cost = unitCostEUR(unit)
  return cost > 0 ? unit.points / cost : 0
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
