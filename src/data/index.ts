import type { Faction } from '../types'
import { custodes } from './custodes'
import { sororitas } from './sororitas'
import { mechanicus } from './mechanicus'
import { spaceMarines } from './spaceMarines/vanilla'
import { ultramarines } from './spaceMarines/ultramarines'
import { imperialFists } from './spaceMarines/imperialFists'
import { salamanders } from './spaceMarines/salamanders'
import { darkAngels } from './spaceMarines/darkAngels'
import { blackTemplars } from './spaceMarines/blackTemplars'
import { spaceWolves } from './spaceMarines/spaceWolves'
import { deathGuard } from './deathGuard'
import { chaosSpaceMarines } from './chaosSpaceMarines'
import { chaosKnights } from './chaosKnights'
import { necrons } from './necrons'
import { tyranids } from './tyranids'
import { aeldari } from './aeldari'

// Active factions, ordered by grand alliance (the dropdown groups them by
// `category`). Space Marines ship as a base (Chapter-agnostic) force plus a
// starter set of Chapters — 3 Codex-compliant (Ultramarines, Imperial Fists,
// Salamanders) and 3 non-compliant (Dark Angels, Black Templars, Space Wolves);
// more Chapters are a TODO.
export const factions: Faction[] = [
  // Imperium
  custodes,
  sororitas,
  mechanicus,
  spaceMarines,
  ultramarines,
  imperialFists,
  salamanders,
  darkAngels,
  blackTemplars,
  spaceWolves,
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
