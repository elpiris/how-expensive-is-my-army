import type { Faction } from '../types'
import { drukhari } from './drukhari'

// ---------------------------------------------------------------------------
// DRUKHARI FORCES — the three pillars of Commorragh as flavour sub-factions of
// the Drukhari (2026-10-08): a Kabal, a Wych Cult and a Haemonculus Coven. Same
// roster, points, prices and value boxes; each adds an `identity` (unit tag
// weights), signature characters and its own composition profile.
// Favoured only, not exclusive (user: it's a small roster) — every force can
// still field the others' units, as real raids mix them, and all keep the
// (Coven) Combat Patrol. Shared by everyone: Incubi + Drazhar (mercenaries),
// Mandrakes, Scourges, Raiders and Venoms.
// ---------------------------------------------------------------------------

const force = (
  f: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...drukhari,
  flavour: 0.5,
  ...f,
  parent: drukhari.id,
  subfactionLabel: undefined,
})

export const kabal = force({
  id: 'drukhari-kabal',
  name: 'Kabal',
  // Kabalite firepower in Venoms and Raiders, Ravagers and the jetfighters.
  identity: { kabal: 3, aircraft: 1 },
  signature: ['lady-malys'],
  profile: { character: 2, infantry: 4.5, mounted: 0.5, vehicle: 4, monster: 0.5 },
  blurb:
    'The Kabals rule Commorragh — Archons lead Kabalite Warriors in Venoms and Raiders, backed by Ravagers and screaming jetfighters.',
})

export const wychCult = force({
  id: 'drukhari-wych-cult',
  name: 'Wych Cult',
  // Arena gladiators: Wyches, Hellions and Reavers, mostly in Raiders.
  identity: { wych: 3 },
  signature: ['lelith'],
  profile: { character: 2, infantry: 4, mounted: 3, vehicle: 2, monster: 0.5 },
  blurb:
    'The Wych Cults bring the arena to the battlefield — Wyches leap from Raiders while Hellions and Reavers tear through the lines.',
})

export const coven = force({
  id: 'drukhari-coven',
  name: 'Haemonculus Coven',
  // Flesh-crafters: Wracks with Talos and Cronos engines.
  identity: { coven: 3 },
  transportChance: 0.4,
  profile: { character: 2, infantry: 4, mounted: 0.5, vehicle: 1.5, monster: 4 },
  blurb:
    'The Haemonculus Covens wage war with their own creations — hordes of Wracks and the grotesque Talos and Cronos engines.',
})

export const drukhariForces = [kabal, wychCult, coven]
