import type { Faction } from '../types'
import { necrons } from './necrons'
import { tyranids } from './tyranids'
import { deathGuard } from './deathGuard'

// Active MVP factions. Space Marines are parked (see spaceMarines.ts) until their
// Chapter system is modelled — they're tracked in TODO.md.
export const factions: Faction[] = [necrons, tyranids, deathGuard]

export function getFaction(id: string): Faction | undefined {
  return factions.find((f) => f.id === id)
}
