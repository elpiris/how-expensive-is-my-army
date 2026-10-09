import type { Faction } from '../types'
import { necrons } from './necrons'

// ---------------------------------------------------------------------------
// NECRON FORCES — three army styles as flavour sub-factions of the Necrons
// (2026-10-08). The dynasties (Szarekhan, Sautekh…) are mostly colour schemes,
// so the split is by unit pool instead: the Destroyer Cult, the Canoptek Court
// and an Awakened Dynasty's legions. Same roster, points, prices and value
// boxes; each adds an `identity` (unit tag weights), signatures and a profile.
// Favoured only, not exclusive. The C'tan carry no tag and stay common (a C'tan
// in ~40–70% of focused lists is fine — user, 2026-10-08; no cap).
// ---------------------------------------------------------------------------

const force = (
  f: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...necrons,
  flavour: 0.5,
  ...f,
  parent: necrons.id,
  subfactionLabel: undefined,
})

export const destroyerCult = force({
  id: 'necrons-destroyer-cult',
  name: 'Destroyer Cult',
  // Nihilistic killers: Skorpekh, Ophydian and Lokhust Destroyers and their Lords.
  identity: { destroyer: 3 },
  profile: { character: 1.5, infantry: 5.5, mounted: 1, vehicle: 1.5, monster: 0.5 },
  blurb:
    'Necrons consumed by the urge to exterminate all life — Skorpekh, Ophydian and Lokhust Destroyers led by their Lords and Hexmarks.',
})

export const canoptekCourt = force({
  id: 'necrons-canoptek-court',
  name: 'Canoptek Court',
  // The tomb-world's constructs: Wraiths, Spyders, Scarabs, Doomstalkers, Crawlers.
  identity: { canoptek: 3 },
  signature: ['szeras'],
  transportChance: 0.1,
  profile: { character: 1.5, infantry: 3.5, mounted: 2.5, vehicle: 2.5, monster: 1.5 },
  blurb:
    'The tomb-world’s guardians rise — Canoptek Wraiths, Spyders, Scarab swarms and Doomstalkers, directed by Crypteks and Illuminor Szeras.',
})

export const awakenedDynasty = force({
  id: 'necrons-awakened-dynasty',
  name: 'Awakened Dynasty',
  // Phalanxes of Warriors and Immortals under Overlords, Lychguard and Triarchs.
  identity: { legion: 3 },
  signature: ['imotekh', 'silent-king'],
  transportChance: 0.4,
  profile: { character: 2, infantry: 5.5, mounted: 0.5, vehicle: 2, monster: 0.5 },
  blurb:
    'A dynasty marches to war — endless phalanxes of Warriors and Immortals under Overlords and their Lychguard, with the Triarch at their side.',
})

export const necronForces = [destroyerCult, canoptekCourt, awakenedDynasty]
