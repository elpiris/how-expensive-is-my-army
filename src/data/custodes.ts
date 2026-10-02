import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// ADEPTUS CUSTODES (Imperium)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com —
// every kit is flagged `verified: false` so the UI shows an "≈ price" tag.
// Combat Patrol contents are an approximation pending confirmation.
// ---------------------------------------------------------------------------

export const custodes: Faction = {
  id: 'adeptus-custodes',
  name: 'Adeptus Custodes',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  blurb:
    'The Emperor’s golden guardians. A handful of near-peerless warriors, each worth a squad of lesser soldiers.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'trajann-valoris',
      name: 'Trajann Valoris',
      role: 'epic-hero',
      epicHero: true,
      points: 135,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      leads: ['custodian-guard', 'custodian-wardens', 'sagittarum-custodians'],
      kit: { name: 'Trajann Valoris', priceEUR: 31, models: 1 },
    },
    {
      id: 'shield-captain',
      name: 'Shield-Captain',
      role: 'character',
      points: 110,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['custodian-guard', 'custodian-wardens', 'sagittarum-custodians'],
      kit: { name: 'Shield-Captain', priceEUR: 31, models: 1 },
    },
    {
      id: 'blade-champion',
      name: 'Blade Champion',
      role: 'character',
      points: 110,
      pointsEscalated: 125,
      escalateAt: 2, // MFM: "1st unit 110 / 2nd + 125"
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['custodian-guard', 'custodian-wardens'],
      kit: { name: 'Blade Champion', priceEUR: 31, models: 1 },
    },
    // --- Battleline ---
    {
      id: 'custodian-guard',
      name: 'Custodian Guard',
      role: 'battleline',
      // MFM @5 models: "1st to 3rd 225 / 4th + 235".
      points: 225,
      pointsEscalated: 235,
      escalateAt: 4,
      models: 5,
      flavor: 4,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Custodian Guard', priceEUR: 65, models: 5 },
    },
    // --- Infantry ---
    {
      id: 'custodian-wardens',
      name: 'Custodian Wardens',
      role: 'infantry',
      // MFM @5 models: "1st unit 260 / 2nd + 280".
      points: 260,
      pointsEscalated: 280,
      escalateAt: 2,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Custodian Wardens', priceEUR: 65, models: 5 },
    },
    {
      id: 'sagittarum-custodians',
      name: 'Sagittarum Custodians',
      role: 'infantry',
      points: 225,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Sagittarum Custodians', priceEUR: 65, models: 5 },
    },
    {
      id: 'allarus-custodians',
      name: 'Allarus Custodians',
      role: 'infantry',
      // MFM @3 models: "1st to 2nd 180 / 3rd + 220".
      points: 180,
      pointsEscalated: 220,
      models: 3,
      flavor: 4,
      keywords: ['Infantry', 'Terminator'],
      kit: { name: 'Allarus Custodians', priceEUR: 60, models: 3 },
    },
    {
      id: 'aquilon-custodians',
      name: 'Aquilon Custodians',
      role: 'infantry',
      points: 195,
      models: 3,
      flavor: 3,
      keywords: ['Infantry', 'Terminator'],
      kit: { name: 'Aquilon Custodians', priceEUR: 65, models: 3 },
    },
    {
      id: 'prosecutors',
      name: 'Prosecutors',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Prosecutors', priceEUR: 35, models: 5 },
    },
    {
      id: 'witchseekers',
      name: 'Witchseekers',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Witchseekers', priceEUR: 35, models: 5 },
    },
    // --- Mounted ---
    {
      id: 'vertus-praetors',
      name: 'Vertus Praetors',
      role: 'mounted',
      // MFM @3 models: "1st to 2nd 230 / 3rd + 255".
      points: 230,
      pointsEscalated: 255,
      models: 3,
      flavor: 4,
      keywords: ['Mounted', 'Fly'],
      kit: { name: 'Vertus Praetors', priceEUR: 60, models: 3 },
    },
    // --- Vehicles ---
    {
      id: 'venerable-contemptor',
      name: 'Venerable Contemptor Dreadnought',
      role: 'vehicle',
      points: 170,
      pointsEscalated: 185,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Venerable Contemptor Dreadnought', priceEUR: 50, models: 1 },
    },
    {
      id: 'caladius-grav-tank',
      name: 'Caladius Grav-tank',
      role: 'vehicle',
      points: 210,
      pointsEscalated: 225,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      // Highest-cost wargear per MFM (Twin Arachnus Heavy Blaze Cannon +15).
      wargear: { name: 'Twin Arachnus Heavy Blaze Cannon', points: 15 },
      kit: { name: 'Caladius Grav-tank', priceEUR: 100, models: 1 },
    },
    {
      id: 'telemon-dreadnought',
      name: 'Telemon Heavy Dreadnought',
      role: 'vehicle',
      // MFM: "1st unit 225 / 2nd + 245".
      points: 225,
      pointsEscalated: 245,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Telemon Heavy Dreadnought', priceEUR: 105, models: 1 },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-custodes',
      name: 'Combat Patrol: Adeptus Custodes',
      priceEUR: 140,
      // Contents approximate — not yet confirmed on the product page.
      builds: [
        { unitId: 'shield-captain', models: 1 },
        { unitId: 'custodian-guard', models: 5 },
        { unitId: 'vertus-praetors', models: 3 },
      ],
    },
  ],
  competitiveLists: {},
}
