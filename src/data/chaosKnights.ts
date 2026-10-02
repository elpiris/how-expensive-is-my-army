import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// CHAOS KNIGHTS (Chaos)
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02.
// Prices are BEST-EFFORT estimates (euros) not yet confirmed on warhammer.com
// (flagged `verified: false` → "≈ price" tag).
//
// A superheavy-only army: every datasheet is a towering war engine, so the
// per-bracket size cap is disabled (`ignoreSizeCap`) — otherwise nothing would
// be fieldable below 2000 pts. There is no Combat Patrol for Chaos Knights.
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
    // --- Towering Knights ---
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
      kit: { name: 'Knight Tyrant', priceEUR: 170, models: 1 },
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
      kit: { name: 'Chaos Knight', priceEUR: 150, models: 1 },
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
      kit: { name: 'Chaos Knight', priceEUR: 150, models: 1 },
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
      kit: { name: 'Chaos Knight', priceEUR: 150, models: 1 },
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
      kit: { name: 'Chaos Knight', priceEUR: 150, models: 1 },
    },
    // --- War Dogs (armigers) ---
    {
      id: 'war-dog-karnivore',
      name: 'War Dog Karnivore',
      role: 'vehicle',
      points: 145,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dog', priceEUR: 60, models: 1 },
    },
    {
      id: 'war-dog-brigand',
      name: 'War Dog Brigand',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dog', priceEUR: 60, models: 1 },
    },
    {
      id: 'war-dog-huntsman',
      name: 'War Dog Huntsman',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dog', priceEUR: 60, models: 1 },
    },
    {
      id: 'war-dog-stalker',
      name: 'War Dog Stalker',
      role: 'vehicle',
      points: 135,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dog', priceEUR: 60, models: 1 },
    },
    {
      id: 'war-dog-executioner',
      name: 'War Dog Executioner',
      role: 'vehicle',
      points: 130,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'War Dog', priceEUR: 60, models: 1 },
    },
  ],
  valueBoxes: [],
  competitiveLists: {},
}
