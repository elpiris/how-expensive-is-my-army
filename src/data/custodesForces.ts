import type { Faction } from '../types'
import { custodes } from './custodes'

// ---------------------------------------------------------------------------
// ADEPTUS CUSTODES FORCES — three ways the Talons of the Emperor go to war, as
// flavour sub-factions (2026-10-09), after the Custodes detachments: the Shield
// Host (Custodian infantry), the Talons of the Emperor (Custodians beside the
// Sisters of Silence) and a Solar Spearhead (jetbikes, grav-tanks and
// Dreadnoughts). Same roster, points and prices (Custodes have no Combat
// Patrol); favoured only, not exclusive.
// ---------------------------------------------------------------------------

const force = (
  f: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...custodes,
  flavour: 0.5,
  ...f,
  parent: custodes.id,
  subfactionLabel: undefined,
})

export const shieldHost = force({
  id: 'custodes-shield-host',
  name: 'Shield Host',
  // Custodian Guard, Wardens, Sagittarum and Allarus under Shield-Captains.
  identity: { custodian: 3 },
  signature: ['trajann-valoris'],
  profile: { character: 1.5, infantry: 6, mounted: 1, vehicle: 1.5 },
  blurb:
    'A Shield Host of the Ten Thousand — Custodian Guard, Wardens and Allarus Terminators led by Shield-Captains and the Captain-General.',
})

export const talons = force({
  id: 'custodes-talons',
  name: 'Talons of the Emperor',
  // Custodians fighting beside the Sisters of Silence.
  identity: { sisters: 3, custodian: 1 },
  signature: ['valerian', 'aleya'],
  // The Sisters are poor points-per-euro (1.1), so lean further to flavour.
  flavour: 0.75,
  transportChance: 0.4,
  profile: { character: 1.5, infantry: 6, mounted: 1, vehicle: 1.5 },
  blurb:
    'The Talons of the Emperor — Custodians and the Sisters of Silence side by side, Prosecutors, Vigilators and Witchseekers hunting the psyker and the witch.',
})

export const solarSpearhead = force({
  id: 'custodes-solar-spearhead',
  name: 'Solar Spearhead',
  // Fast and armoured: Vertus Praetors, Dawneagles, grav-tanks and Dreadnoughts.
  identity: { jetbike: 3, gravtank: 2, dreadnought: 1 },
  signature: ['shield-captain-dawneagle'],
  profile: { character: 1.5, infantry: 2.5, mounted: 4, vehicle: 3.5 },
  blurb:
    'A Solar Spearhead strikes fast — Vertus Praetors and Dawneagle Shield-Captains on jetbikes, Caladius and Pallas grav-tanks and venerable Dreadnoughts.',
})

export const custodesForces = [shieldHost, talons, solarSpearhead]
