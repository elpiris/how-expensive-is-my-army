import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// CHAOS KNIGHTS (Chaos)  — fine-tuned 2026-10-02
// Points: from the Munitorum Field Manual (11th ed) 2026-10-02 (escalation +
//   highest-cost wargear). The MFM lists 20 datasheets; 8 of them are the Forge
//   World super-heavy Titans (Chaos Acastus / Cerastus / Questoris, €175–593
//   resin, webstore Made-to-Order). Those have decent points-per-euro and so would
//   dominate the generator, which fights this app's "affordable above all" ethos
//   — an affordable, typical Chaos Knights army is the PLASTIC range + War Dogs —
//   so they're deliberately omitted here (their points/prices are captured in git
//   history if they're ever wanted). Kept: the 6 plastic Questoris-class Knights,
//   the 5 plastic War Dogs, and the cheap War Dog Moirax.
// Prices: warhammer.com en-EU (2026-10-02), verified. The plastic "Chaos Knight"
//   kit (€155) builds Abominant / Desecrator / Despoiler / Rampager / Ruinator;
//   the Knight Tyrant (€156) and War Dogs (€83, box builds 2) are their own kits.
//
// A superheavy-only army: every datasheet is a towering war engine, so the
// per-bracket size cap is disabled (`ignoreSizeCap`). There is no Combat Patrol
// for Chaos Knights, and no composition profile is needed (it's all walkers).
// ---------------------------------------------------------------------------

export const chaosKnights: Faction = {
  id: 'chaos-knights',
  name: 'Chaos Knights',
  system: 'w40k',
  category: 'chaos',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  ignoreSizeCap: true,
  blurb:
    'Fallen noble houses bound to the Dark Gods. A handful of towering, murderous war engines and their lesser War Dogs.',
  units: [
    // --- Plastic Questoris-class Knights (one €155 kit builds all five) ---
    {
      id: 'knight-tyrant',
      name: 'Knight Tyrant',
      role: 'vehicle',
      // MFM: "1st unit 390 / 2nd + 410".
      points: 390,
      pointsEscalated: 410,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      kit: { name: 'Knight Tyrant', priceEUR: 156, models: 1, verified: true },
    },
    {
      id: 'knight-despoiler',
      name: 'Knight Despoiler',
      role: 'vehicle',
      // MFM: "1st unit 360 / 2nd + 390".
      points: 360,
      pointsEscalated: 390,
      escalateAt: 2,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      wargear: { name: 'Despoiler Gatling Cannon', points: 25 },
      kit: { name: 'Chaos Knight', priceEUR: 155, models: 1, verified: true },
    },
    {
      id: 'knight-abominant',
      name: 'Knight Abominant',
      role: 'vehicle',
      // MFM: "1st to 2nd 350 / 3rd + 370".
      points: 350,
      pointsEscalated: 370,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      kit: { name: 'Chaos Knight', priceEUR: 155, models: 1, verified: true },
    },
    {
      id: 'knight-desecrator',
      name: 'Knight Desecrator',
      role: 'vehicle',
      // MFM: "1st to 2nd 350 / 3rd + 370".
      points: 350,
      pointsEscalated: 370,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      kit: { name: 'Chaos Knight', priceEUR: 155, models: 1, verified: true },
    },
    {
      id: 'knight-rampager',
      name: 'Knight Rampager',
      role: 'vehicle',
      // MFM: "1st to 2nd 350 / 3rd + 370".
      points: 350,
      pointsEscalated: 370,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      kit: { name: 'Chaos Knight', priceEUR: 155, models: 1, verified: true },
    },
    {
      id: 'knight-ruinator',
      name: 'Knight Ruinator',
      role: 'vehicle',
      // MFM: "1st to 2nd 325 / 3rd + 345".
      points: 325,
      pointsEscalated: 345,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Towering'],
      kit: { name: 'Chaos Knight', priceEUR: 155, models: 1, verified: true },
    },
    // --- War Dogs (armigers; one €83 box builds 2) ---
    {
      id: 'war-dog-karnivore',
      name: 'War Dog Karnivore',
      role: 'vehicle',
      points: 145,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dogs', priceEUR: 83, models: 2, verified: true },
    },
    {
      id: 'war-dog-brigand',
      name: 'War Dog Brigand',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dogs', priceEUR: 83, models: 2, verified: true },
    },
    {
      id: 'war-dog-huntsman',
      name: 'War Dog Huntsman',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dogs', priceEUR: 83, models: 2, verified: true },
    },
    {
      id: 'war-dog-stalker',
      name: 'War Dog Stalker',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dogs', priceEUR: 83, models: 2, verified: true },
    },
    {
      id: 'war-dog-executioner',
      name: 'War Dog Executioner',
      role: 'vehicle',
      points: 130,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dogs', priceEUR: 83, models: 2, verified: true },
    },
    {
      id: 'war-dog-moirax',
      name: 'War Dog Moirax',
      role: 'vehicle',
      // MFM: "1st to 2nd 150 / 3rd + 160". Forge World (resin, webstore-only).
      points: 150,
      pointsEscalated: 160,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Mechanicum Knight Moirax', priceEUR: 62, models: 1, verified: true, onlineOnly: true },
    },
  ],
  valueBoxes: [],
  competitiveLists: {},
}
