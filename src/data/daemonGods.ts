import type { Faction } from '../types'
import { chaosDaemons } from './chaosDaemons'

// ---------------------------------------------------------------------------
// CHAOS DAEMON GODS — the four Chaos Gods' legions as sub-factions of the Chaos
// Daemons (2026-10-09, low priority per the user but completes the set). The
// daemon legions are mono-god, so the split is exclusive: each legion fields
// its own god's daemons plus the undivided ones (Be'lakor, the Daemon Princes of
// Chaos, the Soul Grinder). Same points and prices; the Daemons have no Combat
// Patrol. Value-first within each god's roster (no `identity` needed); the
// undivided units get UNDIVIDED_WEIGHT so they're occasional allies, not a
// fixture (Be'lakor was in 60–71% of god lists, the Soul Grinder up to 99%).
// ---------------------------------------------------------------------------

const GOD_UNITS: Record<string, string[]> = {
  'daemons-khorne': [
    'skarbrand', 'bloodthirster', 'skulltaker', 'karanak', 'bloodmaster', 'skullmaster', 'rendmaster',
    'skull-cannon', 'skull-altar', 'bloodletters', 'bloodcrushers', 'flesh-hounds',
  ],
  'daemons-tzeentch': [
    'kairos', 'lord-of-change', 'changeling', 'changecaster', 'exalted-flamer', 'fateskimmer', 'burning-chariot',
    'pink-horrors', 'blue-horrors', 'flamers', 'screamers',
  ],
  'daemons-nurgle': [
    'rotigus', 'great-unclean-one', 'horticulous', 'poxbringer', 'sloppity-bilepiper', 'spoilpox-scrivener',
    'plaguebearers', 'nurglings', 'beasts-of-nurgle', 'plague-drones', 'feculent-gnarlmaw',
  ],
  'daemons-slaanesh': [
    'shalaxi-helbane', 'keeper-of-secrets', 'sylleske', 'masque', 'contorted-epitome', 'infernal-enrapturess',
    'daemonettes', 'fiends', 'seekers',
  ],
}

const UNDIVIDED_WEIGHT = 0.3

const god = (g: Pick<Faction, 'id' | 'name' | 'signature' | 'profile' | 'blurb'>): Faction => {
  const others = new Set(
    Object.entries(GOD_UNITS)
      .filter(([id]) => id !== g.id)
      .flatMap(([, ids]) => ids),
  )
  const own = new Set(GOD_UNITS[g.id])
  return {
    ...chaosDaemons,
    ...g,
    parent: chaosDaemons.id,
    subfactionLabel: undefined,
    // The god's own daemons + the undivided ones; links to other gods dropped.
    units: chaosDaemons.units
      .filter((u) => !others.has(u.id))
      .map((u) => ({
        ...u,
        ...(own.has(u.id) ? {} : { pickWeight: (u.pickWeight ?? 1) * UNDIVIDED_WEIGHT }),
        ...(u.leads ? { leads: u.leads.filter((id) => !others.has(id)) } : {}),
        ...(u.kit.alsoBuilds
          ? { kit: { ...u.kit, alsoBuilds: u.kit.alsoBuilds.filter((a) => !others.has(a.unitId)) } }
          : {}),
      })),
  }
}

export const khorne = god({
  id: 'daemons-khorne',
  name: 'Khorne',
  profile: { character: 2.5, infantry: 4, mounted: 2.5, vehicle: 1.5, monster: 2.5 },
  blurb:
    'The Blood God’s legions — Bloodletters, Flesh Hounds and Bloodcrushers charging behind Bloodthirsters, Skull Cannons rumbling in their wake.',
})

export const tzeentch = god({
  id: 'daemons-tzeentch',
  name: 'Tzeentch',
  profile: { character: 2.5, infantry: 4.5, mounted: 1.5, vehicle: 1, monster: 2.5 },
  blurb:
    'The Changer of Ways sends Pink and Blue Horrors, Flamers and Screamers, led by Lords of Change and the scheming Kairos Fateweaver.',
})

export const nurgle = god({
  id: 'daemons-nurgle',
  name: 'Nurgle',
  // Small vehicle share: the Gnarlmaw is its only own vehicle (else Soul Grinders).
  profile: { character: 2.5, infantry: 4.5, mounted: 2, vehicle: 0.5, monster: 2.5 },
  blurb:
    'Grandfather Nurgle’s tallybands — Plaguebearers and Nurglings, Beasts of Nurgle and Plague Drones, around a Great Unclean One.',
})

export const slaanesh = god({
  id: 'daemons-slaanesh',
  name: 'Slaanesh',
  // No vehicle share: Slaanesh has none of its own (it forced in Soul Grinders).
  profile: { character: 2.5, infantry: 4, mounted: 3, monster: 2.5 },
  blurb:
    'The Dark Prince’s hosts — Daemonettes, Seekers and Fiends, swift and deadly, led by Keepers of Secrets and the Masque.',
})

export const daemonGods = [khorne, tzeentch, nurgle, slaanesh]
