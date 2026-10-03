import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, exclusive, gettingStartedBox, heroesOfTheChapter, honouredOfTheChapter } from './base'

const unique: Unit[] = [
  {
    id: 'vulkan-hestan',
    name: "Vulkan He'stan",
    role: 'epic-hero',
    epicHero: true,
    points: 105,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'company-heroes', 'eradicators', 'infernus', 'vanguard-veterans'],
    kit: { name: "Vulkan He'stan", priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'adrax-agatone',
    name: 'Adrax Agatone',
    role: 'epic-hero',
    epicHero: true,
    points: 90,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'company-heroes', 'infernus', 'intercessors', 'sternguard', 'vanguard-veterans'],
    kit: { name: 'Adrax Agatone', priceEUR: 38.5, models: 1, verified: true },
  },
]

export const salamanders: Faction = {
  id: 'sm-salamanders',
  name: 'Salamanders',
  system: 'w40k',
  category: 'space-marines',
  parent: 'space-marines',
  chapter: 'codex',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Close-ranged flame and melee specialists; infantry-forward.
  profile: { character: 2, infantry: 5, mounted: 0.5, vehicle: 2.5 },
  identity: { flamer: 3, melta: 3, terminator: 1 },
  blurb:
    'Master artisans of Nocturne. Salamanders favour flame weapons, thunder hammers and resilient, close-ranged infantry.',
  units: [...baseUnits, ...exclusive(unique)],
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter, honouredOfTheChapter],
  competitiveLists: {},
}
