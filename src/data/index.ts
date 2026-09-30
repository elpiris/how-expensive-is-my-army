import type { Faction } from '../types'
import { spaceMarines } from './spaceMarines'
import { necrons } from './necrons'
import { tyranids } from './tyranids'

// All factions with seeded data. Add new faction files here to expand coverage.
export const factions: Faction[] = [spaceMarines, necrons, tyranids]

export function getFaction(id: string): Faction | undefined {
  return factions.find((f) => f.id === id)
}
