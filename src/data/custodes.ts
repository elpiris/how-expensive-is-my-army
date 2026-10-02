import type { Faction } from '../types'

// ---------------------------------------------------------------------------
// ADEPTUS CUSTODES (Imperium)  — full roster, fine-tuned 2026-10-02
// Points: ALL datasheets from the Munitorum Field Manual (11th ed) 2026-10-02,
//   with per-unit escalation thresholds + highest-cost wargear.
// Prices: from warhammer.com en-EU (2026-10-02) for everything GW currently
//   sells (verified: true). The Forge World / battle-group-only kits aren't sold
//   on their own, so those are BEST-EFFORT estimates (verified: false → "≈").
//
// NB: GW has DISCONTINUED the Combat Patrol: Adeptus Custodes — the only current
// bundle is the heavy "Custodes Support Battle Group" (€180: Telemon + Pallas +
// 4 jetbikes), which is a poor starter box, so this faction has no value box and
// lists are built from individual kits.
//
// Custodes are an elite army whose core troops cost 200+ pts, so the per-bracket
// size cap is disabled (`ignoreSizeCap`) — otherwise Custodian Guard couldn't be
// fielded below 2000 pts.
//
// Shared kits: the €53 Custodian Guard/Wardens plastic box builds Custodian Guard
// (incl. the Adrasite/Pyrithite Spears variant), Wardens or Sagittarum; the €51
// Allarus box builds Allarus or the Allarus characters; the €51 Sisters of
// Silence box builds Prosecutors, Vigilators or Witchseekers — each modelled as
// its own purchase of that kit. "Talons of the Emperor" (€50) builds BOTH
// Valerian and Aleya, credited via alsoBuilds.
// ---------------------------------------------------------------------------

