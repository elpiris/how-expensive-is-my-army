import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// NECRONS
// Prices VERIFIED from warhammer.com EU store (2026-09-10).
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02 —
// base "1st unit" cost at the default model count shown, plus the escalating
// surcharge for later copies (see `pointsEscalated`/`escalateAt`). Canoptek
// Wraiths step up on the 2nd copy; the rest on the 3rd.
//
// Combat Patrol contents + €135 price confirmed on the product page.
// Canoptek Scarabs are not sold separately (only in the Combat Patrol) so their
// price is unverified (≈). Technomancer was removed: it is not sold individually
// and the Royal Court box builds a Skorpekh Lord / Plasmancer / Cryptothralls /
// Reanimator, none of which is a Technomancer.
// ---------------------------------------------------------------------------

export const necrons: Faction = {
  id: 'necrons',
  name: 'Necrons',
  system: 'w40k',
  category: 'xenos',
  lastVerified: '2026-09-10',
  pointsVerified: true,
  // Reanimating infantry legions + vehicles, with towering C'tan apex monsters.
  profile: { character: 1.5, infantry: 4.5, mounted: 1, vehicle: 2.5, monster: 1 },
  blurb:
    'Ancient robotic legions of the Aeons. Durable infantry, reanimating warriors and towering C’tan shards.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'overlord',
      name: 'Overlord',
      role: 'character',
      points: 90,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['immortals', 'lychguard', 'necron-warriors'],
      kit: {
        name: 'Overlord with Tachyon Arrow',
        priceEUR: 34,
        models: 1,
        verified: true,
        onlineOnly: true,
      },
    },
    {
      id: 'royal-warden',
      name: 'Royal Warden',
      role: 'character',
      points: 50,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['immortals', 'necron-warriors'],
      kit: { name: 'Royal Warden', priceEUR: 32.5, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'psychomancer',
      name: 'Psychomancer',
      role: 'character',
      points: 55,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['immortals', 'necron-warriors'],
      kit: { name: 'Psychomancer', priceEUR: 32.5, models: 1, verified: true },
    },
    {
      id: 'szeras',
      name: 'Illuminor Szeras',
      role: 'epic-hero',
      epicHero: true,
      points: 175,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Monster', 'Epic Hero', 'Leader'],
      kit: { name: 'Illuminor Szeras', priceEUR: 50, models: 1, verified: true },
    },
    {
      id: 'ctan-nightbringer',
      name: 'C’tan Shard of the Nightbringer',
      role: 'epic-hero',
      epicHero: true,
      points: 360,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Epic Hero'],
      kit: { name: 'C’tan Shard of the Nightbringer', priceEUR: 105, models: 1, verified: true },
    },
    // --- Battleline ---
    {
      id: 'necron-warriors',
      name: 'Necron Warriors',
      role: 'battleline',
      points: 85,
      models: 10,
      flavor: 4,
      keywords: ['Battleline', 'Infantry'],
      // The Necron Warriors box also builds 3 Canoptek Scarab Swarms (verified).
      kit: {
        name: 'Necron Warriors',
        priceEUR: 42,
        models: 10,
        verified: true,
        alsoBuilds: [{ unitId: 'canoptek-scarabs', models: 3 }],
      },
    },
    // --- Infantry ---
    {
      id: 'immortals',
      name: 'Immortals',
      role: 'battleline',
      points: 65,
      models: 5,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Necron Immortals', priceEUR: 37, models: 5, verified: true },
    },
    {
      id: 'lychguard',
      name: 'Lychguard',
      role: 'infantry',
      points: 80,
      models: 5,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Lychguard', priceEUR: 50, models: 5, verified: true },
    },
    {
      id: 'skorpekh-destroyers',
      name: 'Skorpekh Destroyers',
      role: 'infantry',
      points: 85,
      pointsEscalated: 95,
      models: 3,
      flavor: 4,
      keywords: ['Infantry'],
      kit: { name: 'Skorpekh Destroyers', priceEUR: 51.25, models: 3, verified: true },
    },
    {
      id: 'lokhust-destroyers',
      name: 'Lokhust Heavy Destroyers',
      role: 'infantry',
      points: 50,
      pointsEscalated: 60,
      models: 1,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Lokhust Heavy Destroyer', priceEUR: 32.5, models: 1, verified: true },
    },
    {
      id: 'flayed-ones',
      name: 'Flayed Ones',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Flayed Ones', priceEUR: 45, models: 5, verified: true },
    },
    // --- Canoptek constructs ---
    {
      id: 'canoptek-scarabs',
      name: 'Canoptek Scarab Swarms',
      role: 'infantry',
      points: 40,
      models: 3,
      flavor: 3,
      keywords: ['Swarm', 'Canoptek'],
      // Not sold as their own box — 3 come free in the Necron Warriors box (and
      // in the Combat Patrol), so the standalone price here is a placeholder (≈).
      kit: { name: 'Canoptek Scarab Swarms', priceEUR: 30, models: 3 },
    },
    {
      id: 'canoptek-wraiths',
      name: 'Canoptek Wraiths',
      role: 'mounted',
      points: 95,
      pointsEscalated: 115,
      escalateAt: 2, // MFM: "1st unit 95 / 2nd + 115"
      models: 3,
      flavor: 3,
      keywords: ['Beast', 'Canoptek'],
      kit: { name: 'Canoptek Wraiths', priceEUR: 51.5, models: 3, verified: true },
    },
    {
      id: 'doomstalker',
      name: 'Canoptek Doomstalker',
      role: 'vehicle',
      points: 130,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker', 'Canoptek'],
      kit: { name: 'Canoptek Doomstalker', priceEUR: 42, models: 1, verified: true },
    },
    // --- Vehicles ---
    {
      id: 'ghost-ark',
      name: 'Ghost Ark',
      role: 'transport',
      points: 100,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Transport'],
      // Wahapedia: carries 10 Necron Warrior models (+1 infantry character).
      transports: ['necron-warriors'],
      kit: { name: 'Ghost Ark', priceEUR: 55, models: 1, verified: true },
    },
    {
      id: 'doomsday-ark',
      name: 'Doomsday Ark',
      role: 'vehicle',
      points: 200,
      pointsEscalated: 230,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      kit: { name: 'Doomsday Ark', priceEUR: 55, models: 1, verified: true },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-necrons',
      name: 'Combat Patrol: Necrons',
      priceEUR: 139,
      verified: true,
      url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-necrons-2023',
      // Contents confirmed on the product page (2026-09-10).
      builds: [
        { unitId: 'overlord', models: 1 },
        { unitId: 'doomstalker', models: 1 },
        { unitId: 'skorpekh-destroyers', models: 3 },
        { unitId: 'necron-warriors', models: 10 },
        { unitId: 'canoptek-scarabs', models: 3 },
      ],
    },
  ],
  competitiveLists: {
    // ~2000 pts, C'tan + Canoptek + Destroyers archetype inspired by recent
    // 11th-edition event lists (e.g. Cursed Legion). Uses in-collection units;
    // real points from Wahapedia. Totals 1975 pts.
    2000: [
      { unitId: 'ctan-nightbringer', count: 1 },
      { unitId: 'szeras', count: 1 },
      { unitId: 'technomancer', count: 1 },
      { unitId: 'overlord', count: 1 },
      { unitId: 'lychguard', count: 2 },
      { unitId: 'necron-warriors', count: 2 },
      { unitId: 'immortals', count: 1 },
      { unitId: 'skorpekh-destroyers', count: 2 },
      { unitId: 'canoptek-wraiths', count: 2 },
      { unitId: 'canoptek-scarabs', count: 2 },
      { unitId: 'doomstalker', count: 2 },
      { unitId: 'lokhust-destroyers', count: 3 },
    ],
  },
}
