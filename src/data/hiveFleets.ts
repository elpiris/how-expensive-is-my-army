import type { Faction } from '../types'
import { tyranids } from './tyranids'

// ---------------------------------------------------------------------------
// TYRANID HIVE FLEETS — the seven classic fleets as flavour sub-factions of the
// Tyranids (2026-10-03), built like the Aeldari Craftworlds: same roster,
// points, prices and value boxes; each adds an `identity` (unit tag weights),
// optional `signature` units and its own composition profile. Sources: hive
// fleet lore / Codex: Tyranids (8th–10th) and BoLS / Wargamer summaries —
// Behemoth the hyper-aggressive "big chargy bugs", Kraken speed and
// outflanking, Leviathan the strongest synapse network, Gorgon toxins and
// adaptation, Jormungandr tunnellers, Hydra sheer numbers, Kronos bio-artillery.
// Generated halfway between value and flavour (`flavour: 0.5`), like the
// Craftworlds. Signatures are kept to lore-certain picks (Old One Eye and the
// Swarmlord with Behemoth, first seen at Calth / Macragge).
// ---------------------------------------------------------------------------

const hiveFleet = (
  h: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour'>,
): Faction => ({
  ...tyranids,
  flavour: 0.5,
  ...h,
  parent: tyranids.id,
  subfactionLabel: undefined,
})

export const behemoth = hiveFleet({
  id: 'tyranids-behemoth',
  name: 'Behemoth',
  // Hyper-aggressive: Carnifexes and big melee beasts behind a wall of gaunts.
  identity: { melee: 3, swarm: 1 },
  signature: ['old-one-eye', 'swarmlord'],
  profile: { character: 1, infantry: 3.5, mounted: 0.5, monster: 5 },
  blurb:
    'The first fleet to strike Ultramar. Behemoth hurls itself at the foe in one overwhelming tide of claws — Carnifex broods and hulking bio-monsters charging behind the gaunts.',
})

export const kraken = hiveFleet({
  id: 'tyranids-kraken',
  name: 'Kraken',
  // Speed and outflanking: Genestealers, Hormagaunts, Raveners, Gargoyles.
  identity: { fast: 3, ambush: 2, melee: 1 },
  profile: { character: 1, infantry: 5.5, mounted: 0.5, monster: 2.5 },
  blurb:
    'Kraken splits into countless tendrils that move faster than thought — Genestealers, Hormagaunts and Raveners racing round the flanks to strike behind enemy lines.',
})

export const leviathan = hiveFleet({
  id: 'tyranids-leviathan',
  name: 'Leviathan',
  // The strongest synapse web: Tyrants, Neurotyrants, Warriors, Zoanthropes, Norns.
  identity: { synapse: 3, psyker: 1, swarm: 1 },
  profile: { character: 1.5, infantry: 4, mounted: 0.5, monster: 4 },
  blurb:
    'The largest fleet ever to assault the galaxy. Leviathan’s overwhelming synaptic web binds every brood to the Hive Mind — Tyrants, Warriors, Zoanthropes and the Norn creatures at its heart.',
})

export const gorgon = hiveFleet({
  id: 'tyranids-gorgon',
  name: 'Gorgon',
  // Toxins and adaptation: Venomthropes, Toxicrenes, spore clouds.
  identity: { toxin: 3, melee: 1 },
  profile: { character: 1, infantry: 4.5, mounted: 0.5, monster: 4 },
  // Its toxin bioforms are poor points-per-euro, so it leans further to flavour.
  flavour: 0.75,
  blurb:
    'Gorgon adapts with terrifying speed, and its toxins melt through anything — Venomthrope clouds, Toxicrenes and spore-fields screen bioforms bred for the war at hand.',
})

export const jormungandr = hiveFleet({
  id: 'tyranids-jormungandr',
  name: 'Jormungandr',
  // Tunnellers and ambushers: Trygons, Mawlocs, Raveners, Lictors.
  identity: { tunneller: 3, ambush: 2 },
  profile: { character: 1, infantry: 4.5, mounted: 0.5, monster: 4 },
  blurb:
    'Jormungandr strikes from below. Its swarms tunnel beneath the battlefield — Trygons, Mawlocs and Raveners erupting amid the foe while Lictors stalk the survivors.',
})

export const hydra = hiveFleet({
  id: 'tyranids-hydra',
  name: 'Hydra',
  // Sheer numbers: endless gaunt broods.
  identity: { swarm: 3 },
  profile: { character: 1, infantry: 6, mounted: 0.5, monster: 2.5 },
  blurb:
    'Hydra overwhelms by sheer numbers. Its endless broods of Termagants, Hormagaunts and Gargoyles keep coming, no matter how many fall.',
})

export const kronos = hiveFleet({
  id: 'tyranids-kronos',
  name: 'Kronos',
  // Bio-artillery gunline: Exocrines, Tyrannofexes, Hive Guard, Biovores.
  identity: { artillery: 3, synapse: 1 },
  profile: { character: 1, infantry: 3.5, mounted: 0.5, monster: 5 },
  blurb:
    'Kronos devours from range. A living gunline of Exocrines, Tyrannofexes, Hive Guard and Biovores bombards the foe before the swarm ever closes.',
})

export const hiveFleets = [behemoth, kraken, leviathan, gorgon, jormungandr, hydra, kronos]
