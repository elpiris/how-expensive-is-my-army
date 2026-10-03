import type { Faction } from '../types'
import { custodes } from './custodes'
import { sororitas } from './sororitas'
import { mechanicus } from './mechanicus'
import { astraMilitarum } from './astraMilitarum'
import { imperialKnights } from './imperialKnights'
import { greyKnights } from './greyKnights'
import { spaceMarines } from './spaceMarines/vanilla'
import { ultramarines } from './spaceMarines/ultramarines'
import { imperialFists } from './spaceMarines/imperialFists'
import { salamanders } from './spaceMarines/salamanders'
import { ironHands } from './spaceMarines/ironHands'
import { whiteScars } from './spaceMarines/whiteScars'
import { ravenGuard } from './spaceMarines/ravenGuard'
import { darkAngels } from './spaceMarines/darkAngels'
import { blackTemplars } from './spaceMarines/blackTemplars'
import { spaceWolves } from './spaceMarines/spaceWolves'
import { bloodAngels } from './spaceMarines/bloodAngels'
import { deathGuard } from './deathGuard'
import { chaosSpaceMarines } from './chaosSpaceMarines'
import { chaosKnights } from './chaosKnights'
import { emperorsChildren } from './emperorsChildren'
import { worldEaters } from './worldEaters'
import { thousandSons } from './thousandSons'
import { chaosDaemons } from './chaosDaemons'
import { necrons } from './necrons'
import { tyranids } from './tyranids'
import { aeldari } from './aeldari'
import { tauEmpire } from './tauEmpire'
import { leaguesOfVotann } from './leaguesOfVotann'
import { genestealerCults } from './genestealerCults'
import { craftworlds } from './craftworlds'

// Active factions, ordered by grand alliance (the dropdown groups them by
// `category`). Space Marines ship as a base (Chapter-agnostic) force plus the
// Chapters — 6 Codex-compliant (Ultramarines, Imperial Fists, Salamanders, Iron
// Hands, White Scars, Raven Guard) and 4 non-compliant (Dark Angels, Black
// Templars, Space Wolves, Blood Angels).
export const factions: Faction[] = [
  // Imperium
  custodes,
  sororitas,
  mechanicus,
  astraMilitarum,
  imperialKnights,
  greyKnights,
  spaceMarines,
  ultramarines,
  imperialFists,
  salamanders,
  ironHands,
  whiteScars,
  ravenGuard,
  darkAngels,
  blackTemplars,
  spaceWolves,
  bloodAngels,
  // Chaos
  deathGuard,
  chaosSpaceMarines,
  chaosKnights,
  emperorsChildren,
  worldEaters,
  thousandSons,
  chaosDaemons,
  // Xenos
  necrons,
  tyranids,
  aeldari,
  ...craftworlds,
  tauEmpire,
  leaguesOfVotann,
  genestealerCults,
]

export function getFaction(id: string): Faction | undefined {
  return factions.find((f) => f.id === id)
}
