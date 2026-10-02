import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// DEATH GUARD
// Prices VERIFIED from warhammer.com EU store (en-FI, euros) 2026-10-01.
// Points VERIFIED from the Munitorum Field Manual (11th edition) 2026-10-02
// (base "1st unit" cost at the default model count, plus the escalating cost
// for later copies via `pointsEscalated`/`escalateAt`). Keywords + LEADER data
// from Wahapedia. The Chaos Rhino escalates only on its 4th copy; Deathshroud,
// Foetid Bloat-drone, Plagueburst Crawler, Blightlord Terminators and the Great
// Unclean One on the 3rd.
//
// Notes:
//  - Combat Patrol: Death Guard ("Maggot Lords") contents confirmed.
//  - Some characters only come in online-only / combo boxes (Lord of Contagion;
//    the Malignant Plaguecaster shares the online "Chosen of Mortarion" box with
//    a Noxious Blightbringer + Plague Marine Champion, so a lone one is poor
//    value — reflected by the whole-box costing).
// ---------------------------------------------------------------------------

export const deathGuard: Faction = {
  id: 'death-guard',
  name: 'Death Guard',
  system: 'w40k',
  category: 'chaos',
  lastVerified: '2026-10-01',
  pointsVerified: true,
  // Resilient Plague Marine infantry + daemon engines, a Daemon Primarch apex.
  profile: { character: 1.5, infantry: 5, vehicle: 2.5, monster: 1 },
  blurb:
    'Nurgle’s plague legion. Resilient Plague Marines, shambling Poxwalkers and daemon engines that grind the foe down.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'typhus',
      name: 'Typhus',
      role: 'epic-hero',
      epicHero: true,
      points: 90,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Terminator', 'Epic Hero'],
      leads: ['blightlord-terminators', 'deathshroud-terminators', 'poxwalkers'],
      kit: { name: 'Typhus', priceEUR: 38.5, models: 1, verified: true },
    },
    {
      id: 'mortarion',
      name: 'Mortarion',
      role: 'epic-hero',
      epicHero: true,
      points: 375,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Monster', 'Epic Hero'],
      kit: { name: 'Mortarion, Daemon Primarch of Nurgle', priceEUR: 140.5, models: 1, verified: true },
    },
    {
      id: 'lord-of-contagion',
      name: 'Lord of Contagion',
      role: 'character',
      points: 110,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Terminator', 'Leader'],
      leads: ['blightlord-terminators', 'deathshroud-terminators'],
      kit: { name: 'Lord of Contagion', priceEUR: 38.5, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'lord-of-virulence',
      name: 'Lord of Virulence',
      role: 'character',
      points: 90,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Terminator', 'Leader'],
      leads: ['blightlord-terminators', 'deathshroud-terminators'],
      kit: { name: 'Lord of Virulence', priceEUR: 36, models: 1, verified: true },
    },
    {
      id: 'malignant-plaguecaster',
      name: 'Malignant Plaguecaster',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Psyker', 'Leader'],
      leads: ['plague-marines', 'poxwalkers'],
      // Online "Chosen of Mortarion" box builds this + a Blightbringer + Champion.
      kit: { name: 'Chosen of Mortarion', priceEUR: 60, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'biologus-putrifier',
      name: 'Biologus Putrifier',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['plague-marines'],
      kit: { name: 'Biologus Putrifier', priceEUR: 27, models: 1, verified: true },
    },
    {
      id: 'tallyman',
      name: 'Tallyman',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['plague-marines'],
      kit: { name: 'Tallyman', priceEUR: 27, models: 1, verified: true },
    },
    {
      id: 'plague-surgeon',
      name: 'Plague Surgeon',
      role: 'character',
      points: 50,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['plague-marines'],
      kit: { name: 'Plague Surgeon', priceEUR: 27, models: 1, verified: true },
    },
    {
      id: 'foul-blightspawn',
      name: 'Foul Blightspawn',
      role: 'character',
      points: 60,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['plague-marines'],
      kit: { name: 'Foul Blightspawn', priceEUR: 27, models: 1, verified: true },
    },
    // --- Battleline ---
    {
      id: 'plague-marines',
      name: 'Plague Marines',
      role: 'battleline',
      // Box builds 7 (confirmed); fielded as a full 7-model unit.
      points: 125,
      models: 7,
      flavor: 4,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Plague Marines', priceEUR: 51, models: 7, verified: true },
    },
    {
      id: 'plaguebearers',
      name: 'Plaguebearers',
      role: 'battleline',
      points: 115,
      models: 10,
      flavor: 3,
      keywords: ['Battleline', 'Infantry', 'Daemon'],
      kit: { name: 'Plaguebearers', priceEUR: 36, models: 10, verified: true },
    },
    // --- Infantry ---
    {
      id: 'poxwalkers',
      name: 'Poxwalkers',
      role: 'infantry',
      points: 65,
      models: 10,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Poxwalkers', priceEUR: 34, models: 10, verified: true },
    },
    {
      id: 'deathshroud-terminators',
      name: 'Deathshroud Terminators',
      role: 'infantry',
      points: 150,
      pointsEscalated: 160,
      models: 3,
      flavor: 4,
      keywords: ['Infantry', 'Terminator'],
      kit: { name: 'Deathshroud Terminators', priceEUR: 53, models: 3, verified: true },
    },
    {
      id: 'blightlord-terminators',
      name: 'Blightlord Terminators',
      role: 'infantry',
      // Box builds 5; unit is 3-5-10, fielded as a box-filling 5.
      // MFM @5 models: "1st to 2nd 185 / 3rd + 215".
      points: 185,
      pointsEscalated: 215,
      models: 5,
      flavor: 4,
      keywords: ['Infantry', 'Terminator'],
      kit: { name: 'Blightlord Terminators', priceEUR: 53, models: 5, verified: true },
    },
    // --- Vehicles / daemon engines ---
    {
      id: 'plagueburst-crawler',
      name: 'Plagueburst Crawler',
      role: 'vehicle',
      // MFM: "1st to 2nd 170 / 3rd + 200".
      points: 170,
      pointsEscalated: 200,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Daemon Engine'],
      kit: { name: 'Plagueburst Crawler', priceEUR: 67, models: 1, verified: true },
    },
    {
      id: 'foetid-bloat-drone',
      name: 'Foetid Bloat-drone',
      role: 'vehicle',
      points: 100,
      pointsEscalated: 110,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Daemon Engine', 'Fly'],
      kit: { name: 'Foetid Bloat-drone', priceEUR: 51, models: 1, verified: true },
    },
    {
      id: 'myphitic-blight-hauler',
      name: 'Myphitic Blight-hauler',
      role: 'vehicle',
      points: 95,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Daemon Engine'],
      kit: { name: 'Myphitic Blight-hauler', priceEUR: 23.5, models: 1, verified: true },
    },
    {
      id: 'chaos-rhino',
      name: 'Chaos Rhino',
      role: 'transport',
      // MFM: "1st to 3rd 75 / 4th + 85" — escalates only on the 4th copy.
      points: 75,
      pointsEscalated: 85,
      escalateAt: 4,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      // Wahapedia: 12 Death Guard Infantry, no Terminators — so Plague Marines
      // or Poxwalkers (not the Terminator units; Plaguebearers aren't Death Guard).
      transports: ['plague-marines', 'poxwalkers'],
      kit: { name: 'Chaos Rhino', priceEUR: 50, models: 1, verified: true },
    },
    // --- Monster ---
    {
      id: 'great-unclean-one',
      name: 'Great Unclean One',
      role: 'monster',
      points: 265,
      pointsEscalated: 280,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Monster', 'Daemon'],
      kit: { name: 'Great Unclean One', priceEUR: 139, models: 1, verified: true },
    },
  ],
  valueBoxes: [
    {
      id: 'cp-death-guard',
      name: 'Combat Patrol: Death Guard',
      priceEUR: 139,
      verified: true,
      url: 'https://www.warhammer.com/en-EU/shop/combat-patrol-death-guard-2025',
      // "Maggot Lords" box — contents confirmed 2026-10-01.
      builds: [
        { unitId: 'lord-of-virulence', models: 1 },
        { unitId: 'tallyman', models: 1 },
        { unitId: 'chaos-rhino', models: 1 },
        { unitId: 'deathshroud-terminators', models: 3 },
        { unitId: 'plague-marines', models: 7 },
      ],
    },
  ],
  competitiveLists: {},
}
