import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// AELDARI (Xenos)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com
// (flagged `verified: false` → "≈ price" tag). Combat Patrol contents approx.
// ---------------------------------------------------------------------------

export const aeldari: Faction = {
  id: 'aeldari',
  name: 'Aeldari',
  system: 'w40k',
  category: 'xenos',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  blurb:
    'The dying elder race. Lightning-fast Aspect Warriors, psychic seers and graceful grav-tanks — fragile but peerless.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'avatar-of-khaine',
      name: 'Avatar of Khaine',
      role: 'epic-hero',
      epicHero: true,
      points: 250,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Epic Hero'],
      kit: { name: 'Avatar of Khaine', priceEUR: 55, models: 1 },
    },
    {
      id: 'autarch',
      name: 'Autarch',
      role: 'character',
      points: 70,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['dire-avengers', 'fire-dragons', 'guardian-defenders', 'howling-banshees', 'striking-scorpions'],
      kit: { name: 'Autarch', priceEUR: 25, models: 1 },
    },
    {
      id: 'farseer',
      name: 'Farseer',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Psyker', 'Leader'],
      leads: ['guardian-defenders'],
      kit: { name: 'Farseer', priceEUR: 25, models: 1 },
    },
    {
      id: 'spiritseer',
      name: 'Spiritseer',
      role: 'character',
      points: 50,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Psyker', 'Leader'],
      leads: ['wraithguard'],
      kit: { name: 'Spiritseer', priceEUR: 22, models: 1 },
    },
    // --- Battleline ---
    {
      id: 'guardian-defenders',
      name: 'Guardian Defenders',
      role: 'battleline',
      // MFM: 11 models (10 Guardians + weapon platform) 90 pts.
      points: 90,
      models: 11,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Guardian Defenders', priceEUR: 42, models: 11 },
    },
    {
      id: 'rangers',
      name: 'Rangers',
      role: 'battleline',
      points: 60,
      models: 5,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Rangers', priceEUR: 27, models: 5 },
    },
    // --- Aspect Warriors / infantry ---
    {
      id: 'dire-avengers',
      name: 'Dire Avengers',
      role: 'infantry',
      points: 70,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Dire Avengers', priceEUR: 35, models: 5 },
    },
    {
      id: 'howling-banshees',
      name: 'Howling Banshees',
      role: 'infantry',
      points: 85,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Howling Banshees', priceEUR: 35, models: 5 },
    },
    {
      id: 'striking-scorpions',
      name: 'Striking Scorpions',
      role: 'infantry',
      points: 75,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Striking Scorpions', priceEUR: 35, models: 5 },
    },
    {
      id: 'fire-dragons',
      name: 'Fire Dragons',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 110 / 3rd + 120".
      points: 110,
      pointsEscalated: 120,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Fire Dragons', priceEUR: 35, models: 5 },
    },
    {
      id: 'warp-spiders',
      name: 'Warp Spiders',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 105 / 3rd + 125".
      points: 105,
      pointsEscalated: 125,
      models: 5,
      flavor: 3,
      keywords: ['Infantry', 'Fly'],
      kit: { name: 'Warp Spiders', priceEUR: 35, models: 5 },
    },
    {
      id: 'wraithguard',
      name: 'Wraithguard',
      role: 'infantry',
      points: 145,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Wraithguard', priceEUR: 60, models: 5 },
    },
    // --- Mounted ---
    {
      id: 'shining-spears',
      name: 'Shining Spears',
      role: 'mounted',
      points: 100,
      models: 3,
      flavor: 4,
      keywords: ['Mounted', 'Fly'],
      kit: { name: 'Shining Spears', priceEUR: 45, models: 3 },
    },
    // --- Vehicles / monsters ---
    {
      id: 'war-walkers',
      name: 'War Walkers',
      role: 'vehicle',
      points: 80,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Walkers', priceEUR: 40, models: 1 },
    },
    {
      id: 'fire-prism',
      name: 'Fire Prism',
      role: 'vehicle',
      points: 150,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      kit: { name: 'Fire Prism', priceEUR: 55, models: 1 },
    },
    {
      id: 'wraithknight',
      name: 'Wraithknight',
      role: 'monster',
      // MFM: "1st unit 385 / 2nd + 405".
      points: 385,
      pointsEscalated: 405,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Monster', 'Towering'],
      wargear: { name: 'Heavy Wraithcannon', points: 10 },
      kit: { name: 'Wraithknight', priceEUR: 100, models: 1 },
    },
    // --- Dedicated Transport ---
    {
      id: 'wave-serpent',
      name: 'Wave Serpent',
      role: 'transport',
      // MFM: "1st to 3rd 115 / 4th + 125" — escalates on the 4th copy.
      points: 115,
      pointsEscalated: 125,
      escalateAt: 4,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Transport'],
      // Carries 12 Aeldari infantry.
      transports: ['guardian-defenders', 'rangers', 'dire-avengers', 'howling-banshees', 'striking-scorpions', 'fire-dragons'],
      kit: { name: 'Wave Serpent', priceEUR: 50, models: 1 },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-aeldari',
      name: 'Combat Patrol: Aeldari',
      priceEUR: 120,
      // Contents approximate — not yet confirmed on the product page.
      builds: [
        { unitId: 'autarch', models: 1 },
        { unitId: 'guardian-defenders', models: 11 },
        { unitId: 'rangers', models: 5 },
        { unitId: 'war-walkers', models: 1 },
      ],
    },
  ],
  competitiveLists: {},
}
