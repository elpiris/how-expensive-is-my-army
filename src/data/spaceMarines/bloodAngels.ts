import type { Faction, Unit, ValueBox } from '../../types'
import { baseUnits, darkAngelsCP, gettingStartedBox, heroesOfTheChapter } from './base'

// Non-codex: the full base roster + the Blood Angels' unique datasheets (Death
// Company, Sanguinary Guard, Baal Predator and the Chapter's heroes).
// Points from the MFM (Blood Angels page) 2026-10-03. Prices hand-checked on
// warhammer.com en-EU 2026-10-03. Several BA datasheets are built from generic
// SM kits (same miniatures, Chapter paint job): BA/DC Captains = the Captain kit,
// Death Company = Assault Intercessors (10/box) or Jump Pack Intercessors (5/box),
// Death Company Dreadnought = the Brutalis Dreadnought kit. Shared kits pool in
// costing, so e.g. 5 Death Company + 5 Assault Intercessors need just one box.
const unique: Unit[] = [
  // --- Epic Heroes ---
  {
    id: 'dante',
    name: 'Commander Dante',
    role: 'epic-hero',
    epicHero: true,
    points: 140,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Jump Pack', 'Fly', 'Epic Hero', 'Leader'],
    leads: ['vanguard-veterans', 'sanguinary-guard'],
    kit: { name: 'Commander Dante', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'mephiston',
    name: 'Chief Librarian Mephiston',
    role: 'epic-hero',
    epicHero: true,
    points: 175,
    models: 1,
    flavor: 5,
    keywords: ['Character', 'Infantry', 'Psyker', 'Epic Hero'],
    kit: { name: 'Mephiston', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'sanguinor',
    name: 'The Sanguinor',
    role: 'epic-hero',
    epicHero: true,
    points: 120,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Fly', 'Epic Hero'],
    kit: { name: 'The Sanguinor', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'lemartes',
    name: 'Lemartes',
    role: 'epic-hero',
    epicHero: true,
    points: 110,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Jump Pack', 'Fly', 'Epic Hero', 'Leader'],
    leads: ['death-company-jp'],
    kit: { name: 'Lemartes', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'astorath',
    name: 'Astorath',
    role: 'epic-hero',
    epicHero: true,
    points: 90,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Jump Pack', 'Fly', 'Epic Hero', 'Leader'],
    leads: ['death-company-jp'],
    kit: { name: 'Astorath the Grim', priceEUR: 38.5, models: 1, verified: true },
  },
  // --- Characters ---
  {
    id: 'ba-captain',
    name: 'Blood Angels Captain',
    role: 'character',
    points: 90,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['assault-intercessors', 'infernus', 'intercessors', 'sternguard'],
    kit: { name: 'Space Marines Captain', priceEUR: 36, models: 1, verified: true },
  },
  {
    id: 'dc-captain',
    name: 'Death Company Captain',
    role: 'character',
    points: 80,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['death-company'],
    kit: { name: 'Space Marines Captain', priceEUR: 36, models: 1, verified: true },
  },
  {
    id: 'dc-captain-jp',
    name: 'Death Company Captain with Jump Pack',
    role: 'character',
    points: 85,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Jump Pack', 'Fly', 'Leader'],
    leads: ['death-company-jp'],
    kit: { name: 'Captain with Jump Pack', priceEUR: 38.5, models: 1, verified: true },
  },
  {
    id: 'sanguinary-priest',
    name: 'Sanguinary Priest',
    role: 'character',
    points: 60,
    models: 1,
    flavor: 4,
    keywords: ['Character', 'Infantry', 'Leader'],
    leads: ['assault-intercessors', 'bladeguard', 'hellblasters', 'infernus', 'intercessors', 'sternguard'],
    kit: { name: 'Sanguinary Priest', priceEUR: 34.5, models: 1, verified: true },
  },
  // --- Infantry ---
  {
    id: 'death-company',
    name: 'Death Company Marines',
    role: 'infantry',
    points: 90,
    pointsEscalated: 105,
    models: 5,
    flavor: 5,
    keywords: ['Infantry'],
    kit: { name: 'Assault Intercessor Squad', priceEUR: 53, models: 10, verified: true },
  },
  {
    id: 'death-company-jp',
    name: 'Death Company Marines with Jump Packs',
    role: 'infantry',
    points: 130,
    pointsEscalated: 160,
    models: 5,
    flavor: 5,
    keywords: ['Infantry', 'Jump Pack', 'Fly'],
    kit: { name: 'Assault Intercessors with Jump Packs', priceEUR: 53, models: 5, verified: true },
  },
  {
    id: 'sanguinary-guard',
    name: 'Sanguinary Guard',
    role: 'infantry',
    points: 135,
    pointsEscalated: 150,
    models: 3,
    flavor: 5,
    keywords: ['Infantry', 'Jump Pack', 'Fly'],
    kit: { name: 'Sanguinary Guard', priceEUR: 51, models: 3, verified: true },
  },
  // --- Vehicles ---
  {
    id: 'death-company-dreadnought',
    name: 'Death Company Dreadnought',
    role: 'vehicle',
    points: 165,
    pointsEscalated: 185,
    models: 1,
    flavor: 4,
    keywords: ['Vehicle', 'Walker'],
    kit: { name: 'Brutalis Dreadnought', priceEUR: 70, models: 1, verified: true },
  },
  {
    id: 'baal-predator',
    name: 'Baal Predator',
    role: 'vehicle',
    points: 135,
    pointsEscalated: 150,
    models: 1,
    flavor: 4,
    keywords: ['Vehicle'],
    kit: { name: 'Baal Predator', priceEUR: 64, models: 1, verified: true },
  },
]

// Combat Patrol: Blood Angels — 17 models (€139): a Blood Angels Captain, 6
// Sanguinary Guard and 10 Assault Intercessors, per the product page 2026-10-03.
const bloodAngelsCP: ValueBox = {
  id: 'cp-blood-angels',
  name: 'Combat Patrol: Blood Angels',
  priceEUR: 139,
  verified: true,
  url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-blood-angels-2024',
  builds: [
    { unitId: 'ba-captain', models: 1 },
    { unitId: 'sanguinary-guard', models: 6 },
    { unitId: 'assault-intercessors', models: 10 },
  ],
}

export const bloodAngels: Faction = {
  id: 'sm-blood-angels',
  name: 'Blood Angels',
  system: 'w40k',
  category: 'space-marines',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Angelic shock assault: jump-pack elites and Death Company, many heroes.
  profile: { character: 2.5, infantry: 5, mounted: 0.5, vehicle: 2 },
  blurb:
    'The sons of Sanguinius. Blood Angels fall on the foe from the skies — golden Sanguinary Guard, the frenzied Death Company and legendary heroes.',
  units: [...baseUnits, ...unique],
  // Own CP first (seeds the list), then the generic SM boxes.
  valueBoxes: [bloodAngelsCP, gettingStartedBox, darkAngelsCP, heroesOfTheChapter],
  competitiveLists: {},
}
