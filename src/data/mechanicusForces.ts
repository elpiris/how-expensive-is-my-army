import type { Faction } from '../types'
import { mechanicus } from './mechanicus'

// ---------------------------------------------------------------------------
// ADEPTUS MECHANICUS FORCES — the two halves of the Mechanicus war machine as
// flavour sub-factions (2026-10-09): a Skitarii Hunter Cohort and the Cult
// Mechanicus. The forge worlds (Mars, Lucius, Ryza…) would be too subtle, so the
// split is by unit pool. Same roster, points, prices and Combat Patrol (which
// mixes a Manipulus with Skitarii); favoured only, not exclusive.
// ---------------------------------------------------------------------------

const force = (
  f: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...mechanicus,
  flavour: 0.5,
  ...f,
  parent: mechanicus.id,
  subfactionLabel: undefined,
})

export const skitariiHuntersCohort = force({
  id: 'mechanicus-skitarii',
  name: 'Skitarii Hunter Cohort',
  // The forge-soldiers: Rangers, Vanguard, Sicarians, Pteraxii, walkers and Duneriders.
  identity: { skitarii: 3 },
  transportChance: 0.45,
  profile: { character: 1, infantry: 5, mounted: 2.5, vehicle: 3 },
  blurb:
    'The Skitarii legions hunt in cohorts — Rangers and Vanguard, Sicarian killers, Pteraxii and Ironstrider walkers, with Onagers and Duneriders in support.',
})

export const cultMechanicus = force({
  id: 'mechanicus-cult',
  name: 'Cult Mechanicus',
  // The priesthood: Tech-Priests, Electro-Priests, Kataphrons and Kastelans.
  identity: { cult: 3 },
  signature: ['belisarius-cawl'],
  profile: { character: 1.5, infantry: 5, mounted: 0.5, vehicle: 3 },
  blurb:
    'The Cult Mechanicus marches to war itself — Tech-Priests leading Electro-Priest congregations, Kataphron servitors and Kastelan Robots, under Belisarius Cawl.',
})

export const mechanicusForces = [skitariiHuntersCohort, cultMechanicus]
