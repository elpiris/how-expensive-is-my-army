import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, exclusive, gettingStartedBox, heroesOfTheChapter, honouredOfTheChapter } from './base'

// Codex-compliant: the full base roster + Raven Guard characters.
// Points from the MFM (Space Marines page, Raven Guard section) 2026-10-03.
// Prices hand-checked on warhammer.com en-EU 2026-10-03.
const unique: Unit[] = [
  {
    id: 'kayvaan-shrike',
    name: 'Kayvaan Shrike',
    role: 'epic-hero',
    epicHero: true,
    points: 95,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Jump Pack', 'Fly', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors-jp', 'vanguard-veterans'],
    kit: { name: 'Kayvaan Shrike', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'aethon-shaan',
    name: 'Aethon Shaan',
    role: 'epic-hero',
    epicHero: true,
    points: 105,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero'],
    kit: { name: 'Aethon Shaan', priceEUR: 38.5, models: 1, verified: true },
  },
]

export const ravenGuard: Faction = {
  id: 'sm-raven-guard',
  name: 'Raven Guard',
  system: 'w40k',
  category: 'space-marines',
  transportChance: 0.35,
  parent: 'space-marines',
  chapter: 'codex',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Shadow warriors: infiltrators, scouts and jump-pack strikes, light on armour.
  profile: { character: 2, infantry: 5, mounted: 0.5, vehicle: 2 },
  identity: { phobos: 3, jump: 3 },
  blurb:
    'Masters of the shadowed strike. Raven Guard infiltrate, ambush and vanish — scouts, jump-pack veterans and precise decapitation attacks.',
  units: [...baseUnits, ...exclusive(unique)],
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter, honouredOfTheChapter],
  competitiveLists: {},
}
