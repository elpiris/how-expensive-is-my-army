# 💰 How Expensive Is My Army?

A web app that auto-builds a **Warhammer 40,000** army list for a chosen faction
and points level, then prices it up in **euros** using Games Workshop box kits —
folding in **Combat Patrol / battleforce** value boxes to keep the cost down, and
letting you apply a retailer discount.

Built with **Vite + React + TypeScript**.

## Features

- **9 factions**, grouped by grand alliance in the dropdown:
  - **Imperium** — Adeptus Custodes, Adepta Sororitas, Adeptus Mechanicus
  - **Chaos** — Death Guard, Chaos Space Marines, Chaos Knights
  - **Xenos** — Necrons, Tyranids, Aeldari
  - (Space Marines are parked pending Chapter-system support — see TODO.md.)
- **Two modes:**
  - **Quick list** — pick a faction + points bracket (500 / 1000 / 1500 / 2000)
    and get one list. Reroll for a new take.
  - **Escalation** — pick a faction and grow one collection 500 → 1000 → 1500 →
    2000, where each stage is a **superset** of the last, and see the new boxes to
    buy (and the spend) at each step.
- **Value-driven, legal lists:** prefers good points-per-euro kits, seeds the
  faction's value box (Combat Patrol) when it has one, keeps a battleline backbone,
  gives leadable units a Leader, and respects the official MFM unit limits (max 3
  of a datasheet, 6 for Battleline at 2000; Epic Heroes unique).
- **Accurate points:** sourced from the **Munitorum Field Manual** (11th ed),
  including each datasheet's **escalating cost** for repeat copies (a unit can step
  up on its 2nd, 3rd or 4th copy — shown on the list row) and the single
  **highest-cost wargear** option a unit can take.
- **Transports** are only added to carry a unit already in the list (one unit each).
- **Smart shopping list:** works out which boxes to buy, preferring value boxes when
  they genuinely save money, credits bonus sprues, and flags leftover models.
- **Discounts:** one-click 10 / 15 / 20 % retailer discount, correctly excluding
  Games-Workshop-webstore-exclusive kits (which don't get discounted), applied per
  line and to the totals.
- **Cost per point** and total-points readouts.

## Running it

Requires **Node.js 18+**.

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

- **Points** reflect the 11th-edition MFM and are verified per faction, but are
  *indicative* — always re-check the current MFM.
- **Prices** are in euros from warhammer.com (en-EU). Kits confirmed against the
  live store are shown normally; kits whose price is a best-effort estimate (not
  yet confirmed, or not sold on their own — e.g. Forge World) are flagged **`≈
  price`** in the UI. Always confirm the live price at
  [warhammer.com](https://www.warhammer.com/en-EU/) before buying.
- Not every faction has a value box: GW has discontinued some Combat Patrols (e.g.
  Adeptus Custodes), and superheavy armies (Chaos Knights) never had one — those
  lists are built from individual kits.
- Each faction file records a `lastVerified` date; see [TODO.md](TODO.md) for the
  per-faction verification status.

This tool is a **planning aid**, not a store. It is not affiliated with or
endorsed by Games Workshop. Warhammer 40,000 is a trademark of Games Workshop Ltd.

## Project layout

```
src/
  types.ts              # domain model (Unit, Kit, ValueBox, Faction, cost types)
  data/
    index.ts            # faction registry (grouped by category in the UI)
    custodes.ts         # one file per faction: units + kits + points + prices
    sororitas.ts
    mechanicus.ts
    deathGuard.ts
    chaosSpaceMarines.ts
    chaosKnights.ts
    necrons.ts
    tyranids.ts
    aeldari.ts
    spaceMarines.ts     # parked (not registered in index.ts)
  lib/
    value.ts            # points-per-euro, copy/escalation + wargear points helpers
    generateList.ts     # Quick + Escalation list generation
    costList.ts         # box optimisation, discounts, per-step purchase deltas
  App.tsx               # UI
  styles.css
```

## Adding / updating data

- **Update points or prices:** edit the relevant `src/data/<faction>.ts` file and
  bump its `lastVerified` date. Set a kit's `verified: true` once you've confirmed
  the price on warhammer.com — that removes the `≈` badge.
- **Escalating cost:** give a unit `pointsEscalated` (the higher per-copy cost) and,
  if it steps up before the 3rd copy, `escalateAt: 2` (or `4`).
- **Wargear:** add `wargear: { name, points }` for the single highest-cost option.
- **Add a unit:** add a `Unit` object (with its `kit`) to that faction's `units`.
  Characters can `leads: [unitId, …]`; transports `transports: [unitId, …]`.
- **Add a faction:** create `src/data/<faction>.ts` exporting a `Faction` (with a
  `category` of `imperium` / `chaos` / `xenos`), then add it to `src/data/index.ts`.
- **Add a value box:** add a `ValueBox` to the faction's `valueBoxes`, listing what
  it `builds` (unit id + model count). Leave `valueBoxes: []` if the faction has no
  Combat Patrol.

## Outstanding work

See [TODO.md](TODO.md) for the current to-do list — per-faction price/Combat-Patrol
verification, model/rules refinements, and backlog features.
