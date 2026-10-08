import type { Faction } from '../types'
import { orks } from './orks'

// ---------------------------------------------------------------------------
// ORK CLANS — the seven great clans as flavour sub-factions of the Orks
// (2026-10-08). Same roster, points, prices and value boxes; each adds an
// `identity` (unit tag weights), signature characters and its own composition
// profile. Favoured only, not exclusive: every clan fields the same Orks, it's
// their style that differs (and all keep the Getting Started box). Shared by
// everyone: Warbosses, Weirdboyz, Painboyz, Gretchin, Stormboyz, Battlewagons,
// Zodgrod and the big walkers (still one per army). Lootas, Burna Boyz, Kaptin
// Badrukk and Zagstruk aren't in our roster (not in the MFM / no current kit).
// ---------------------------------------------------------------------------

const clan = (
  c: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...orks,
  flavour: 0.5,
  ...c,
  parent: orks.id,
  subfactionLabel: undefined,
})

export const goffs = clan({
  id: 'orks-goffs',
  name: 'Goffs',
  // The biggest, meanest mobs: Boyz, Nobz, Meganobz, Kans and Dreads.
  identity: { melee: 3 },
  signature: ['ghazghkull'],
  profile: { character: 2, infantry: 6, mounted: 1, vehicle: 2.5, monster: 0.5 },
  blurb:
    'The Goffs live for close combat — huge mobs of Boyz, Nobz and Meganobz stomping forward under Ghazghkull himself.',
})

export const evilSunz = clan({
  id: 'orks-evil-sunz',
  name: 'Evil Sunz',
  // Speed freeks: bikes, buggies, koptas and Trukks — red ones go fasta.
  identity: { fast: 3 },
  signature: ['wazdakka'],
  transportChance: 0.8,
  profile: { character: 2, infantry: 3, mounted: 3, vehicle: 4, monster: 0.5 },
  blurb:
    'The Evil Sunz worship speed — Warbikers, buggies, Deffkoptas and Trukk-borne Boyz roaring in a cloud of red-painted exhaust, led by Wazdakka.',
})

export const badMoons = clan({
  id: 'orks-bad-moons',
  name: 'Bad Moons',
  // The rich clan: Flash Gitz, Tankbustas, Gunwagons — dakka, dakka, dakka.
  identity: { heavy: 3 },
  // Nazdreg leads Meganobz — Mega Armour is a rich Bad Moons' thing.
  signature: ['nazdreg', 'meganobz'],
  profile: { character: 2, infantry: 5, mounted: 1, vehicle: 3.5, monster: 0.5 },
  blurb:
    'The Bad Moons have the teef to buy the best guns — Flash Gitz, Tankbustas and Gunwagons drowning the foe in dakka under Nazdreg.',
})

export const deathskulls = clan({
  id: 'orks-deathskulls',
  name: 'Deathskulls',
  // Lootas and Meks: Big Meks, Mek Gunz, Kans and anything scavenged.
  identity: { mek: 3, heavy: 1 },
  profile: { character: 2.5, infantry: 4.5, mounted: 1, vehicle: 3.5, monster: 0.5 },
  blurb:
    'The Deathskulls loot everything — Big Meks with kustom force fields and Shokk Attack Guns, Mek Gunz, Killa Kans and scavenged tanks.',
})

export const snakebites = clan({
  id: 'orks-snakebites',
  name: 'Snakebites',
  // Old ways: Beast Snagga Boyz, Squighogs, Beastbosses and Rigs.
  identity: { beast: 3 },
  signature: ['mozrog'],
  profile: { character: 2, infantry: 4.5, mounted: 3, vehicle: 2.5, monster: 1.5 },
  blurb:
    'The Snakebites keep to the old ways — Beast Snagga Boyz, Squighog riders and Beastbosses hunting the biggest prey, with Mozrog at their head.',
})

export const bloodAxes = clan({
  id: 'orks-blood-axes',
  name: 'Blood Axes',
  // Sneaky gits: Kommandos and tactics stolen from the humies.
  identity: { stealth: 3, fast: 1 },
  signature: ['boss-snikrot'],
  profile: { character: 2, infantry: 5, mounted: 1.5, vehicle: 3, monster: 0.5 },
  blurb:
    'The Blood Axes fight like humies — sneaky Kommandos under Boss Snikrot ambushing the foe while the rest of the warband rolls in.',
})

export const freebooterz = clan({
  id: 'orks-freebooterz',
  name: 'Freebooterz',
  // Pirates: Dakkajets, Bommers, the Wazbom and Flash Gitz.
  identity: { aircraft: 3, heavy: 1 },
  profile: { character: 2, infantry: 4.5, mounted: 1, vehicle: 4, monster: 0.5 },
  blurb:
    'Freebooterz are Ork pirates — Dakkajets and bommers screaming overhead while flashy kaptins and their gitz grab the loot.',
})

export const clans = [goffs, evilSunz, badMoons, deathskulls, snakebites, bloodAxes, freebooterz]
