import type { Faction } from '../types'
import { astraMilitarum } from './astraMilitarum'

// ---------------------------------------------------------------------------
// ASTRA MILITARUM REGIMENTS — five famous regiments as flavour sub-factions of
// the Astra Militarum (2026-10-04), built like the CSM Legions: same points,
// prices and value boxes; each adds an `identity` (unit tag weights),
// `signature` characters and its own composition profile.
//
// Regiment-only units: each regiment's own command squad, troops and heavy
// weapons (and its famous characters) are removed from the OTHER regiments;
// plain "Astra Militarum" keeps everything. The Armageddon Steel Legion has no
// kits of its own and fields the Cadian infantry as stand-ins (`BORROWS`).
// Shared by everyone (abhuman / attached auxiliaries — Lexicanum, Wahapedia,
// Warhammer Community): Ratlings, Ogryns, Bullgryns, Nork Deddog, Attilan Rough
// Riders, Commissars, Lord Solar Leontus, Gaunt's Ghosts. Commissar Graves is a
// mechanised specialist (Steel Legion signature, not exclusive). The Cadian
// Combat Patrol only partly applies outside Cadia — accepted by the user (AM is
// an expensive army to collect).
// ---------------------------------------------------------------------------

const CADIAN_INFANTRY = [
  'cadian-castellan',
  'cadian-command',
  'cadian-shock-troops',
  'kasrkin',
  'cadian-heavy-weapons',
  'cadian-recon',
]

const REGIMENT_ONLY: Record<string, string[]> = {
  'am-cadian': ['ursula-creed', ...CADIAN_INFANTRY],
  'am-catachan': ['sly-marbo', 'catachan-command', 'catachan-jungle-fighters', 'catachan-heavy-weapons'],
  'am-krieg': ['lord-marshal-dreir', 'krieg-command', 'death-korps', 'krieg-engineers', 'krieg-heavy-weapons', 'death-riders'],
  'am-tempestus': ['tempestus-command', 'tempestus-scions', 'tempestus-aquilons'],
  'am-steel-legion': ['yarrick'],
}

/**
 * Pick-weight overrides per regiment. Super-heavies are 1/8 each everywhere (the
 * 8 variants share one chance); the Steel Legion tank regiment fields one often.
 */
const SUPER_HEAVIES = ['baneblade', 'banehammer', 'banesword', 'doomhammer', 'hellhammer', 'shadowsword', 'stormlord', 'stormsword']
const PICK_WEIGHT: Record<string, Record<string, number>> = {
  'am-steel-legion': Object.fromEntries(SUPER_HEAVIES.map((id) => [id, 1 / 3])),
}

/** Other regiments' units a regiment may still field. */
const BORROWS: Record<string, string[]> = {
  'am-steel-legion': CADIAN_INFANTRY,
}

const regiment = (
  r: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => {
  const othersOnly = new Set(
    Object.entries(REGIMENT_ONLY)
      .filter(([id]) => id !== r.id)
      .flatMap(([, ids]) => ids)
      .filter((id) => !BORROWS[r.id]?.includes(id)),
  )
  return {
    ...astraMilitarum,
    flavour: 0.5,
    ...r,
    parent: astraMilitarum.id,
    subfactionLabel: undefined,
    // Drop the other regiments' units, and any lead / transport links to them.
    units: astraMilitarum.units
      .filter((u) => !othersOnly.has(u.id))
      .map((u) => ({
        ...u,
        ...(REGIMENT_ONLY[r.id]?.includes(u.id) ? { exclusive: true } : {}),
        ...(PICK_WEIGHT[r.id]?.[u.id] !== undefined ? { pickWeight: PICK_WEIGHT[r.id][u.id] } : {}),
        ...(u.leads ? { leads: u.leads.filter((id) => !othersOnly.has(id)) } : {}),
        ...(u.transports ? { transports: u.transports.filter((id) => !othersOnly.has(id)) } : {}),
      })),
  }
}

export const cadian = regiment({
  id: 'am-cadian',
  name: 'Cadian Shock Troops',
  // The archetypal Guard: disciplined infantry, Kasrkin and Leman Russ support.
  identity: { veteran: 1, tank: 2, heavy: 1 },
  signature: ['ursula-creed'],
  profile: { character: 1.5, infantry: 5, mounted: 1, vehicle: 4 },
  blurb:
    'The Cadian Shock Troops, born soldiers of a fallen fortress world — disciplined infantry lines and Kasrkin backed by Leman Russ armour, under Lord Castellan Creed.',
})

export const catachan = regiment({
  id: 'am-catachan',
  name: 'Catachan Jungle Fighters',
  // Close-quarters killers: flamers, knives, Ogryns, scouts and Sly Marbo.
  identity: { melee: 2, flamer: 2, stealth: 1 },
  transportChance: 0.25, // on foot through the jungle
  signature: ['sly-marbo'],
  profile: { character: 1.5, infantry: 6, mounted: 0.5, vehicle: 2.5 },
  blurb:
    'Raised on a death world, Catachans fight up close — flamers, combat knives and ambushes in the undergrowth, with Ogryns and Sly Marbo in the thick of it.',
})

export const krieg = regiment({
  id: 'am-krieg',
  name: 'Death Korps of Krieg',
  // Attrition and siege: Death Korps lines under massed artillery.
  identity: { artillery: 3, heavy: 1 },
  transportChance: 0.25, // trench lines, on foot
  signature: ['lord-marshal-dreir'],
  profile: { character: 1.5, infantry: 4.5, mounted: 1, vehicle: 4 },
  blurb:
    'The Death Korps of Krieg seek atonement in attrition — gas-masked lines, Combat Engineers and Death Riders advancing under endless artillery barrages.',
})

export const tempestus = regiment({
  id: 'am-tempestus',
  name: 'Militarum Tempestus',
  // Elite drop troops: Scions, Aquilons, Valkyries and Taurox Primes.
  identity: { airborne: 3, veteran: 1 },
  // No mounted share: the profile would otherwise force in Rough Riders, the
  // only mounted unit a Tempestus list can field.
  profile: { character: 1.5, infantry: 6, vehicle: 2.5 },
  blurb:
    'The Militarum Tempestus — Schola Progenium storm troopers who drop from Valkyries onto the enemy’s most vital targets.',
})

export const steelLegion = regiment({
  id: 'am-steel-legion',
  name: 'Armageddon Steel Legion',
  // Mechanised war: Chimera-borne infantry, tank companies and super-heavies.
  identity: { mechanised: 3, tank: 2, superheavy: 3 },
  transportChance: 0.9, // Chimera-borne infantry
  signature: ['yarrick', 'commissar-graves'],
  profile: { character: 1.5, infantry: 4, mounted: 0.5, vehicle: 5 },
  blurb:
    'The Steel Legion of Armageddon go to war mechanised — Chimera-borne infantry, Leman Russ companies and Baneblades, with Commissar Yarrick at their head.',
})

export const regiments = [cadian, catachan, krieg, tempestus, steelLegion]
