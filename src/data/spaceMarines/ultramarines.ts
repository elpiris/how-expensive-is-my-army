import type { Faction, Unit } from '../../types'
import { baseUnits, gettingStartedBox } from './base'

// Codex-compliant: the full base roster + Ultramarines-only characters/units.
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
    kit: { name: 'Roboute Guilliman', priceEUR: 60, models: 1 },
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
    leads: ['intercessors', 'assault-intercessors', 'aggressors', 'bladeguard', 'terminators'],
    kit: { name: 'Marneus Calgar in Armour of Antilochus', priceEUR: 43.5, models: 1, verified: true },
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
    leads: ['intercessors', 'bladeguard'],
    kit: { name: 'Chief Librarian Tigurius', priceEUR: 37, models: 1, verified: true, onlineOnly: true },
  },
  {
    id: 'victrix-guard',
    name: 'Victrix Honour Guard',
    role: 'infantry',
    points: 120,
    models: 3,
    flavor: 4,
    keywords: ['Infantry'],
    kit: { name: 'Victrix Honour Guard', priceEUR: 45, models: 3 },
  },
]

export const ultramarines: Faction = {
  id: 'sm-ultramarines',
  name: 'Ultramarines',
  system: 'w40k',
  category: 'space-marines',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // The exemplary Codex Chapter — balanced combined arms. No monster share on
  // purpose: Guilliman's outsized pts/€ already fields him in ~70% of 2000-pt
  // lists; a share would make him a certainty.
  profile: { character: 2, infantry: 4, mounted: 1, vehicle: 3 },
  blurb:
    'The exemplary Chapter of the Codex Astartes. Disciplined, balanced combined-arms warfare under Guilliman and Calgar.',
  units: [...baseUnits, ...unique],
  valueBoxes: [gettingStartedBox],
  competitiveLists: {},
}
