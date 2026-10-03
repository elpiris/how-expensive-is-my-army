import type { Faction, Unit, ValueBox } from '../../types'
import { baseUnits, darkAngelsCP } from './base'

// Non-codex: Black Templars abhor the psychic — they CANNOT field Librarians or
// any Psyker — so the base roster is filtered, then their zealous melee units
// and characters are added. Unique-unit points (MFM) and prices (warhammer.com
// en-EU) re-verified 2026-10-03, with the Black Templars Combat Patrol's contents.
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
    kit: { name: 'High Marshal Helbrecht', priceEUR: 47.5, models: 1, verified: true },
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
    kit: { name: 'Chaplain Grimaldus & Retinue', priceEUR: 47.5, models: 4, verified: true },
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
    kit: { name: "Emperor's Champion", priceEUR: 36, models: 1, verified: true },
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
    kit: { name: 'Black Templars Marshal', priceEUR: 34, models: 1, verified: true },
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
    kit: { name: 'Black Templars Castellan', priceEUR: 34, models: 1, verified: true },
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
    kit: { name: 'Primaris Crusader Squad', priceEUR: 53, models: 10, verified: true },
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
    kit: { name: 'Black Templars Sword Brethren', priceEUR: 53, models: 5, verified: true },
  },
]

// Combat Patrol: Black Templars (Vow-sworn of Vedrenn) — 19 models, contents
// confirmed on the product page 2026-10-03. (The Sword Brethren sprue can
// alternatively build a Castellan; not counted as a bonus.)
const blackTemplarsCP: ValueBox = {
  id: 'cp-black-templars',
  name: 'Combat Patrol: Black Templars',
  priceEUR: 139,
  verified: true,
  url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-black-templars-2025',
  builds: [
    { unitId: 'emperors-champion', models: 1 },
    { unitId: 'bladeguard', models: 3 },
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
  // Own CP first (seeds the list); the generic Dark Angels CP also fits. The
  // Getting Started box is left out — its Librarian is a psyker.
  valueBoxes: [blackTemplarsCP, darkAngelsCP],
  competitiveLists: {},
}
