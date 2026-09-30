import type { Unit } from '../types'

// ---------------------------------------------------------------------------
// Value metrics — the heart of the "affordable above all" philosophy.
//
// pointsPerEuro answers "how much army do I get per euro spent?" for a single
// unit at its default size. Higher = better value. The casual builder uses it
// to prefer good-value kits when filling a list.
// ---------------------------------------------------------------------------

/** Euro cost to field one unit at its default model count (fractional boxes). */
export function unitCostEUR(unit: Unit): number {
  const perModel = unit.kit.priceEUR / unit.kit.models
  return perModel * unit.models
}

/** Points obtained per euro spent on this unit at its default size. */
export function pointsPerEuro(unit: Unit): number {
  const cost = unitCostEUR(unit)
  return cost > 0 ? unit.points / cost : 0
}
