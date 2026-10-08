import type { Faction } from '../types'
import { sororitas } from './sororitas'

// ---------------------------------------------------------------------------
// ADEPTA SORORITAS ORDERS — the four clearest Orders Militant as flavour
// sub-factions (2026-10-08; Argent Shroud and Ebon Chalice left out — their
// unit preferences are too vague). Same roster, points, prices and Combat
// Patrol; each adds an `identity` (unit tag weights), signature units and a
// composition profile. Favoured only, not exclusive — every order fields the
// same units. Shared by everyone: Morvenn Vahl (the Abbess), Saint Celestine (a
// Living Saint), Daemonifuge, Intranzia Fraye, Aestred Thurga (Order Pronatus),
// Canonesses, Priests, Hospitallers, Rhinos. Sources: Goonhammer / BoLS order
// summaries, Lexicanum.
// ---------------------------------------------------------------------------

const order = (
  o: Pick<Faction, 'id' | 'name' | 'identity' | 'signature' | 'profile' | 'blurb' | 'flavour' | 'transportChance'>,
): Faction => ({
  ...sororitas,
  flavour: 0.5,
  ...o,
  parent: sororitas.id,
  subfactionLabel: undefined,
})

export const ourMartyredLady = order({
  id: 'sororitas-our-martyred-lady',
  name: 'Our Martyred Lady',
  // Faith and martyrdom: Battle Sisters and Novitiates, Saint Katherine's Triumph.
  identity: { faithful: 3, penitent: 1 },
  signature: ['junith-eruita', 'triumph-katherine'],
  profile: { character: 1.5, infantry: 5.5, mounted: 1, vehicle: 2 },
  blurb:
    'The Order of Our Martyred Lady fights in black, in mourning for Saint Katherine — massed Battle Sisters whose faith burns brightest in martyrdom.',
})

export const valorousHeart = order({
  id: 'sororitas-valorous-heart',
  name: 'Valorous Heart',
  // Penance and endurance: Repentia, Arco-flagellants and Engines of Redemption.
  identity: { penitent: 3 },
  profile: { character: 1.5, infantry: 5, mounted: 0.5, vehicle: 3 },
  blurb:
    'The Order of the Valorous Heart seeks redemption through penance — Repentia, Arco-flagellants and Penitent Engines lead the charge, the stoic Sisters behind them.',
})

export const bloodyRose = order({
  id: 'sororitas-bloody-rose',
  name: 'Bloody Rose',
  // Melee: Celestian Sacresants, Zephyrim, jump-pack Canonesses, Paragons.
  identity: { melee: 3 },
  profile: { character: 1.5, infantry: 5, mounted: 1.5, vehicle: 2 },
  blurb:
    'The Order of the Bloody Rose channels righteous fury into close combat — Sacresants, Zephyrim and Paragon Warsuits crash into the foe.',
})

export const sacredRose = order({
  id: 'sororitas-sacred-rose',
  name: 'Sacred Rose',
  // Purifying flame: Dominions, Immolators, Seraphim and Sanctifiers.
  identity: { flamer: 3 },
  transportChance: 0.6,
  profile: { character: 1.5, infantry: 5, mounted: 0.5, vehicle: 3 },
  blurb:
    'The Order of the Sacred Rose cleanses with fire — Dominion squads in Immolators, Seraphim and Sanctifiers purging the heretic with flamers.',
})

export const orders = [ourMartyredLady, valorousHeart, bloodyRose, sacredRose]
