import type { Faction } from '../types'
import { custodes } from './custodes'
import { sororitas } from './sororitas'
import { mechanicus } from './mechanicus'
import { deathGuard } from './deathGuard'
import { chaosSpaceMarines } from './chaosSpaceMarines'
import { chaosKnights } from './chaosKnights'
import { necrons } from './necrons'
import { tyranids } from './tyranids'
import { aeldari } from './aeldari'

// Active factions, ordered by grand alliance (the dropdown groups them by
// `category`). Space Marines are parked (see spaceMarines.ts) until their
// Chapter system is modelled — tracked in TODO.md.
export const factions: Faction[] = [
  // Imperium
  custodes,
  sororitas,
  mechanicus,
  // Chaos
  deathGuard,
  chaosSpaceMarines,
  chaosKnights,
  // Xenos
  necrons,
  tyranids,
  aeldari,
]

export function getFaction(id: string): Faction | undefined {
  return factions.find((f) => f.id === id)
}
