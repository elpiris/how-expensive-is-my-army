import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, exclusive, gettingStartedBox, heroesOfTheChapter, honouredOfTheChapter } from './base'

// Codex-compliant: the full base roster + Iron Hands characters.
// Points from the MFM (Space Marines page, Iron Hands section) 2026-10-03.
// Prices hand-checked on warhammer.com en-EU 2026-10-03.
const unique: Unit[] = [
  {
    id: 'caanok-var',
    name: 'Caanok Var',
    role: 'epic-hero',
    epicHero: true,
    points: 100,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Terminator', 'Epic Hero', 'Leader'],
    leads: ['terminators', 'assault-terminators'],
    kit: { name: 'Caanok Var', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'iron-father-feirros',
    name: 'Iron Father Feirros',
    role: 'epic-hero',
    epicHero: true,
    points: 85,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['aggressors', 'eradicators', 'eradicators-hb', 'heavy-intercessors'],
    kit: { name: 'Iron Father Feirros', priceEUR: 38.5, models: 1, verified: true },
  },
]

export const ironHands: Faction = {
  id: 'sm-iron-hands',
  name: 'Iron Hands',
  system: 'w40k',
  category: 'space-marines',
  chapter: 'codex',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Flesh is weak: Dreadnoughts, tanks and armoured gunlines over speed.
  profile: { character: 2, infantry: 3.5, mounted: 0.5, vehicle: 4 },
  identity: { dreadnought: 3, tank: 3, gravis: 2, techmarine: 2 },
  blurb:
    'The flesh is weak. Iron Hands replace it with bionics and fight from behind walls of armour — Dreadnoughts, tanks and implacable gunlines.',
  units: [...baseUnits, ...exclusive(unique)],
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter, honouredOfTheChapter],
  competitiveLists: {},
}
