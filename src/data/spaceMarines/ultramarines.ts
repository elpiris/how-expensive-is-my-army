import type { Faction, Unit } from '../../types'
import { baseUnits, darkAngelsCP, exclusive, gettingStartedBox, heroesOfTheChapter, honouredOfTheChapter } from './base'

// Codex-compliant: the full base roster + Ultramarines-only characters/units
// (MFM points + hand-checked en-EU prices 2026-10-03).
const unique: Unit[] = [
  {
    id: 'guilliman',
    name: 'Roboute Guilliman',
    role: 'epic-hero',
    epicHero: true,
    points: 415,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Monster', 'Epic Hero', 'Primarch'],
    kit: { name: 'Roboute Guilliman', priceEUR: 60, models: 1, verified: true },
  },
  {
    id: 'calgar',
    name: 'Marneus Calgar',
    role: 'epic-hero',
    epicHero: true,
    points: 180,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['aggressors', 'assault-intercessors', 'bladeguard', 'company-heroes', 'eradicators', 'eradicators-hb', 'heavy-intercessors', 'infernus', 'intercessors', 'sternguard', 'terminators', 'assault-terminators', 'vanguard-veterans', 'victrix-guard'],
    kit: { name: 'Marneus Calgar in Armour of Antilochus', priceEUR: 45, models: 1, verified: true },
  },
  {
    id: 'tigurius',
    name: 'Chief Librarian Tigurius',
    role: 'epic-hero',
    epicHero: true,
    points: 115,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Psyker', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'desolation', 'infernus', 'intercessors', 'sternguard', 'vanguard-veterans'],
    kit: { name: 'Chief Librarian Tigurius', priceEUR: 38.5, models: 1, onlineOnly: true, verified: true },
  },
  {
    id: 'victrix-guard',
    name: 'Victrix Honour Guard',
    role: 'infantry',
    points: 120,
    pointsEscalated: 150,
    models: 3,
    flavor: 4,
    keywords: ['Infantry'],
    kit: { name: 'Victrix Honour Guard', priceEUR: 52, models: 3, verified: true },
  },
  {
    id: 'titus',
    name: 'Captain Titus',
    role: 'epic-hero',
    epicHero: true,
    points: 115,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'hellblasters', 'infernus', 'intercessors', 'sternguard', 'vanguard-veterans'],
    // Sold together with the Wardens of Ultramar in one box, so its kit IS that box.
    kit: {
      name: 'Captain Titus and the Wardens of Ultramar',
      priceEUR: 77,
      models: 1,
      verified: true,
      alsoBuilds: [{ unitId: 'wardens-of-ultramar', models: 6 }],
    },
  },
  {
    id: 'sicarius',
    name: 'Cato Sicarius',
    role: 'epic-hero',
    epicHero: true,
    points: 115,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['victrix-guard'],
    kit: { name: 'Cato Sicarius', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'konorius',
    name: 'Kaius Konorius',
    role: 'epic-hero',
    epicHero: true,
    points: 100,
    models: 1,
    flavor: 3,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'sternguard', 'victrix-guard'],
    kit: { name: 'Kaius Konorius', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'wardens-of-ultramar',
    name: 'Wardens of Ultramar',
    role: 'character',
    // A 6-model support unit that attaches to a squad (MFM: 6 models 115 pts).
    points: 115,
    models: 6,
    flavor: 3,
    keywords: ['Character', 'Infantry'],
    leads: ['assault-intercessors', 'bladeguard', 'intercessors', 'sternguard', 'vanguard-veterans'],
    kit: {
      name: 'Captain Titus and the Wardens of Ultramar',
      priceEUR: 77,
      models: 6,
      verified: true,
      alsoBuilds: [{ unitId: 'titus', models: 1 }],
    },
  },
]

export const ultramarines: Faction = {
  id: 'sm-ultramarines',
  name: 'Ultramarines',
  system: 'w40k',
  category: 'space-marines',
  chapter: 'codex',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // The exemplary Codex Chapter — balanced combined arms. No monster share on
  // purpose: Guilliman's outsized pts/€ already fields him in ~70% of 2000-pt
  // lists; a share would make him a certainty.
  profile: { character: 2, infantry: 4, mounted: 1, vehicle: 3 },
  identity: { bolter: 2, veteran: 2 },
  blurb:
    'The exemplary Chapter of the Codex Astartes. Disciplined, balanced combined-arms warfare under Guilliman and Calgar.',
  units: [...baseUnits, ...exclusive(unique)],
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter, honouredOfTheChapter],
  competitiveLists: {},
}
