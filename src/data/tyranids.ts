import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// TYRANIDS
// Prices VERIFIED from warhammer.com EU store (2026-09-10).
// Points VERIFIED from Wahapedia (11th edition) 2026-09-10 — base "1st unit"
// cost at the default model count. The 3rd+ copy of a unit costs more
// (escalating-cost rule, not modelled here).
//
// Combat Patrol is "Combat Patrol: Tyranid Assault Brood" (€135). Its confirmed
// contents (Parasite of Mortrex, 3 Tyrant Guard / Hive Guard, Biovore, Spore
// Mines, 10 Genestealers) only partly overlap the units modelled here, so the
// value box below lists just the parts this tool can use (Hive Guard,
// Genestealers). Box model-counts use standard kit sizes and haven't all been
// individually confirmed.
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
      kit: { name: 'Winged Hive Tyrant', priceEUR: 51.5, models: 1, verified: true },
    },
    {
      id: 'neurotyrant',
      name: 'Neurotyrant',
      role: 'character',
      points: 130,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Monster', 'Synapse'],
      // Not sold as a standalone kit in the current range.
      kit: { name: 'Neurotyrant', priceEUR: 40, models: 1 },
    },
    {
      id: 'broodlord',
      name: 'Broodlord',
      role: 'character',
      points: 80,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Synapse', 'Leader'],
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
    // --- Battleline ---
    {
      id: 'termagants',
      name: 'Termagants',
      role: 'battleline',
      points: 60,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Termagants', priceEUR: 37, models: 10, verified: true },
    },
    {
      id: 'hormagaunts',
      name: 'Hormagaunts',
      role: 'battleline',
      points: 70,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Hormagaunts', priceEUR: 42, models: 10, verified: true },
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
      points: 75,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Genestealers', priceEUR: 45, models: 5, verified: true },
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
      points: 40,
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
      models: 3,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Hive Guard', priceEUR: 67, models: 3, verified: true },
    },
    // --- Monsters ---
    {
      id: 'carnifex',
      name: 'Carnifex',
      role: 'monster',
      points: 90,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      // Sold as "Carnifex Brood" (€84, online only) — models-per-box unconfirmed.
      kit: { name: 'Carnifex Brood', priceEUR: 84, models: 1, onlineOnly: true },
    },
    {
      id: 'screamer-killer',
      name: 'Screamer-Killer',
      role: 'monster',
      points: 125,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Screamer-Killer Brood', priceEUR: 84, models: 1, onlineOnly: true },
    },
    {
      id: 'exocrine',
      name: 'Exocrine',
      role: 'monster',
      points: 135,
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
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Tyrannofex', priceEUR: 55, models: 1, verified: true },
    },
    {
      id: 'trygon',
      name: 'Trygon',
      role: 'monster',
      points: 140,
      models: 1,
      flavor: 4,
      keywords: ['Monster'],
      kit: { name: 'Trygon', priceEUR: 76, models: 1, verified: true, onlineOnly: true },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-tyranids',
      name: 'Combat Patrol: Tyranid Assault Brood',
      priceEUR: 135,
      verified: true,
      url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-tyranid-assault-brood-2025',
      // Full box also contains Parasite of Mortrex, a Biovore and Spore Mines
      // (not modelled here). Listed builds are the overlapping units this tool
      // can cost — confirmed on the product page 2026-09-10.
      builds: [
        { unitId: 'hive-guard', models: 3 },
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
