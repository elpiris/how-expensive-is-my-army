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
import { orks } from './orks'
import { tyranids } from './tyranids'
import { aeldari } from './aeldari'
import { tauEmpire } from './tauEmpire'
import { leaguesOfVotann } from './leaguesOfVotann'
import { genestealerCults } from './genestealerCults'
import { drukhari } from './drukhari'
import { craftworlds } from './craftworlds'
import { hiveFleets } from './hiveFleets'
import { legions } from './legions'
import { regiments } from './regiments'
import { septs } from './septs'
import { drukhariForces } from './drukhariForces'
import { clans } from './clans'

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
  ...regiments,
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
  ...legions,
  chaosKnights,
  emperorsChildren,
  worldEaters,
  thousandSons,
  chaosDaemons,
  // Xenos
  necrons,
  orks,
  ...clans,
  tyranids,
  ...hiveFleets,
  aeldari,
  ...craftworlds,
  tauEmpire,
  ...septs,
  leaguesOfVotann,
  genestealerCults,
  drukhari,
  ...drukhariForces,
]

export function getFaction(id: string): Faction | undefined {
  return factions.find((f) => f.id === id)
}

// Daemon allies — the god-aligned Chaos armies (Death Guard, World Eaters,
// Emperor's Children, Thousand Sons) include datasheets shared with the Chaos
// Daemons (Plaguebearers, Bloodthirsters…) that the rules only allow through a
// specific detachment — a concept this app leaves out. The app excludes them
// unless the user ticks "Include daemon datasheets". Matched by name against
// the Chaos Daemons roster; the armies' own Daemon Princes are Heretic Astartes
// datasheets, so they always stay.
const normName = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')

/** Ids of the faction's datasheets it shares with the Chaos Daemons. */
export function daemonAllyIds(faction: Faction): string[] {
  if (faction.id === chaosDaemons.id || faction.parent === chaosDaemons.id) return []
  const daemonNames = new Set(chaosDaemons.units.map((u) => normName(u.name)))
  return faction.units
    .filter((u) => daemonNames.has(normName(u.name)) && !u.name.startsWith('Daemon Prince'))
    .map((u) => u.id)
}

/** The faction without its daemon-ally datasheets (and any links to them). */
export function withoutDaemonAllies(faction: Faction): Faction {
  const drop = new Set(daemonAllyIds(faction))
  if (!drop.size) return faction
  return {
    ...faction,
    units: faction.units
      .filter((u) => !drop.has(u.id))
      .map((u) => ({
        ...u,
        ...(u.leads ? { leads: u.leads.filter((id) => !drop.has(id)) } : {}),
        ...(u.transports ? { transports: u.transports.filter((id) => !drop.has(id)) } : {}),
      })),
  }
}