export const custodes: Faction = {
  id: 'adeptus-custodes',
  name: 'Adeptus Custodes',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-02',
  pointsVerified: true,
  ignoreSizeCap: true,
  blurb:
    'The Emperor’s golden guardians. A handful of near-peerless warriors, each worth a squad of lesser soldiers.',
  units: [
    // --- Epic Heroes ---
    {
      id: 'trajann-valoris',
      name: 'Trajann Valoris',
      role: 'epic-hero',
      epicHero: true,
      points: 135,
      models: 1,
      flavor: 5,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      leads: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens', 'sagittarum-custodians'],
      kit: { name: 'Captain-General Trajann Valoris', priceEUR: 38.5, models: 1, verified: true },
    },
    {
      id: 'valerian',
      name: 'Valerian',
      role: 'epic-hero',
      epicHero: true,
      points: 120,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      leads: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens', 'sagittarum-custodians'],
      // "Talons of the Emperor" box builds both Valerian and Aleya.
      kit: {
        name: 'Talons of the Emperor: Valerian and Aleya',
        priceEUR: 50,
        models: 1,
        verified: true,
        alsoBuilds: [{ unitId: 'aleya', models: 1 }],
      },
    },
    {
      id: 'aleya',
      name: 'Aleya',
      role: 'epic-hero',
      epicHero: true,
      points: 55,
      models: 1,
      flavor: 3,
      keywords: ['Character', 'Infantry', 'Epic Hero'],
      leads: ['prosecutors', 'vigilators', 'witchseekers'],
      kit: {
        name: 'Talons of the Emperor: Valerian and Aleya',
        priceEUR: 50,
        models: 1,
        verified: true,
        alsoBuilds: [{ unitId: 'valerian', models: 1 }],
      },
    },
    // --- Characters ---
    {
      id: 'shield-captain',
      name: 'Shield-Captain',
      role: 'character',
      points: 110,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens', 'sagittarum-custodians'],
      kit: { name: 'Shield-Captain', priceEUR: 36, models: 1, verified: true },
    },
    {
      id: 'shield-captain-allarus',
      name: 'Shield-Captain in Allarus Terminator Armour',
      role: 'character',
      points: 130,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Infantry', 'Terminator', 'Leader'],
      leads: ['allarus-custodians', 'aquilon-custodians'],
      kit: { name: 'Shield-Captain in Allarus Terminator Armour', priceEUR: 51, models: 1, verified: true },
    },
    {
      id: 'shield-captain-dawneagle',
      name: 'Shield-Captain on Dawneagle Jetbike',
      role: 'character',
      points: 150,
      models: 1,
      flavor: 4,
      keywords: ['Character', 'Mounted', 'Fly', 'Leader'],
      leads: ['agamatus-custodians', 'vertus-praetors'],
      kit: { name: 'Shield-Captain on Dawneagle Jetbike', priceEUR: 53, models: 1, verified: true },
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
      leads: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens'],
      kit: { name: 'Blade Champion', priceEUR: 36, models: 1, verified: true },
    },
    {
      id: 'knight-centura',
      name: 'Knight-Centura',
      role: 'character',
      points: 55,
      models: 1,
      flavor: 2,
      keywords: ['Character', 'Infantry', 'Leader'],
      leads: ['prosecutors', 'vigilators', 'witchseekers'],
      kit: { name: 'Knight-Centura', priceEUR: 25, models: 1 },
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
      kit: { name: 'Custodian Guard', priceEUR: 53, models: 5, verified: true },
    },
    {
      id: 'custodian-guard-spears',
      name: 'Custodian Guard with Adrasite and Pyrithite Spears',
      role: 'battleline',
      // MFM @5 models: "1st to 3rd 250 / 4th + 260".
      points: 250,
      pointsEscalated: 260,
      escalateAt: 4,
      models: 5,
      flavor: 3,
      keywords: ['Battleline', 'Infantry'],
      kit: { name: 'Custodian Guard', priceEUR: 53, models: 5, verified: true },
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
      kit: { name: 'Custodian Wardens', priceEUR: 53, models: 5, verified: true },
    },
    {
      id: 'sagittarum-custodians',
      name: 'Sagittarum Custodians',
      role: 'infantry',
      points: 225,
      models: 5,
      flavor: 3,
      keywords: ['Infantry'],
      kit: { name: 'Custodian Guard', priceEUR: 53, models: 5, verified: true },
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
      kit: { name: 'Allarus Custodians', priceEUR: 51, models: 3, verified: true },
    },
    {
      id: 'aquilon-custodians',
      name: 'Aquilon Custodians',
      role: 'infantry',
      points: 195,
      models: 3,
      flavor: 3,
      keywords: ['Infantry', 'Terminator'],
      // Forge World — not sold on the webstore; price best-effort.
      kit: { name: 'Aquilon Custodians', priceEUR: 105, models: 3 },
    },
    {
      id: 'prosecutors',
      name: 'Prosecutors',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Prosecutor Squad', priceEUR: 51, models: 5, verified: true },
    },
    {
      id: 'vigilators',
      name: 'Vigilators',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Vigilator Squad', priceEUR: 51, models: 5, verified: true },
    },
    {
      id: 'witchseekers',
      name: 'Witchseekers',
      role: 'infantry',
      points: 55,
      models: 5,
      flavor: 2,
      keywords: ['Infantry'],
      kit: { name: 'Witchseeker Squad', priceEUR: 51, models: 5, verified: true },
    },
    {
      id: 'venatari-custodians',
      name: 'Venatari Custodians',
      role: 'infantry',
      // MFM @3 models: "1st to 2nd 150 / 3rd + 160".
      points: 150,
      pointsEscalated: 160,
      models: 3,
      flavor: 3,
      keywords: ['Infantry', 'Fly'],
      wargear: { name: 'Venatari Lance', points: 5 },
      kit: { name: 'Venatari Sodality', priceEUR: 66, models: 3, verified: true },
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
      kit: { name: 'Vertus Praetors', priceEUR: 53, models: 3, verified: true },
    },
    {
      id: 'agamatus-custodians',
      name: 'Agamatus Custodians',
      role: 'mounted',
      points: 225,
      models: 3,
      flavor: 3,
      keywords: ['Mounted', 'Fly'],
      // Forge World — not sold on the webstore; price best-effort.
      kit: { name: 'Agamatus Custodians', priceEUR: 105, models: 3 },
    },
    // --- Vehicles ---
    {
      id: 'venerable-contemptor',
      name: 'Venerable Contemptor Dreadnought',
      role: 'vehicle',
      // MFM: "1st to 2nd 170 / 3rd + 185".
      points: 170,
      pointsEscalated: 185,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Contemptor Dreadnought', priceEUR: 53, models: 1, verified: true },
    },
    {
      id: 'contemptor-achillus',
      name: 'Contemptor-Achillus Dreadnought',
      role: 'vehicle',
      // MFM: "1st to 2nd 155 / 3rd + 170".
      points: 155,
      pointsEscalated: 170,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Contemptor-Achillus Dreadnought', priceEUR: 105, models: 1 },
    },
    {
      id: 'contemptor-galatus',
      name: 'Contemptor-Galatus Dreadnought',
      role: 'vehicle',
      // MFM: "1st to 2nd 165 / 3rd + 180".
      points: 165,
      pointsEscalated: 180,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Walker'],
      kit: { name: 'Contemptor-Galatus Dreadnought', priceEUR: 105, models: 1 },
    },
    {
      id: 'caladius-grav-tank',
      name: 'Caladius Grav-tank',
      role: 'vehicle',
      // MFM: "1st to 2nd 210 / 3rd + 225".
      points: 210,
      pointsEscalated: 225,
      models: 1,
      flavor: 4,
      keywords: ['Vehicle'],
      wargear: { name: 'Twin Arachnus Heavy Blaze Cannon', points: 15 },
      // Forge World — not sold on the webstore; price best-effort.
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
      // Only sold in the €180 Support Battle Group; standalone price best-effort.
      kit: { name: 'Telemon Heavy Dreadnought', priceEUR: 105, models: 1 },
    },
    {
      id: 'pallas-grav-attack',
      name: 'Pallas Grav-attack',
      role: 'vehicle',
      points: 100,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Fly'],
      // Only sold in the €180 Support Battle Group; standalone price best-effort.
      kit: { name: 'Pallas Grav-attack', priceEUR: 60, models: 1 },
    },
    {
      id: 'ares-gunship',
      name: 'Legio Custodes Ares Gunship',
      role: 'vehicle',
      // MFM: "1st unit 580 / 2nd + 610".
      points: 580,
      pointsEscalated: 610,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Fly'],
      kit: { name: 'Legio Custodes Ares Gunship', priceEUR: 480, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'orion-assault-dropship',
      name: 'Legio Custodes Orion Assault Dropship',
      role: 'vehicle',
      // MFM: "1st unit 690 / 2nd + 740".
      points: 690,
      pointsEscalated: 740,
      escalateAt: 2,
      models: 1,
      flavor: 5,
      keywords: ['Vehicle', 'Fly'],
      kit: { name: 'Legio Custodes Orion Assault Dropship', priceEUR: 480, models: 1, verified: true, onlineOnly: true },
    },
    // --- Dedicated Transports ---
    {
      id: 'coronus-grav-carrier',
      name: 'Coronus Grav-carrier',
      role: 'transport',
      // MFM: "1st to 2nd 180 / 3rd + 200".
      points: 180,
      pointsEscalated: 200,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Transport', 'Fly'],
      transports: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens', 'sagittarum-custodians', 'prosecutors', 'vigilators', 'witchseekers'],
      // Forge World — not sold on the webstore; price best-effort.
      kit: { name: 'Coronus Grav-carrier', priceEUR: 115, models: 1 },
    },
    {
      id: 'venerable-land-raider',
      name: 'Venerable Land Raider',
      role: 'transport',
      // MFM: "1st unit 220 / 2nd + 240".
      points: 220,
      pointsEscalated: 240,
      escalateAt: 2,
      models: 1,
      flavor: 3,
      keywords: ['Vehicle', 'Transport'],
      transports: ['custodian-guard', 'custodian-guard-spears', 'custodian-wardens', 'sagittarum-custodians', 'allarus-custodians'],
      kit: { name: 'Venerable Land Raider', priceEUR: 80, models: 1, verified: true, onlineOnly: true },
    },
    {
      id: 'anathema-psykana-rhino',
      name: 'Anathema Psykana Rhino',
      role: 'transport',
      // MFM: "1st to 3rd 65 / 4th + 75" — escalates on the 4th copy.
      points: 65,
      pointsEscalated: 75,
      escalateAt: 4,
      models: 1,
      flavor: 2,
      keywords: ['Vehicle', 'Transport'],
      // Carries Sisters of Silence (Anathema Psykana) infantry.
      transports: ['prosecutors', 'vigilators', 'witchseekers'],
      kit: { name: 'Anathema Psykana Rhino', priceEUR: 50, models: 1 },
    },
  ],
  // GW no longer sells a Combat Patrol: Adeptus Custodes (see header note).
  valueBoxes: [],
  competitiveLists: {},
}
