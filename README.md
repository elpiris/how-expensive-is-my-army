# 💰 How Expensive Is My Army?

A web app that auto-builds a **Warhammer 40,000** army list for a chosen faction,
points level and play style, then prices it up in **euros** using Games Workshop
box kits — automatically folding in **Combat Patrol** value boxes to keep the cost
down, and letting you apply a retailer discount.

Built with **Vite + React + TypeScript**.

## Features

- **Factions:** Space Marines, Necrons, Tyranids (more can be added — see below).
- **Points brackets:** 500 / 1000 / 1500 / 2000.
- **Casual mode:** generates a legal, flavourful list (max 3 of a datasheet, 6 for
  battleline; Epic Heroes are unique). Reroll for a new take.
- **Competitive mode:** a curated netlist based on recent 11th-edition event
  archetypes, trimmed to fit smaller brackets.
- **Smart shopping list:** works out which boxes to buy, preferring Combat Patrols
  whenever they genuinely save money, and flags leftover/spare models.
- **Discounts:** one-click 10 / 15 / 20 % retailer discount, correctly excluding
  Games-Workshop-webstore-exclusive kits (which don't get discounted).
- **Cost per point** and total-points readouts.

## Running it

You need **Node.js 18+** installed (it currently isn't on this machine —
get it from <https://nodejs.org>).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

To build for production:

```bash
npm run build
npm run preview
```

## A note on the data (please read)

Warhammer points and prices change often — points get a Munitorum Field Manual
update roughly monthly/quarterly, and GW adjusts prices periodically.

- **Points** reflect the 11th-edition MFM (Jul/Aug 2026) and are *indicative*.
- **Prices** use GW's standard EU price tiers in euros. **Combat Patrol prices are
  confirmed (€130).** Individual-kit prices marked `≈ price` in the UI are
  tier-estimates — always confirm the live price at
  [warhammer.com](https://www.warhammer.com/en-EU/) before buying.
- Each faction file records a `lastVerified` date.

This tool is a **planning aid**, not a store. It is not affiliated with or
endorsed by Games Workshop. Warhammer 40,000 is a trademark of Games Workshop Ltd.

## Project layout

```
src/
  types.ts              # domain model (Unit, Kit, ValueBox, Faction, cost types)
  data/
    index.ts            # registry of all factions
    spaceMarines.ts     # per-faction unit + box + points + price data
    necrons.ts
    tyranids.ts
  lib/
    generateList.ts     # casual + competitive list generation
    costList.ts         # box optimisation + discount maths
  App.tsx               # UI
  styles.css
```

## Adding / updating data

- **Update points or prices:** edit the relevant `src/data/<faction>.ts` file and
  bump its `lastVerified` date. Set a kit's `verified: true` once you've confirmed
  the price on warhammer.com — that removes the `≈` badge.
- **Add a unit:** add a `Unit` object (with its `kit`) to that faction's `units`.
- **Add a faction:** create `src/data/<faction>.ts` exporting a `Faction`, then add
  it to the array in `src/data/index.ts`.
- **Add a value box:** add a `ValueBox` to the faction's `valueBoxes`, listing what
  it `builds` (unit id + model count).

## Possible next steps

- More factions (all ~25 official 40k armies).
- Multiple unit sizes / wargear points.
- Live price lookups instead of static tiers.
- Shareable/exportable lists; other game systems (AoS, Old World).
