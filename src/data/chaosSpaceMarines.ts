import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// CHAOS SPACE MARINES (Chaos)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com
// (flagged `verified: false` → "≈ price" tag). Combat Patrol contents approx.
// ---------------------------------------------------------------------------

export const chaosSpaceMarines: Faction = {
  id: 'chaos-space-marines',
  name: 'Chaos Space Marines',
  system: 'w40k',
  category: 'chaos',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  blurb:
    'The Heretic Astartes. Traitor legions of twisted Space Marines, cultist hordes and roaring daemon engines.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'abaddon',
      name: 'Abaddon the Despoiler',
      role: 'epic-hero',
      epicHero: true,
      points: 300,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Terminator', 'Epic Hero'],
      leads: ['chaos-terminators', 'chosen'],
      kit: { name: 'Abaddon the Despoiler', priceEUR: 50, models: 1 },
    },
    {
      id: 'chaos-lord',
      name: 'Chaos Lord',
      role: 'character',
      points: 95,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['chosen', 'legionaries'],
      kit: { name: 'Chaos Lord', priceEUR: 27, models: 1 },
    },
    {
      id: 'sorcerer',
      name: 'Sorcerer',
      role: 'character',
      points: 65,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Psyker', 'Leader'],
      leads: ['chosen', 'legionaries'],
      kit: { name: 'Sorcerer', priceEUR: 27, models: 1 },
    },
    {
      id: 'dark-apostle',
      name: 'Dark Apostle',
      role: 'character',
      points: 70,
      models: 3,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['legionaries', 'chosen', 'cultist-mob'],
      kit: { name: 'Dark Apostle', priceEUR: 30, models: 3 },
    },
    // --- Battleline ---
    {
      id: 'legionaries',
      name: 'Legionaries',
      role: 'battleline',
      // MFM: 5 models 95, 10 models 180 (fielded as a full 10).
      points: 180,
      models: 10,
      flavor: 4,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Legionaries', priceEUR: 45, models: 10 },
    },
    {
      id: 'cultist-mob',
      name: 'Cultist Mob',
      role: 'battleline',
      points: 50,
      models: 10,
      flavor: 2,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Cultist Mob', priceEUR: 30, models: 10 },
    },
    // --- Infantry ---
    {
      id: 'chosen',
      name: 'Chosen',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 140 / 3rd + 150".
      points: 140,
      pointsEscalated: 150,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Chosen', priceEUR: 50, models: 5 },
    },
    {
      id: 'possessed',
      name: 'Possessed',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 130 / 3rd + 150".
      points: 130,
      pointsEscalated: 150,
      models: 5,
      flavor: 4,
      keywords: ['Infantry', 'Daemon'],
      kit: { name: 'Possessed', priceEUR: 50, models: 5 },
    },
    {
      id: 'chaos-terminators',
      name: 'Chaos Terminators',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 185 / 3rd + 215".
      points: 185,
      pointsEscalated: 215,
      models: 5,
      flavor: 4,
      keywords: ['Infantry', 'Terminator'],
      kit: { name: 'Chaos Terminator Squad', priceEUR: 50, models: 5 },
    },
    {
      id: 'havocs',
      name: 'Havocs',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 135 / 3rd + 145".
      points: 135,
      pointsEscalated: 145,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Havocs', priceEUR: 40, models: 5 },
    },
    {
      id: 'raptors',
      name: 'Raptors',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 115 / 3rd + 125".
      points: 115,
      pointsEscalated: 125,
      models: 5,
      flavor: 3,
      keywords: ['Infantry', 'Fly'],
      kit: { name: 'Raptors', priceEUR: 35, models: 5 },
    },
    // --- Mounted ---
    {
      id: 'chaos-bikers',
      name: 'Chaos Bikers',
      role: 'mounted',
      points: 80,
      models: 3,
      flavor: 3,
      keywords: ['Mounted'],
      kit: { name: 'Chaos Bikers', priceEUR: 45, models: 3 },
    },
    // --- Daemon engines / vehicles ---
    {
      id: 'helbrute',
      name: 'Helbrute',
      role: 'vehicle',
      points: 125,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Helbrute', priceEUR: 35, models: 1 },
    },
    {
      id: 'maulerfiend',
      name: 'Maulerfiend',
      role: 'vehicle',
      points: 125,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Daemon Engine'],
      kit: { name: 'Maulerfiend', priceEUR: 40, models: 1 },
    },
    {
      id: 'forgefiend',
      name: 'Forgefiend',
      role: 'vehicle',
      // MFM: "1st to 2nd 155 / 3rd + 165".
      points: 155,
      pointsEscalated: 165,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Daemon Engine'],
      wargear: { name: 'Ectoplasma Cannon', points: 5 },
      kit: { name: 'Forgefiend', priceEUR: 40, models: 1 },
    },
    {
      id: 'defiler',
      name: 'Defiler',
      role: 'vehicle',
      // MFM: "1st unit 300 / 2nd + 350".
      points: 300,
      pointsEscalated: 350,
      escalateAt: 2,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Daemon Engine'],
      wargear: { name: 'Heavy Reaper Autocannon', points: 15 },
      kit: { name: 'Defiler', priceEUR: 65, models: 1 },
    },
    // --- Dedicated Transport ---
    {
      id: 'chaos-rhino',
      name: 'Chaos Rhino',
      role: 'transport',
      // MFM: "1st to 3rd 65 / 4th + 75" — escalates on the 4th copy.
      points: 65,
      pointsEscalated: 75,
      escalateAt: 4,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      // Carries 10 Heretic Astartes infantry (no Terminators).
      transports: ['legionaries', 'cultist-mob', 'chosen', 'havocs', 'possessed'],
      kit: { name: 'Chaos Rhino', priceEUR: 50, models: 1 },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-chaos-space-marines',
      name: 'Combat Patrol: Chaos Space Marines',
      priceEUR: 130,
      // Contents approximate — not yet confirmed on the product page.
      builds: [
        { unitId: 'chaos-lord', models: 1 },
        { unitId: 'legionaries', models: 10 },
        { unitId: 'possessed', models: 5 },
        { unitId: 'helbrute', models: 1 },
      ],
    },
  ],
  competitiveLists: {},
}
