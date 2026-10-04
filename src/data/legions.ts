import type { Faction } from '../types'
import { chaosSpaceMarines } from './chaosSpaceMarines'

// ---------------------------------------------------------------------------
// CHAOS SPACE MARINE LEGIONS — six Traitor Legions / renegade warbands as
// flavour sub-factions of the Chaos Space Marines (2026-10-04), built like the
// Craftworlds and Hive Fleets: same roster, points, prices and value boxes; each
// adds an `identity` (unit tag weights), `signature` units and its own
// composition profile. Picked with the user (a CSM player): Vashtorr, Kravek
// Morne and the Mutilators belong to the Iron Warriors. Halfway between value
// and flavour (`flavour: 0.5`).
//
// Legion-only units (user, 2026-10-04 — fits the lore): each is removed from
// the OTHER legions' rosters; plain "Chaos Space Marines" keeps everything.
// Fabius Bile stays available to every legion.
// ---------------------------------------------------------------------------

const LEGION_ONLY: Record<string, string[]> = {
  'csm-black-legion': ['abaddon', 'haarken-worldclaimer'],
  'csm-iron-warriors': ['vashtorr', 'kravek-morne', 'mutilators'],
  'csm-night-lords': ['nemesis-claw'],
  'csm-red-corsairs': ['huron-blackheart', 'red-corsairs-raiders', 'reave-captain', 'masters-of-the-maelstrom'],
}

const legion = (
  l: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour'>,
): Faction => {
  const othersOnly = new Set(
    Object.entries(LEGION_ONLY)
      .filter(([id]) => id !== l.id)
      .flatMap(([, ids]) => ids),
  )
  return {
    ...chaosSpaceMarines,
    flavour: 0.5,
    ...l,
    parent: chaosSpaceMarines.id,
    subfactionLabel: undefined,
    // Drop the other legions' units, and any lead / transport links to them.
    units: chaosSpaceMarines.units
      .filter((u) => !othersOnly.has(u.id))
      .map((u) => ({
        ...u,
        ...(LEGION_ONLY[l.id]?.includes(u.id) ? { exclusive: true } : {}),
        ...(u.leads ? { leads: u.leads.filter((id) => !othersOnly.has(id)) } : {}),
        ...(u.transports ? { transports: u.transports.filter((id) => !othersOnly.has(id)) } : {}),
      })),
  }
}

export const blackLegion = legion({
  id: 'csm-black-legion',
  name: 'Black Legion',
  // Abaddon's veteran elite: Chosen, Terminators, warlords.
  identity: { veteran: 3, terminator: 2, jump: 1 },
  signature: ['abaddon', 'haarken-worldclaimer'],
  profile: { character: 2, infantry: 5, mounted: 0.5, vehicle: 2.5, monster: 1 },
  blurb:
    'The Sons of Horus reborn under Abaddon the Despoiler. Veteran Chosen and Terminator retinues spearhead every Black Crusade.',
})

export const ironWarriors = legion({
  id: 'csm-iron-warriors',
  name: 'Iron Warriors',
  // Siege masters: tanks, daemon engines, heavy weapons and the Warpsmiths.
  identity: { tank: 3, daemonengine: 2, heavy: 2 },
  signature: ['vashtorr', 'kravek-morne', 'mutilators', 'warpsmith'],
  profile: { character: 1.5, infantry: 3, mounted: 0.5, vehicle: 5.5, monster: 0.5 },
  blurb:
    'Perturabo’s siege-masters. Tanks, daemon engines and heavy-weapon teams grind the foe down under Warpsmiths and the Arkifane.',
})

export const nightLords = legion({
  id: 'csm-night-lords',
  name: 'Night Lords',
  // Terror troops: Raptors, Warp Talons and the Nemesis Claw.
  identity: { jump: 3 },
  // Jump troops are only middling value, so lean further to flavour (user wants
  // far more Raptors / Warp Talons / jump-pack Lords, 2026-10-04).
  flavour: 0.75,
  signature: ['nemesis-claw'],
  profile: { character: 2, infantry: 5.5, mounted: 1, vehicle: 1.5, monster: 0.5 },
  blurb:
    'The VIII Legion strike from the dark. Raptor and Warp Talon packs fall screaming from the sky while the Nemesis Claw hunts the survivors.',
})

export const wordBearers = legion({
  id: 'csm-word-bearers',
  name: 'Word Bearers',
  // Faith and possession: Dark Apostles, Possessed, Daemon Princes, cults.
  identity: { daemon: 3, cultist: 1 },
  signature: ['dark-apostle', 'master-of-possession'],
  profile: { character: 2.5, infantry: 4.5, mounted: 0.5, vehicle: 1.5, monster: 2 },
  blurb:
    'The first heretics. Dark Apostles preach before hosts of Possessed, Daemon Princes and fanatical cults, welcoming the warp into the flesh.',
})

export const alphaLegion = legion({
  id: 'csm-alpha-legion',
  name: 'Alpha Legion',
  // Hidden armies: cultist cells, Traitor Guard and infiltrating Legionaries.
  identity: { cultist: 3 },
  profile: { character: 2, infantry: 6, mounted: 0.5, vehicle: 2 },
  blurb:
    'Hydra Dominatus. The Alpha Legion fights through proxies — cultist cells and Traitor Guard — before its Legionaries strike where least expected.',
})

export const redCorsairs = legion({
  id: 'csm-red-corsairs',
  name: 'Red Corsairs',
  // Huron Blackheart's renegade raiders.
  identity: { corsair: 3, veteran: 1 },
  profile: { character: 2, infantry: 5, mounted: 0.5, vehicle: 2.5, monster: 0.5 },
  blurb:
    'The renegades of the Maelstrom. Huron Blackheart’s Raiders and Reave-Captains strike from the warp-storm, taking what they want.',
})

export const legions = [blackLegion, ironWarriors, nightLords, wordBearers, alphaLegion, redCorsairs]
