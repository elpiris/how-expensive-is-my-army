import type { Faction } from '../../types'
import { baseUnits, darkAngelsCP, gettingStartedBox, heroesOfTheChapter } from './base'

// Space Marines with NO Chapter — the plain Codex roster.
export const spaceMarines: Faction = {
  id: 'space-marines',
  name: 'Space Marines',
  system: 'w40k',
  category: 'space-marines',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  // Codex combined arms: line squads, a solid armour wing, a few bikes and HQs.
  profile: { character: 2, infantry: 4, mounted: 1, vehicle: 3 },
  blurb:
    'The Adeptus Astartes. Elite power-armoured infantry backed by dreadnoughts, tanks and heroic captains — a Chapter-agnostic Codex force.',
  units: baseUnits,
  valueBoxes: [gettingStartedBox, darkAngelsCP, heroesOfTheChapter],
  competitiveLists: {},
}
