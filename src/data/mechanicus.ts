import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// ADEPTUS MECHANICUS (Imperium)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com
// (flagged `verified: false` → "≈ price" tag). Combat Patrol contents approx.
// ---------------------------------------------------------------------------

export const mechanicus: Faction = {
  id: 'adeptus-mechanicus',
  name: 'Adeptus Mechanicus',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  blurb:
    'The Machine God’s cult. Cybernetic Skitarii legions, lumbering war engines and the relentless logic of the Omnissiah.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'belisarius-cawl',
      name: 'Belisarius Cawl',
      role: 'epic-hero',
      epicHero: true,
      points: 220,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      kit: { name: 'Belisarius Cawl', priceEUR: 45, models: 1 },
    },
    {
      id: 'tech-priest-dominus',
      name: 'Tech-Priest Dominus',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['fulgurite-electro-priests', 'kataphron-breachers', 'kataphron-destroyers'],
      kit: { name: 'Tech-Priest Dominus', priceEUR: 30, models: 1 },
    },
    {
      id: 'tech-priest-enginseer',
      name: 'Tech-Priest Enginseer',
      role: 'character',
      points: 55,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['kataphron-breachers', 'kataphron-destroyers'],
      kit: { name: 'Tech-Priest Enginseer', priceEUR: 22, models: 1 },
    },
    // --- Battleline ---
    {
      id: 'skitarii-rangers',
      name: 'Skitarii Rangers',
      role: 'battleline',
      points: 85,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Skitarii Rangers', priceEUR: 35, models: 10 },
    },
    {
      id: 'skitarii-vanguard',
      name: 'Skitarii Vanguard',
      role: 'battleline',
      points: 85,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Skitarii Vanguard', priceEUR: 35, models: 10 },
    },
    // --- Infantry ---
    {
      id: 'kataphron-destroyers',
      name: 'Kataphron Destroyers',
      role: 'infantry',
      points: 100,
      models: 3,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Kataphron Destroyers', priceEUR: 60, models: 3 },
    },
    {
      id: 'kataphron-breachers',
      name: 'Kataphron Breachers',
      role: 'infantry',
      points: 140,
      models: 3,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Kataphron Breachers', priceEUR: 60, models: 3 },
    },
    {
      id: 'sicarian-infiltrators',
      name: 'Sicarian Infiltrators',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 75 / 3rd + 85".
      points: 75,
      pointsEscalated: 85,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Sicarian Infiltrators', priceEUR: 40, models: 5 },
    },
    {
      id: 'pteraxii-skystalkers',
      name: 'Pteraxii Skystalkers',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 75 / 3rd + 85".
      points: 75,
      pointsEscalated: 85,
      models: 5,
      flavor: 3,
      keywords: ['Infantry', 'Fly'],
      kit: { name: 'Pteraxii Skystalkers', priceEUR: 40, models: 5 },
    },
    {
      id: 'fulgurite-electro-priests',
      name: 'Fulgurite Electro-Priests',
      role: 'infantry',
      // MFM: 5 models 65, 10 models 130 (fielded as a full 10).
      points: 130,
      models: 10,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Fulgurite Electro-Priests', priceEUR: 45, models: 10 },
    },
    // --- Mounted / walkers ---
    {
      id: 'serberys-raiders',
      name: 'Serberys Raiders',
      role: 'mounted',
      points: 60,
      models: 3,
      flavor: 3,
      keywords: ['Mounted'],
      kit: { name: 'Serberys Raiders', priceEUR: 45, models: 3 },
    },
    {
      id: 'ironstrider-ballistarii',
      name: 'Ironstrider Ballistarii',
      role: 'mounted',
      // MFM: "1st to 2nd 80 / 3rd + 95" (per model).
      points: 80,
      pointsEscalated: 95,
      models: 1,
      flavor: 3,
      keywords: ['Mounted', 'Walker'],
      kit: { name: 'Ironstrider Ballistarii', priceEUR: 35, models: 1 },
    },
    // --- Vehicles ---
    {
      id: 'onager-dunecrawler',
      name: 'Onager Dunecrawler',
      role: 'vehicle',
      points: 150,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Onager Dunecrawler', priceEUR: 55, models: 1 },
    },
    {
      id: 'kastelan-robots',
      name: 'Kastelan Robots',
      role: 'vehicle',
      // MFM @2 models: "1st to 2nd 150 / 3rd + 180".
      points: 150,
      pointsEscalated: 180,
      models: 2,
      flavor: 4,
      keywords: ['Vehicle'],
      kit: { name: 'Kastelan Robots', priceEUR: 60, models: 2 },
    },
    {
      id: 'skorpius-disintegrator',
      name: 'Skorpius Disintegrator',
      role: 'vehicle',
      points: 160,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      wargear: { name: 'Ferrumite Cannon', points: 10 },
      kit: { name: 'Skorpius Disintegrator', priceEUR: 60, models: 1 },
    },
    // --- Dedicated Transport ---
    {
      id: 'skorpius-dunerider',
      name: 'Skorpius Dunerider',
      role: 'transport',
      // MFM: "1st to 3rd 75 / 4th + 85" — escalates on the 4th copy.
      points: 75,
      pointsEscalated: 85,
      escalateAt: 4,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      // Carries Adeptus Mechanicus infantry.
      transports: ['skitarii-rangers', 'skitarii-vanguard', 'sicarian-infiltrators', 'pteraxii-skystalkers', 'fulgurite-electro-priests'],
      kit: { name: 'Skorpius Dunerider', priceEUR: 60, models: 1 },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-mechanicus',
      name: 'Combat Patrol: Adeptus Mechanicus',
      priceEUR: 130,
      // Contents approximate — not yet confirmed on the product page.
      builds: [
        { unitId: 'tech-priest-dominus', models: 1 },
        { unitId: 'skitarii-rangers', models: 10 },
        { unitId: 'serberys-raiders', models: 3 },
        { unitId: 'onager-dunecrawler', models: 1 },
      ],
    },
  ],
  competitiveLists: {},
}
