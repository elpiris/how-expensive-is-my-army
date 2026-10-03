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
  /** Points for a single unit at the default `models` size (the 1st copy). */
  points: number
  /**
   * Escalated points for a later copy of this datasheet at the default size
   * (11th-ed escalating cost). The copy at which it kicks in is `escalateAt`.
   * Omitted when the datasheet doesn't escalate.
   */
  pointsEscalated?: number
  /**
   * 1-based copy index at which `pointsEscalated` starts applying. Most
   * escalating datasheets step up on the 3rd copy ("1st–2nd / 3rd+", the
   * default); some on the 2nd ("1st / 2nd+", `escalateAt: 2`) and a few on the
   * 4th ("1st–3rd / 4th+", `escalateAt: 4`). Ignored without `pointsEscalated`.
   */
  escalateAt?: number
  /**
   * Highest-cost wargear upgrade the unit can take (MFM). Added to the unit's
   * points and shown on its list row. Omitted when wargear is free.
   */
  wargear?: { name: string; points: number }
  /** Default number of models in one unit (for points + purchasing math). */
  models: number
  epicHero?: boolean
  keywords?: string[]
  /** 1 (filler) .. 5 (iconic centrepiece) — biases casual list generation. */
  flavor?: number
  /**
   * Thematic tags (weapons / armour / role) matched against a faction's
   * `identity` when the list style leans towards flavour — e.g. Infernus Squad
   * = flamer, Outriders = bike. Currently used for Space Marines.
   */
  tags?: UnitTag[]
  /**
   * Only this faction (Chapter) can field it — e.g. Death Company for Blood
   * Angels. Exclusive units get a strong flavour bonus.
   */
  exclusive?: boolean
  /**
   * Unit ids this character can be attached to as a Leader (from Wahapedia).
   * Used to give leadable units a character to lead them.
   */
  leads?: string[]
  /**
   * Unit ids a Dedicated Transport can carry (from Wahapedia). A transport is
   * only ever added to carry a unit already in the list, and — as a
   * simplification of the real rules — each transport carries a single unit.
   */
  transports?: string[]
  /**
   * Mutually-exclusive flavour group: at most ONE model total may be taken across
   * all units sharing this tag (e.g. the three Hive Tyrant variants).
   */
  exclusiveGroup?: string
  /**
   * Only obtainable as part of another unit's box (e.g. Ripper Swarms, Spore
   * Mines). Defaults to "kit has `alsoBuilds` and a name other than the unit's";
   * set it explicitly when that guess is wrong (Biovore in the "Biovore and
   * Pyrovore" kit is sold as itself → `false`).
   */
  boxOnly?: boolean
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

/**
 * Top-level grouping for the faction dropdown. Space Marines get their own
 * group (separate from the rest of the Imperium) because of their Chapters.
 */
export type FactionCategory = 'imperium' | 'space-marines' | 'chaos' | 'xenos'

/**
 * Coarse composition bucket a unit falls into, for shaping list generation.
 * (Monsters/vehicles win over the CHARACTER keyword, so a Hive Tyrant counts as
 * a monster, not a character.)
 */
export type UnitCategory = 'character' | 'infantry' | 'mounted' | 'vehicle' | 'monster'

/**
 * An army's thematic "shape": relative target share of a list's points per
 * category. Values are weights (need not sum to anything — they're normalised),
 * and an omitted/0 category is deliberately sparse. The generator softly biases
 * the fill toward these shares, so e.g. character-light armies stop piling up
 * cheap HQs. Omit entirely to leave a faction unshaped.
 */
export type FactionProfile = Partial<Record<UnitCategory, number>>

/** Thematic unit tags used to express a faction's (Chapter's) identity. */
export type UnitTag =
  | 'flamer'
  | 'melta'
  | 'plasma'
  | 'bolter'
  | 'melee'
  | 'terminator'
  | 'gravis'
  | 'phobos'
  | 'jump'
  | 'bike'
  | 'speeder'
  | 'dreadnought'
  | 'tank'
  | 'psyker'
  | 'chaplain'
  | 'techmarine'
  | 'veteran'
  // Aeldari
  | 'aspect'
  | 'phoenix'
  | 'guardian'
  | 'seer'
  | 'wraith'
  | 'jetbike'
  | 'gravtank'
  | 'walker'
  | 'aircraft'
  | 'stealth'
  | 'harlequin'

/**
 * What a faction is known for: tag → weight (1 = a nod, 3 = defining). With the
 * list style towards Flavour, units carrying these tags are favoured.
 */
export type FactionIdentity = Partial<Record<UnitTag, number>>

export interface Faction {
  id: string
  name: string
  system: 'w40k'
  /** Grand alliance — groups the faction dropdown (Imperium / Chaos / Xenos). */
  category: FactionCategory
  /**
   * Space Marine Chapters only: Codex-compliant (base roster + characters) or not
   * (own units / exclusions). Drives the Chapter sub-selector's groups. The
   * Chapter-agnostic `space-marines` base faction leaves it unset.
   */
  chapter?: 'codex' | 'non-codex'
  /** ISO date the points/prices in this file were last checked. */
  lastVerified: string
  /** true once points have been sourced from Wahapedia (11th ed), not estimated. */
  pointsVerified?: boolean
  /**
   * Skip the per-bracket unit size cap (120/200/350 pts). For superheavy-only
   * armies (e.g. Chaos Knights) whose every datasheet is a huge model — the cap
   * would otherwise leave nothing to field at 500/1000/1500.
   */
  ignoreSizeCap?: boolean
  /** Thematic composition shape — biases list generation (see FactionProfile). */
  profile?: FactionProfile
  /** Thematic unit preferences — see FactionIdentity / Unit.tags. */
  identity?: FactionIdentity
  /**
   * Units this sub-faction is famous for though anyone may field them (e.g.
   * Eldrad for Ulthwé) — they get the same flavour bonus as `exclusive` units.
   */
  signature?: string[]
  /**
   * Base faction this is a sub-faction of (a Space Marine Chapter → the base
   * `space-marines`, a Craftworld → `aeldari`). Sub-factions are chosen in a
   * second dropdown instead of the main faction list.
   */
  parent?: string
  /** On a base faction with sub-factions: what they're called ("Chapter"…). */
  subfactionLabel?: string
  /**
   * Value ↔ flavour balance for generation (0 = points per euro only … 1 = theme
   * only). Defaults to 1 with an `identity`, 0 without; set it where full flavour
   * gets too pricey (Aeldari Craftworlds use 0.5).
   */
  flavour?: number
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
  /**
   * Paid-for but unfielded models per datasheet — value-box contents the list
   * doesn't use, leftover models in a kit, and unused bonus models (`alsoBuilds`).
   * The generator fields these first (whole units only) so nothing bought is wasted.
   */
  spare: { unitId: string; models: number }[]
}
