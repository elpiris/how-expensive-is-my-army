import type { Faction } from '../types'
import { aeldari } from './aeldari'

// ---------------------------------------------------------------------------
// AELDARI CRAFTWORLDS — the five great Craftworlds as flavour sub-factions of
// the Aeldari (2026-10-03). Same roster, points, prices and Combat Patrol as
// the base Aeldari (current rules don't lock units to a Craftworld); each adds
// an `identity` (tag weights), `signature` units it's famous for, and its own
// composition profile, so lists read like that Craftworld. Sources: the
// Craftworld attributes / lore (Codex: Craftworlds, BoLS / B&C summaries).
// Generated halfway between value and flavour (`flavour: 0.5`): full flavour
// made Alaitoc / Saim-Hann lists 25–30% pricier (Rangers, jetbikes and aircraft
// are poor points-per-euro); halfway reads clearly as the Craftworld for +7…14%.
// `signature` is kept to famous characters (Avatar, Eldrad, Yriel, Spiritseers);
// unit preferences come from `identity` alone, so they don't double-count.
// Illic Nightspear (Alaitoc) is no longer in the MFM, so Alaitoc has none.
// ---------------------------------------------------------------------------

const craftworld = (c: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb'>): Faction => ({
  ...aeldari,
  ...c,
  parent: aeldari.id,
  subfactionLabel: undefined,
  flavour: 0.5,
})

export const bielTan = craftworld({
  id: 'aeldari-biel-tan',
  name: 'Biel-Tan',
  // The Swordwind: Aspect Warrior shrines, Phoenix Lords and the Avatar.
  identity: { aspect: 3, phoenix: 2, melee: 1 },
  signature: ['avatar-of-khaine'],
  profile: { character: 2, infantry: 5.5, mounted: 1, vehicle: 1.5, monster: 1 },
  blurb:
    'The Swordwind. Biel-Tan wage war as a host of Aspect Warriors led by Exarchs and Phoenix Lords, with the Avatar of Khaine at their head.',
})

export const ulthwe = craftworld({
  id: 'aeldari-ulthwe',
  name: 'Ulthwé',
  // The Damned: seer councils and the Black Guardian militia.
  identity: { seer: 3, guardian: 3, walker: 1 },
  signature: ['eldrad-ulthran'],
  profile: { character: 3, infantry: 4.5, mounted: 1, vehicle: 2, monster: 0.5 },
  blurb:
    'Ulthwé the Damned. Farseers and Warlock councils guide disciplined Black Guardian hosts, foreseeing every move under Eldrad Ulthran.',
})

export const saimHann = craftworld({
  id: 'aeldari-saim-hann',
  name: 'Saim-Hann',
  // The Wild Riders: jetbikes, Vypers and Skyrunner seers.
  identity: { jetbike: 3, gravtank: 1, aspect: 1 },
  profile: { character: 2, infantry: 2.5, mounted: 4, vehicle: 2, monster: 0.5 },
  blurb:
    'The Wild Riders. Saim-Hann strike from the saddle — jetbike squadrons, Vypers and Skyrunner seers that hit and vanish before the foe can react.',
})

export const iyanden = craftworld({
  id: 'aeldari-iyanden',
  name: 'Iyanden',
  // The ghost warriors: wraith constructs guided by Spiritseers.
  identity: { wraith: 3, seer: 1 },
  signature: ['prince-yriel', 'spiritseer'],
  profile: { character: 1.5, infantry: 3.5, mounted: 0.5, vehicle: 2, monster: 3 },
  blurb:
    'The ghost warriors. Bled white by the Tyranids, Iyanden fight with the dead — Wraithguard, Wraithlords and Wraithknights led by Spiritseers.',
})

export const alaitoc = craftworld({
  id: 'aeldari-alaitoc',
  name: 'Alaitoc',
  // Rangers and Pathfinders: stealth, scouting and precise strikes.
  identity: { stealth: 3, aspect: 1, aircraft: 1 },
  profile: { character: 2, infantry: 4.5, mounted: 1.5, vehicle: 2, monster: 0.5 },
  blurb:
    'The Rangers. Alaitoc hold to the Path so strictly that many wander as Rangers — unseen marksmen and scouts who strike with precision.',
})

export const craftworlds = [bielTan, ulthwe, saimHann, iyanden, alaitoc]
