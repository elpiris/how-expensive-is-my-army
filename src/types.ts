// ---------------------------------------------------------------------------
// Core domain types for "How Expensive Is My Army?"
// ---------------------------------------------------------------------------

export type Mode = 'casual' | 'competitive'

export type PointsBracket = 500 | 1000 | 1500 | 2000

export type DiscountPercent = 0 | 10 | 15 | 20

export type UnitRole =
  | 'epic-hero' // named characters, unique, max 1 per army
  | 'character' // generic HQ / leaders
  | 'battleline' // troops (can be taken in larger numbers)
  | 'infantry'
  | 'mounted'
  | 'vehicle'
  | 'monster'
  | 'transport'

/**
 * A purchasable box (kit) from warhammer.com. Every `Unit` points at the
 * standard kit that builds it; `ValueBox`es (Combat Patrols / Battleforces)
 * are separate because they build several different units at once.
 */
export interface Kit {
  name: string
  priceEUR: number
  /** How many models of the parent unit a single box builds. */
  models: number
  /** true once the price has been checked against warhammer.com. */
  verified?: boolean
  /** Webstore-exclusive kits cannot be discounted by third-party retailers. */
  onlineOnly?: boolean
  /**
   * Bonus units the same physical box also builds (e.g. a Termagants box also
   * yields a Ripper Swarm base). Their models are credited when costing.
   */
  alsoBuilds?: { unitId: string; models: number }[]
  url?: string
}

export interface Unit {
  id: string
  name: string
  role: UnitRole
  /** Points for a single unit at the default `models` size. */
  points: number
  /** Default number of models in one unit (for points + purchasing math). */
  models: number
  epicHero?: boolean
  keywords?: string[]
  /** 1 (filler) .. 5 (iconic centrepiece) — biases casual list generation. */
  flavor?: number
  /**
   * Unit ids this character can be attached to as a Leader (from Wahapedia).
   * Used to give leadable units a character to lead them.
   */
  leads?: string[]
  /** Standard box you buy to field this datasheet. */
  kit: Kit
}

export interface ValueBoxContent {
  unitId: string
  /** How many models of that unit this box can build. */
  models: number
}

/** A Combat Patrol / Battleforce style bundle that builds several units. */
export interface ValueBox {
  id: string
  name: string
  priceEUR: number
  verified?: boolean
  onlineOnly?: boolean
  url?: string
  builds: ValueBoxContent[]
}

export interface CompetitiveEntry {
  unitId: string
  count: number
}

export interface Faction {
  id: string
  name: string
  system: 'w40k'
  /** ISO date the points/prices in this file were last checked. */
  lastVerified: string
  /** true once points have been sourced from Wahapedia (11th ed), not estimated. */
  pointsVerified?: boolean
  blurb?: string
  units: Unit[]
  valueBoxes: ValueBox[]
  /** Curated netlist, keyed by points bracket. */
  competitiveLists: Partial<Record<PointsBracket, CompetitiveEntry[]>>
}

// --- Generated output ------------------------------------------------------

/** One datasheet selection in a generated army list. */
export interface ListEntry {
  unit: Unit
  count: number
}

export interface GeneratedList {
  faction: Faction
  mode: Mode
  targetPoints: PointsBracket
  entries: ListEntry[]
  totalPoints: number
  notes: string[]
}

// --- Costing output --------------------------------------------------------

export interface PurchaseLine {
  name: string
  quantity: number
  unitPriceEUR: number
  lineTotalEUR: number
  isValueBox: boolean
  onlineOnly: boolean
  verified: boolean
  /** Human-readable list of what this purchase covers. */
  covers: string[]
  url?: string
}

export interface CostBreakdown {
  lines: PurchaseLine[]
  /** Full recommended-retail total, no discount. */
  rrpTotalEUR: number
  /** Portion of the RRP that is eligible for a retailer discount. */
  discountableEUR: number
  /** Portion that must be bought at full price (webstore-exclusive). */
  nonDiscountableEUR: number
  /** Notes about surplus models, unmatched units, etc. */
  notes: string[]
}
