import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// IMPERIAL KNIGHTS (Imperium) — added 2026-10-03
// Points: the Munitorum Field Manual (11th ed) 2026-10-03, escalation tiers
//   included. The MFM lists 22 datasheets; like Chaos Knights, the 8 Forge World
//   resin Knights (Acastus Asterius / Porphyrion, Cerastus Acheron / Atrapos /
//   Castigator / Lancer, Questoris Magaera / Styrix) are deliberately omitted —
//   expensive Made-to-Order kits that would otherwise dominate the generator.
//   Kept: the 14 plastic datasheets.
// Prices: warhammer.com en-EU category grid 2026-10-03 (verified). Shared kits
//   (pooled when costing): Knight Questoris (€155) builds Paladin / Errant /
//   Gallant / Crusader / Warden / Defender; Knight Dominus (€156) builds Castellan / Valiant;
//   Knight Preceptor / Canis Rex (€155); Armigers (€83, box of 2) build
//   Warglaives or Helverins.
//
// A superheavy army: every datasheet is a Knight, so the per-bracket size cap is
// disabled (`ignoreSizeCap`). No Combat Patrol is sold for Imperial Knights, and
// no composition profile is needed (it's all walkers).
// ---------------------------------------------------------------------------

const QUESTORIS = { name: 'Knight Questoris', priceEUR: 155, models: 1, verified: true }
const DOMINUS = { name: 'Knight Dominus', priceEUR: 156, models: 1, verified: true }
const PRECEPTOR = { name: 'Knight Preceptor / Canis Rex', priceEUR: 155, models: 1, verified: true }
const ARMIGERS = { name: 'Armigers', priceEUR: 83, models: 2, verified: true }

export const imperialKnights: Faction = {
  id: 'imperial-knights',
  name: 'Imperial Knights',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  ignoreSizeCap: true,
  blurb:
    'Noble houses of towering war engines. A handful of Questoris and Dominus Knights, escorted by Armigers, walks the battlefield like ancient lords.',
  units: [
    // --- Epic Hero ---
    {
      id: 'canis-rex',
      name: 'Canis Rex',
      role: 'epic-hero',
      epicHero: true,
      points: 415,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Walker', 'Titanic', 'Character', 'Epic Hero'],
      kit: PRECEPTOR,
    },
    // --- Dominus-class ---
    {
      id: 'knight-castellan',
      name: 'Knight Castellan',
      role: 'vehicle',
      points: 425,
      pointsEscalated: 450,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: DOMINUS,
    },
    {
      id: 'knight-valiant',
      name: 'Knight Valiant',
      role: 'vehicle',
      points: 390,
      pointsEscalated: 405,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: DOMINUS,
    },
    // --- Questoris-class ---
    {
      id: 'knight-paladin',
      name: 'Knight Paladin',
      role: 'vehicle',
      points: 375,
      pointsEscalated: 390,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-errant',
      name: 'Knight Errant',
      role: 'vehicle',
      points: 355,
      pointsEscalated: 370,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-gallant',
      name: 'Knight Gallant',
      role: 'vehicle',
      points: 355,
      pointsEscalated: 370,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-crusader',
      name: 'Knight Crusader',
      role: 'vehicle',
      // MFM 395 / 2nd+ 415 (+15 optional rapid-fire battle cannon, not modelled).
      points: 395,
      pointsEscalated: 415,
      escalateAt: 2,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-warden',
      name: 'Knight Warden',
      role: 'vehicle',
      points: 365,
      pointsEscalated: 380,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-preceptor',
      name: 'Knight Preceptor',
      role: 'vehicle',
      points: 365,
      pointsEscalated: 380,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: PRECEPTOR,
    },
    {
      id: 'knight-defender',
      name: 'Knight Defender',
      role: 'vehicle',
      points: 385,
      pointsEscalated: 405,
      escalateAt: 2,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker', 'Titanic'],
      kit: QUESTORIS,
    },
    {
      id: 'knight-destrier',
      name: 'Knight Destrier',
      role: 'vehicle',
      points: 265,
      pointsEscalated: 280,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Knight Destrier', priceEUR: 145, models: 1, verified: true },
    },
    // --- Armigers ---
    {
      id: 'armiger-warglaive',
      name: 'Armiger Warglaive',
      role: 'vehicle',
      points: 140,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: ARMIGERS,
    },
    {
      id: 'armiger-helverin',
      name: 'Armiger Helverin',
      role: 'vehicle',
      points: 140,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: ARMIGERS,
    },
    {
      id: 'armiger-moirax',
      name: 'Armiger Moirax',
      role: 'vehicle',
      points: 150,
      pointsEscalated: 160,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Mechanicum Knight Moirax', priceEUR: 62, models: 1, verified: true, onlineOnly: true },
    },
  ],
  valueBoxes: [],
  competitiveLists: {},
}
