import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// ADEPTA SORORITAS (Imperium)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com
// (flagged `verified: false` → "≈ price" tag). Combat Patrol contents approx.
// ---------------------------------------------------------------------------

export const sororitas: Faction = {
  id: 'adepta-sororitas',
  name: 'Adepta Sororitas',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  blurb:
    'The Emperor’s zealous Sisters of Battle. Faith, flamer and bolter — resilient squads backed by holy war machines.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'morvenn-vahl',
      name: 'Morvenn Vahl',
      role: 'epic-hero',
      epicHero: true,
      points: 215,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      leads: ['paragon-warsuits'],
      kit: { name: 'Morvenn Vahl', priceEUR: 55, models: 1 },
    },
    {
      id: 'saint-celestine',
      name: 'Saint Celestine',
      role: 'epic-hero',
      epicHero: true,
      points: 135,
      models: 3,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Epic Hero', 'Fly'],
      leads: ['seraphim-squad'],
      kit: { name: 'Saint Celestine', priceEUR: 35, models: 3 },
    },
    {
      id: 'canoness',
      name: 'Canoness',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['battle-sisters', 'dominion-squad', 'retributor-squad', 'sacresants'],
      kit: { name: 'Canoness', priceEUR: 27, models: 1 },
    },
    {
      id: 'palatine',
      name: 'Palatine',
      role: 'character',
      points: 50,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['battle-sisters', 'dominion-squad', 'retributor-squad', 'sacresants'],
      kit: { name: 'Palatine', priceEUR: 25, models: 1 },
    },
    {
      id: 'ministorum-priest',
      name: 'Ministorum Priest',
      role: 'character',
      points: 50,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['arco-flagellants', 'battle-sisters', 'dominion-squad', 'repentia-squad'],
      kit: { name: 'Ministorum Priest', priceEUR: 22, models: 1 },
    },
    // --- Battleline ---
    {
      id: 'battle-sisters',
      name: 'Battle Sisters Squad',
      role: 'battleline',
      points: 100,
      models: 10,
      flavor: 4,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Battle Sisters Squad', priceEUR: 40, models: 10 },
    },
    // --- Infantry ---
    {
      id: 'dominion-squad',
      name: 'Dominion Squad',
      role: 'infantry',
      // MFM: "1st to 2nd 90 / 3rd + 100".
      points: 90,
      pointsEscalated: 100,
      models: 10,
      flavor: 3,
      keywords: ['Infantry'],
      wargear: { name: 'Meltagun', points: 5 },
      kit: { name: 'Dominion Squad', priceEUR: 40, models: 10 },
    },
    {
      id: 'seraphim-squad',
      name: 'Seraphim Squad',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 75 / 3rd + 85".
      points: 75,
      pointsEscalated: 85,
      models: 5,
      flavor: 4,
      keywords: ['Infantry', 'Fly'],
      kit: { name: 'Seraphim Squad', priceEUR: 35, models: 5 },
    },
    {
      id: 'sacresants',
      name: 'Celestian Sacresants',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 75 / 3rd + 85".
      points: 75,
      pointsEscalated: 85,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Celestian Sacresants', priceEUR: 40, models: 5 },
    },
    {
      id: 'repentia-squad',
      name: 'Repentia Squad',
      role: 'infantry',
      points: 70,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Repentia Squad', priceEUR: 35, models: 5 },
    },
    {
      id: 'arco-flagellants',
      name: 'Arco-flagellants',
      role: 'infantry',
      points: 50,
      models: 3,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Arco-flagellants', priceEUR: 30, models: 3 },
    },
    {
      id: 'retributor-squad',
      name: 'Retributor Squad',
      role: 'infantry',
      // MFM @5 models: "1st to 2nd 105 / 3rd + 115".
      points: 105,
      pointsEscalated: 115,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      wargear: { name: 'Multi-melta', points: 5 },
      kit: { name: 'Retributor Squad', priceEUR: 40, models: 5 },
    },
    // --- Mounted / walkers ---
    {
      id: 'paragon-warsuits',
      name: 'Paragon Warsuits',
      role: 'mounted',
      // MFM @3 models: "1st to 2nd 165 / 3rd + 175".
      points: 165,
      pointsEscalated: 175,
      models: 3,
      flavor: 4,
      keywords: ['Mounted', 'Vehicle'],
      wargear: { name: 'Multi-melta', points: 10 },
      kit: { name: 'Paragon Warsuits', priceEUR: 60, models: 3 },
    },
    {
      id: 'penitent-engines',
      name: 'Penitent Engines',
      role: 'vehicle',
      // MFM: 1 model 70, 2 models 140 (box builds 2).
      points: 140,
      models: 2,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Penitent Engines', priceEUR: 45, models: 2 },
    },
    {
      id: 'exorcist',
      name: 'Exorcist',
      role: 'vehicle',
      // MFM: "1st to 2nd 180 / 3rd + 220".
      points: 180,
      pointsEscalated: 220,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      kit: { name: 'Exorcist', priceEUR: 60, models: 1 },
    },
    // --- Dedicated Transports ---
    {
      id: 'immolator',
      name: 'Immolator',
      role: 'transport',
      // MFM: "1st to 3rd 100 / 4th + 115".
      points: 100,
      pointsEscalated: 115,
      escalateAt: 4,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Transport'],
      wargear: { name: 'Twin Multi-melta', points: 15 },
      // Carries 6 Adepta Sororitas infantry.
      transports: ['battle-sisters', 'dominion-squad', 'retributor-squad', 'sacresants', 'repentia-squad', 'arco-flagellants'],
      kit: { name: 'Immolator', priceEUR: 55, models: 1 },
    },
    {
      id: 'sororitas-rhino',
      name: 'Sororitas Rhino',
      role: 'transport',
      // MFM: "1st to 3rd 65 / 4th + 75" — escalates on the 4th copy.
      points: 65,
      pointsEscalated: 75,
      escalateAt: 4,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      // Carries 12 Adepta Sororitas infantry.
      transports: ['battle-sisters', 'dominion-squad', 'retributor-squad', 'sacresants', 'repentia-squad', 'arco-flagellants'],
      kit: { name: 'Sororitas Rhino', priceEUR: 50, models: 1 },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-sororitas',
      name: 'Combat Patrol: Adepta Sororitas',
      priceEUR: 135,
      // Contents approximate — not yet confirmed on the product page.
      builds: [
        { unitId: 'canoness', models: 1 },
        { unitId: 'battle-sisters', models: 10 },
        { unitId: 'seraphim-squad', models: 5 },
        { unitId: 'arco-flagellants', models: 3 },
      ],
    },
  ],
  competitiveLists: {},
}
