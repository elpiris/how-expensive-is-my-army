import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, gettingStartedBox } from './base'

const unique: Unit[] = [
  {
    id: 'lysander',
    name: 'Captain Lysander',
    role: 'epic-hero',
    epicHero: true,
    points: 160,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Terminator', 'Epic Hero', 'Leader'],
    leads: ['terminators', 'assault-terminators'],
    kit: { name: 'Captain Lysander', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'tor-garadon',
    name: 'Tor Garadon',
    role: 'character',
    points: 90,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['aggressors', 'eradicators'],
    kit: { name: 'Tor Garadon', priceEUR: 38.5, models: 1, verified: true },
  },
]

export const imperialFists: Faction = {
  id: 'sm-imperial-fists',
  name: 'Imperial Fists',
  system: 'w40k',
  category: 'space-marines',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Siege-masters: disciplined firepower and armour over mobility.
  profile: { character: 2, infantry: 4, mounted: 0.5, vehicle: 3.5 },
  blurb:
    'Stalwart siege specialists. Imperial Fists excel at unflinching bolter discipline, heavy weapons and armoured assault.',
  units: [...baseUnits, ...unique],
  valueBoxes: [gettingStartedBox, darkAngelsCP],
  competitiveLists: {},
}
