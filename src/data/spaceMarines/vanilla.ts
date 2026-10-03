import type { Faction } from '../../types'
import { baseUnits, gettingStartedBox } from './base'

// Space Marines with NO Chapter — the plain Codex roster.
export const spaceMarines: Faction = {
  id: 'space-marines',
  name: 'Space Marines',
  system: 'w40k',
  category: 'imperium',
  lastVerified: '2026-10-03',
  pointsVerified: true,
  profile: { character: 2, infantry: 4, mounted: 1, vehicle: 3 },
  blurb:
    'The Adeptus Astartes. Elite power-armoured infantry backed by dreadnoughts, tanks and heroic captains — a Chapter-agnostic Codex force.',
  units: baseUnits,
  valueBoxes: [gettingStartedBox],
  competitiveLists: {},
}
