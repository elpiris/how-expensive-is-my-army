import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// DEATH GUARD
// Prices VERIFIED from warhammer.com EU store (en-FI, euros) 2026-10-01.
// Points + keywords + LEADER data VERIFIED from Wahapedia (11th edition)
// 2026-10-01 (base "1st unit" cost at the default model count).
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
  lastVerified: '2026-10-01',
  pointsVerified: true,
  blurb:
    'Nurgle’s plague legion. Resilient Plague Marines, shambling Poxwalkers and daemon engines that grind the foe down.',
  units: [
    // --- Characters / Epic Heroes ---
    {
      id: 'typhus',
      name: 'Typhus',
      role: 'epic-hero',
      epicHero: true,
      points: 100,
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
      points: 120,
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
      points: 100,
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
      points: 160,
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
      points: 180,
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
      points: 170,
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
      points: 75,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      kit: { name: 'Chaos Rhino', priceEUR: 50, models: 1, verified: true },
    },
    // --- Monster ---
    {
      id: 'great-unclean-one',
      name: 'Great Unclean One',
      role: 'monster',
      points: 265,
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
