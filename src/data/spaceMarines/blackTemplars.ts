import type { Faction, Unit, ValueBox } from '../../types'
import { baseUnits } from './base'

// Non-codex: Black Templars abhor the psychic — they CANNOT field Librarians or
// any Psyker — so the base roster is filtered, then their zealous melee units
// and characters are added.
const btBase = baseUnits.filter((u) => !(u.keywords ?? []).some((k) => k.toLowerCase() === 'psyker'))

const unique: Unit[] = [
  {
    id: 'helbrecht',
    name: 'High Marshal Helbrecht',
    role: 'epic-hero',
    epicHero: true,
    points: 125,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'crusader-squad', 'sword-brethren'],
    kit: { name: 'High Marshal Helbrecht', priceEUR: 34, models: 1 },
  },
  {
    id: 'grimaldus',
    name: 'Chaplain Grimaldus',
    role: 'epic-hero',
    epicHero: true,
    points: 120,
    models: 4,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Epic Hero', 'Leader'],
    leads: ['assault-intercessors', 'crusader-squad'],
    kit: { name: 'Chaplain Grimaldus', priceEUR: 40, models: 4 },
  },
  {
    id: 'emperors-champion',
    name: "Emperor's Champion",
    role: 'character',
    points: 100,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['assault-intercessors', 'crusader-squad', 'sword-brethren'],
    kit: { name: "Emperor's Champion", priceEUR: 25, models: 1 },
  },
  {
    id: 'marshal',
    name: 'Marshal',
    role: 'character',
    points: 80,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'sword-brethren'],
    kit: { name: 'Marshal', priceEUR: 27, models: 1 },
  },
  {
    id: 'castellan',
    name: 'Castellan',
    role: 'character',
    points: 75,
    models: 1,
    flavor: 3,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['crusader-squad'],
    kit: { name: 'Castellan', priceEUR: 27, models: 1 },
  },
  {
    id: 'crusader-squad',
    name: 'Crusader Squad',
    role: 'battleline',
    // MFM: 10 models (1 Sword Brother, 4 Neophytes, 5 Initiates) 160 pts.
    points: 160,
    models: 10,
    flavor: 4,
    keywords: ['Battleline', 'Infantry'],
    kit: { name: 'Primaris Crusader Squad', priceEUR: 50, models: 10 },
  },
  {
    id: 'sword-brethren',
    name: 'Sword Brethren',
    role: 'infantry',
    points: 140,
    pointsEscalated: 150,
    models: 5,
    flavor: 4,
    keywords: ['Infantry'],
    kit: { name: 'Sword Brethren', priceEUR: 45, models: 5 },
  },
]

// Combat Patrol: Black Templars — contents approximate (not re-confirmed this pass).
const blackTemplarsCP: ValueBox = {
  id: 'cp-black-templars',
  name: 'Combat Patrol: Black Templars',
  priceEUR: 139,
  builds: [
    { unitId: 'castellan', models: 1 },
    { unitId: 'sword-brethren', models: 5 },
    { unitId: 'crusader-squad', models: 10 },
  ],
}

export const blackTemplars: Faction = {
  id: 'sm-black-templars',
  name: 'Black Templars',
  system: 'w40k',
  category: 'space-marines',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Zealous melee crusaders — infantry-heavy, no psykers.
  profile: { character: 2.5, infantry: 5, mounted: 0.5, vehicle: 2 },
  blurb:
    'The most fervent of crusaders. Black Templars shun all psykers and charge home with chainsword and zeal behind the Emperor’s Champion.',
  units: [...btBase, ...unique],
  valueBoxes: [blackTemplarsCP],
  competitiveLists: {},
}
