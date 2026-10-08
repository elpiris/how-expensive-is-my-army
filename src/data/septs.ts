import type { Faction } from '../types'
import { tauEmpire } from './tauEmpire'

// ---------------------------------------------------------------------------
// T'AU SEPTS — four septs and the Kroot Hunting Pack as flavour sub-factions of
// the T'au Empire (2026-10-04), built like the AM Regiments: same points,
// prices and value boxes; each adds an `identity` (unit tag weights),
// `signature` units and its own composition profile. Sources: Frontline Gaming
// / BoLS sept summaries, Warhammer Community (Kroot Hunting Pack), Wargamer (the
// Twin Lance). Picked with the user:
//   T'au Sept — the balanced Hunter Cadre, led by Shadowsun;
//   Farsight Enclaves — battlesuits under Farsight (his rival Shadowsun is out);
//   Vior'la — fast and aggressive; Bork'an — long-range gunlines;
//   Kroot Hunting Pack — heavily Kroot, with T'au guns (Hammerheads, Sky Rays,
//   Riptides) for the ranged support the Kroot lack. Kroot stay available to
//   every sept as auxiliaries.
// Sept-only units: Shadowsun (T'au Sept) and Farsight (Farsight Enclaves).
// ---------------------------------------------------------------------------

const SEPT_ONLY: Record<string, string[]> = {
  'tau-tau-sept': ['shadowsun'],
  'tau-farsight': ['farsight'],
}

/** Pick-weight overrides per sept (the Stormsurge is 0.2 elsewhere). */
const PICK_WEIGHT: Record<string, Record<string, number>> = {
  'tau-borkan': { stormsurge: 0.6 },
}

const sept = (
  s: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => {
  const othersOnly = new Set(
    Object.entries(SEPT_ONLY)
      .filter(([id]) => id !== s.id)
      .flatMap(([, ids]) => ids),
  )
  return {
    ...tauEmpire,
    flavour: 0.5,
    ...s,
    parent: tauEmpire.id,
    subfactionLabel: undefined,
    units: tauEmpire.units
      .filter((u) => !othersOnly.has(u.id))
      .map((u) => ({
        ...u,
        ...(SEPT_ONLY[s.id]?.includes(u.id) ? { exclusive: true } : {}),
        ...(PICK_WEIGHT[s.id]?.[u.id] !== undefined ? { pickWeight: PICK_WEIGHT[s.id][u.id] } : {}),
        ...(u.leads ? { leads: u.leads.filter((id) => !othersOnly.has(id)) } : {}),
      })),
  }
}

export const tauSept = sept({
  id: 'tau-tau-sept',
  name: "T'au Sept",
  // The Hunter Cadre: Fire Warriors and Pathfinders backed by suits and tanks.
  identity: { firewarrior: 2, battlesuit: 1, gravtank: 1 },
  signature: ['shadowsun'],
  profile: { character: 1.5, infantry: 4.5, mounted: 0.5, vehicle: 4 },
  blurb:
    'The heart of the Empire. Balanced Hunter Cadres of Fire Warriors and Pathfinders, battlesuits and grav-tanks, under Commander Shadowsun.',
})

export const farsight = sept({
  id: 'tau-farsight',
  name: 'Farsight Enclaves',
  // Battlesuit warfare: Commanders, Crisis teams, Broadsides, Riptides.
  identity: { battlesuit: 3 },
  signature: ['farsight'],
  profile: { character: 2, infantry: 4, mounted: 0.5, vehicle: 4 },
  blurb:
    'The renegade Enclaves beyond the Damocles Gulf. Farsight leads aggressive battlesuit cadres — many Commanders, few Fire Warriors.',
})

export const viorla = sept({
  id: 'tau-viorla',
  name: "Vior'la",
  // Hot-blooded strikes: Breachers in Devilfish, Piranhas, Crisis suits.
  identity: { fast: 3, firewarrior: 1 },
  transportChance: 0.6,
  profile: { character: 1.5, infantry: 4.5, mounted: 0.5, vehicle: 4 },
  blurb:
    "Vior'la burns hot — Breacher Teams in Devilfish, Piranha skimmers and jet-packed battlesuits strike fast and close.",
})

export const borkan = sept({
  id: 'tau-borkan',
  name: "Bork'an",
  // Weapon-makers: Broadsides, Hammerheads, Sky Rays and the Stormsurge.
  identity: { heavy: 3, gravtank: 1 },
  profile: { character: 1.5, infantry: 3.5, mounted: 0.5, vehicle: 5 },
  blurb:
    "Bork'an's Earth Caste workshops arm its cadres with the best long-range guns — Broadsides, Hammerheads and Sky Rays that out-range the foe.",
})

export const krootHuntingPack = sept({
  id: 'tau-kroot',
  name: 'Kroot Hunting Pack',
  // Mostly Kroot, with T'au guns for the ranged support they lack.
  identity: { kroot: 3, heavy: 1 },
  // Kroot are poor points-per-euro, so lean further to flavour (user: heavily Kroot).
  flavour: 0.75,
  transportChance: 0.1,
  profile: { character: 1.5, infantry: 5, mounted: 2.5, vehicle: 2.5 },
  blurb:
    'The Kroot fight as their own hunting packs — Carnivores, Farstalkers, Hounds and Krootox under their Shapers, with T’au gunships in support.',
})

export const septs = [tauSept, farsight, viorla, borkan, krootHuntingPack]
