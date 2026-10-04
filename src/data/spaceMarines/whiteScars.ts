import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, exclusive, gettingStartedBox, heroesOfTheChapter, honouredOfTheChapter } from './base'

// Codex-compliant: the full base roster + White Scars characters.
// Points from the MFM (Space Marines page, White Scars section) 2026-10-03.
// Prices hand-checked on warhammer.com en-EU 2026-10-03.
const unique: Unit[] = [
  {
    id: 'korsarro-khan',
    name: "Kor'sarro Khan",
    role: 'epic-hero',
    epicHero: true,
    points: 80,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'company-heroes', 'intercessors', 'sternguard', 'vanguard-veterans'],
    kit: { name: "Kor'sarro Khan", priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'suboden-khan',
    name: 'Suboden Khan',
    role: 'epic-hero',
    epicHero: true,
    points: 105,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Mounted', 'Epic Hero', 'Leader'],
    leads: ['outriders'],
    kit: { name: 'Suboden Khan', priceEUR: 47.5, models: 1, verified: true },
  },
]

export const whiteScars: Faction = {
  id: 'sm-white-scars',
  name: 'White Scars',
  system: 'w40k',
  category: 'space-marines',
  transportChance: 0.35,
  parent: 'space-marines',
  chapter: 'codex',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Lightning warfare: bikes and fast attack lead the charge.
  profile: { character: 2, infantry: 3.5, mounted: 2.5, vehicle: 2.5 },
  identity: { bike: 3, speeder: 3, jump: 1, melee: 1 },
  blurb:
    'Masters of lightning warfare. White Scars strike hard and fast from the saddle — bike squadrons, speeders and swift assault infantry.',
  units: [...baseUnits, ...exclusive(unique)],
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter, honouredOfTheChapter],
  competitiveLists: {},
}
