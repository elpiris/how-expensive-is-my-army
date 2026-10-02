import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// TYRANIDS
// Prices VERIFIED from warhammer.com EU store (2026-09-10).
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02 —
// base "1st unit" cost at the default model count, plus the escalating cost for
// later copies (`pointsEscalated`/`escalateAt`). Both Norns step up on the 2nd
// copy; Genestealers, Hive Guard, Screamer-Killer, Exocrine and Tyrannofex on
// the 3rd.
//
// Combat Patrol is "Combat Patrol: Tyranid Assault Brood" (€139). Its confirmed
// contents — Parasite of Mortrex, 3 Tyrant Guard (built as Hive Guard), a
// Biovore, 3 Spore Mines and 10 Genestealers — are modelled in the value box
// below (Spore Mines omitted; they are summoned tokens, not a purchase).
//
// Neurotyrant + Screamer-Killer both come from the one online "Horrors of the
// Hive" box (€87.50); the standalone "Screamer-Killer Brood" box is 2 old
// Carnifex-chassis models and maps to the Carnifexes datasheet, not here.
// ---------------------------------------------------------------------------

export const tyranids: Faction = {
  id: 'tyranids',
  name: 'Tyranids',
  system: 'w40k',
  lastVerified: '2026-09-10',
  pointsVerified: true,
  blurb:
    'The Great Devourer. Endless broods of gaunts screening towering bio-titans and synapse creatures.',
  units: [
    // --- Synapse characters / Epic Heroes ---
    {
      id: 'hive-tyrant',
      name: 'Hive Tyrant',
      role: 'monster',
      points: 195,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Synapse'],
      exclusiveGroup: 'hive-tyrant',
      kit: { name: 'Hive Tyrant', priceEUR: 51.5, models: 1, verified: true },
    },
    {
      id: 'winged-hive-tyrant',
      name: 'Winged Hive Tyrant',
      role: 'monster',
      points: 185,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Synapse', 'Fly'],
      exclusiveGroup: 'hive-tyrant',
      kit: { name: 'Winged Hive Tyrant', priceEUR: 51.5, models: 1, verified: true },
    },
    {
      id: 'neurotyrant',
      name: 'Neurotyrant',
      role: 'character',
      points: 120,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Monster', 'Synapse'],
      leads: ['zoanthropes'],
      // Comes in the online "Horrors of the Hive" box together with a
      // Screamer-Killer — one box covers both (credited via alsoBuilds).
      kit: {
        name: 'Horrors of the Hive',
        priceEUR: 87.5,
        models: 1,
        verified: true,
        onlineOnly: true,
        alsoBuilds: [{ unitId: 'screamer-killer', models: 1 }],
      },
    },
    {
      id: 'broodlord',
      name: 'Broodlord',
      role: 'character',
      points: 80,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Synapse', 'Leader'],
      leads: ['genestealers'],
      kit: { name: 'Broodlord', priceEUR: 37, models: 1, verified: true },
    },
    {
      id: 'tyranid-prime',
      name: 'Tyranid Prime',
      role: 'character',
      points: 75,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Synapse', 'Leader'],
      leads: ['hormagaunts', 'termagants', 'tyranid-warriors'],
      kit: { name: 'Tyranid Prime with Lash Whip', priceEUR: 34.5, models: 1, verified: true },
    },
    {
      id: 'swarmlord',
      name: 'The Swarmlord',
      role: 'epic-hero',
      epicHero: true,
      points: 210,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Epic Hero', 'Synapse'],
      exclusiveGroup: 'hive-tyrant',
      kit: { name: 'The Swarmlord', priceEUR: 51.5, models: 1, verified: true },
    },
    {
      id: 'deathleaper',
      name: 'Deathleaper',
      role: 'epic-hero',
      epicHero: true,
      points: 80,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Epic Hero', 'Lictor'],
      kit: { name: 'Deathleaper', priceEUR: 51.5, models: 1, verified: true },
    },
    {
      id: 'parasite-of-mortrex',
      name: 'Parasite of Mortrex',
      role: 'character',
      points: 65,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Fly', 'Synapse'],
      kit: { name: 'Parasite of Mortrex', priceEUR: 34.5, models: 1, verified: true },
    },
    // --- Battleline ---
    {
      id: 'termagants',
      name: 'Termagants',
      role: 'battleline',
      points: 55,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      // The Termagants box builds 10 Termagants + 1 bonus Ripper Swarm base
      // (confirmed on the product page 2026-09-30).
      kit: {
        name: 'Termagants',
        priceEUR: 38.5,
        models: 10,
        verified: true,
        alsoBuilds: [{ unitId: 'ripper-swarms', models: 1 }],
      },
    },
    {
      id: 'hormagaunts',
      name: 'Hormagaunts',
      role: 'battleline',
      points: 70,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      // The Hormagaunts box also builds a bonus Ripper Swarm base (verified).
      kit: {
        name: 'Hormagaunts',
        priceEUR: 42,
        models: 10,
        verified: true,
        alsoBuilds: [{ unitId: 'ripper-swarms', models: 1 }],
      },
    },
    // --- Infantry ---
    {
      id: 'tyranid-warriors',
      name: 'Tyranid Warriors',
      role: 'infantry',
      points: 75,
      models: 3,
      flavor: 4,
      keywords: ['Infantry', 'Synapse'],
      kit: { name: 'Tyranid Warriors', priceEUR: 51.5, models: 3, verified: true },
    },
    {
      id: 'genestealers',
      name: 'Genestealers',
      role: 'infantry',
      // Box builds 10 (verified 2026-09-30); fielded as a full 10-model unit.
      points: 140,
      pointsEscalated: 150,
      models: 10,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Genestealers', priceEUR: 45, models: 10, verified: true },
    },
    {
      id: 'zoanthropes',
      name: 'Zoanthropes',
      role: 'infantry',
      points: 90,
      models: 3,
      flavor: 3,
      keywords: ['Infantry', 'Monster', 'Synapse'],
      kit: { name: 'Zoanthropes', priceEUR: 64, models: 3, verified: true },
    },
    {
      id: 'von-ryans-leapers',
      name: "Von Ryan's Leapers",
      role: 'infantry',
      points: 55,
      models: 3,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: "Von Ryan's Leapers", priceEUR: 42, models: 3, verified: true },
    },
    {
      id: 'ripper-swarms',
      name: 'Ripper Swarms',
      role: 'infantry',
      points: 50,
      models: 3,
      flavor: 2,
      keywords: ['Swarm'],
      // Not sold separately in the current range.
      kit: { name: 'Ripper Swarms', priceEUR: 25, models: 3 },
    },
    {
      id: 'hive-guard',
      name: 'Hive Guard',
      role: 'infantry',
      points: 80,
      pointsEscalated: 90,
      models: 3,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Hive Guard', priceEUR: 67, models: 3, verified: true },
    },
    {
      id: 'biovore',
      name: 'Biovore',
      role: 'infantry',
      points: 60,
      models: 1,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Biovore', priceEUR: 42, models: 1, verified: true },
    },
    // --- Monsters ---
    {
      id: 'carnifex',
      name: 'Carnifexes',
      role: 'monster',
      points: 180,
      // The Carnifexes datasheet is a 1-2 model unit; the Carnifex Brood box
      // builds exactly 2 (€87), so a box = one full 2-model unit, no waste.
      models: 2,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Carnifex Brood', priceEUR: 87, models: 2, onlineOnly: true, verified: true },
    },
    {
      id: 'screamer-killer',
      name: 'Screamer-Killer',
      role: 'monster',
      points: 125,
      pointsEscalated: 135,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      // The Screamer-Killer datasheet (Leviathan sculpt) is only sold in the
      // online "Horrors of the Hive" box, together with a Neurotyrant — one box
      // covers both (credited via alsoBuilds). (The "Screamer-Killer Brood" box
      // is a different thing: 2 old Carnifex-chassis models = a Carnifexes unit.)
      kit: {
        name: 'Horrors of the Hive',
        priceEUR: 87.5,
        models: 1,
        verified: true,
        onlineOnly: true,
        alsoBuilds: [{ unitId: 'neurotyrant', models: 1 }],
      },
    },
    {
      id: 'exocrine',
      name: 'Exocrine',
      role: 'monster',
      points: 135,
      pointsEscalated: 145,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Exocrine', priceEUR: 70, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'tyrannofex',
      name: 'Tyrannofex',
      role: 'monster',
      points: 170,
      pointsEscalated: 180,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      // Highest-cost wargear per MFM (Rupture Cannon +20).
      wargear: { name: 'Rupture Cannon', points: 20 },
      kit: { name: 'Tyrannofex', priceEUR: 55, models: 1, verified: true },
    },
    {
      id: 'trygon',
      name: 'Trygon',
      role: 'monster',
      points: 135,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Trygon', priceEUR: 76, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'norn-emissary',
      name: 'Norn Emissary',
      role: 'monster',
      points: 250,
      pointsEscalated: 270,
      escalateAt: 2, // MFM: "1st unit 250 / 2nd + 270"
      models: 1,
      flavor: 5,
      keywords: ['Monster', 'Synapse'],
      kit: { name: 'Norn Emissary', priceEUR: 97, models: 1, verified: true },
    },
    {
      id: 'norn-assimilator',
      name: 'Norn Assimilator',
      role: 'monster',
      points: 250,
      pointsEscalated: 270,
      escalateAt: 2, // MFM: "1st unit 250 / 2nd + 270"
      models: 1,
      flavor: 5,
      keywords: ['Monster', 'Synapse'],
      kit: { name: 'Norn Assimilator', priceEUR: 97, models: 1, verified: true },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-tyranids',
      name: 'Combat Patrol: Tyranid Assault Brood',
      priceEUR: 139,
      verified: true,
      url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-tyranid-assault-brood-2025',
      // Contents confirmed on the product page 2026-09-10. The 3 Tyrant Guard
      // are built as Hive Guard; the box also includes 3 Spore Mines (summoned
      // tokens, not fielded as a purchase) which are omitted.
      builds: [
        { unitId: 'parasite-of-mortrex', models: 1 },
        { unitId: 'hive-guard', models: 3 },
        { unitId: 'biovore', models: 1 },
        { unitId: 'genestealers', models: 10 },
      ],
    },
  ],
  competitiveLists: {
    // ~2000 pts Invasion Fleet style swarm — monsters + gaunts + genestealers.
    // In-collection units, real Wahapedia points. Totals 1990 pts.
    2000: [
      { unitId: 'winged-hive-tyrant', count: 1 },
      { unitId: 'neurotyrant', count: 1 },
      { unitId: 'broodlord', count: 1 },
      { unitId: 'termagants', count: 3 },
      { unitId: 'genestealers', count: 3 },
      { unitId: 'von-ryans-leapers', count: 2 },
      { unitId: 'zoanthropes', count: 1 },
      { unitId: 'ripper-swarms', count: 2 },
      { unitId: 'exocrine', count: 1 },
      { unitId: 'screamer-killer', count: 1 },
      { unitId: 'carnifex', count: 2 },
      { unitId: 'hive-guard', count: 2 },
      { unitId: 'tyrannofex', count: 1 },
      { unitId: 'trygon', count: 1 },
    ],
  },
}
