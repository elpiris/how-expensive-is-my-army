# CLAUDE.md

"How Expensive Is My Army?" — a Vite + React + TypeScript client app that
auto-generates a Warhammer 40,000 army list for a faction/points level and prices
the boxes to buy in euros. Pure front-end over **hand-curated data** (no backend).

## Read these first
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — data model, generation + costing
  pipeline, value helpers, UI, and the MFM/GW data-sourcing recipe. Start here.
- **[TODO.md](TODO.md)** — per-faction data status + backlog. Check before touching data.
- **[README.md](README.md)** — what it is / how to run / feature list.

## Working here
- **Build gate (always before committing):** `npx tsc --noEmit` then `npm run build`.
  Type-check catches almost every data error (ids, categories, field types).
  Node is at `C:\Program Files\nodejs` — in bash prefix: `export PATH="/c/Program Files/nodejs:$PATH"`.
- **Dev server:** `npm run dev` (:5173). Verify changes by importing the live modules
  in the browser pane (`/src/lib/generateList.ts` etc.) — see how prior commits checked
  integrity/robustness/composition.
- **Data lives in `src/data/`** — one `Faction` file per faction, registered in
  `src/data/index.ts`. Space Marines are special: `spaceMarines/base.ts` holds a
  shared base roster reused by one file per Chapter.
- **Points** come from the Munitorum Field Manual (MFM); **prices + Combat Patrols**
  from warhammer.com en-EU. Confirmed prices set `kit.verified: true`; unconfirmed/
  best-effort are `verified:false` (UI shows "≈"). The GW store grid virtualises
  heavily and scraping it is unreliable — pre-fill what it shows, then **ask the
  user one kit at a time in chat** (price / "ok" / box size / what the box builds) —
  their preferred format. MFM points and Combat Patrol contents (product pages) can
  be read in the browser pane. Never solve GW CAPTCHAs. Points/prices drift —
  re-check periodically.
- **Adding a faction (recipe used 2026-10-03):** MFM pass → store grid → Combat
  Patrol page → generate the faction file → run the integrity / generation checks
  (no bad refs, every unit picked, no list over target, CP bought) → per-kit Q&A →
  docs (TODO/README/CLAUDE) → build gate → commit + push.
- **How the checks are run (no test suite yet):** write a throwaway `_check.ts` at
  the repo root that imports `./src/data/index`, `./src/lib/generateList` and
  `./src/lib/costList`, bundle it with
  `npx esbuild _check.ts --bundle --platform=node --outfile=<scratch>/check.js`,
  run it with `node`, then delete `_check.ts`. Typical checks: every `leads` /
  `transports` / `alsoBuilds` / value-box `unitId` exists in the faction; 300 seeds ×
  500/1000/1500/2000 + escalation never exceed the target; every unit gets picked;
  the faction's first value box is bought; average € per bracket looks sane.
- **Don't edit the dev server's files mid-write:** Vite once cached an empty
  `base.ts` read mid-edit — if the app shows a missing-export error, `touch` the file.

## Conventions
- Match the existing data-file style (header comment noting sources + dates; bump
  `lastVerified`). Keep `competitiveLists: {}` (legacy/unused).
- Don't reintroduce the deleted `src/data/spaceMarines.ts` — SM is now the
  `spaceMarines/` folder.
- End commit messages with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Current state (2026-10-04)
- **Factions:** 21 non-SM factions + Space Marines, all with full MFM rosters (FW /
  terrain / discontinued kits left out), verified en-EU prices, real value boxes and
  composition profiles. Imperium: Custodes, Sororitas, Mechanicus, Astra Militarum,
  Imperial Knights, Grey Knights. Chaos: Death Guard, CSM, Chaos Knights, Emperor's
  Children, World Eaters, Thousand Sons, Chaos Daemons. Xenos: Necrons, Tyranids,
  Aeldari, T'au, Votann, GSC, Drukhari, Orks — every main MFM army.
  **Missing (low priority):** Imperial Agents + Deathwatch.
- **Sub-factions** (`parent` + a second dropdown): 10 SM Chapters (6 Codex + DA, BT,
  SW, BA; generic SM boxes incl. DA CP, Heroes / Honoured of the Chapter), 5
  Aeldari Craftworlds, 7 Tyranid Hive Fleets, 6 CSM Legions, 5 AM Regiments and
  5 T'au Septs (Legions / Regiments / Septs have sub-faction-only units). All dropdowns are alphabetical ("No specific …" first).
- **Flavour:** SM, Aeldari, Tyranid, CSM, AM and T'au units are tagged; Chapters have an
  `identity` (full flavour), Craftworlds / Hive Fleets / Legions an identity +
  signature units (`flavour: 0.5`; Gorgon, Night Lords 0.75); plain Tyranids have
  a light identity (0.3); other factions are value-first.
- **The user plays Tyranids and Chaos Space Marines** — tune those with them: show
  pick-frequency tables + example lists before committing.
- **Generator/costing:** combo boxes valued whole; paid-for spares fielded first;
  shared kits pooled; CP seeded round-robin; no battleline minimum; characters
  need a unit to lead + diminishing returns per HQ; leaders shown with their unit
  ("Attached units", `lib/attachments.ts`; `leads` order = pairing preference);
  squads roll for a Dedicated Transport by size × `Faction.transportChance`;
  god armies hide shared daemon datasheets unless "Include daemon datasheets";
  value boxes chosen by exhaustive cheapest combination; box-only byproducts
  (`isBoxOnly`) costed after the kits that credit them. Users can tune composition in Advanced
  settings.
- **Everything is committed and pushed** (`main`); the working tree is clean.

## Next steps (suggested, see TODO.md)
1. Flavour / sub-factions for more armies — e.g. Chaos Daemons by god (Khorne /
   Tzeentch / Nurgle / Slaanesh), Orks by clan, Astra Militarum regiments: tag
   units, add `identity`, check prices don't jump. Open CSM ideas in TODO.md.
2. Re-confirm the older best-effort kits (Necrons: Imotekh, Trazyn, Reanimator).
3. Low-priority factions (Imperial Agents, Deathwatch) and the Exodites once sold.
4. Features: competitive-list mode, list export / shareable URL, per-unit value.
