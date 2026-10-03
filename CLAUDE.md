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

## Conventions
- Match the existing data-file style (header comment noting sources + dates; bump
  `lastVerified`). Keep `competitiveLists: {}` (legacy/unused).
- Don't reintroduce the deleted `src/data/spaceMarines.ts` — SM is now the
  `spaceMarines/` folder.
- End commit messages with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Current state (2026-10-03, night)
- **Factions:** 20 non-SM factions + Space Marines, all with full MFM rosters (FW /
  terrain / discontinued kits left out), verified en-EU prices, real value boxes and
  composition profiles. Imperium: Custodes, Sororitas, Mechanicus, Astra Militarum,
  Imperial Knights, Grey Knights. Chaos: Death Guard, CSM, Chaos Knights, Emperor's
  Children, World Eaters, Thousand Sons, Chaos Daemons. Xenos: Necrons, Tyranids,
  Aeldari, T'au, Votann, GSC, Drukhari. **Missing:** Orks;
  Imperial Agents + Deathwatch are low priority.
- **Sub-factions** (`parent` + a second dropdown): 10 SM Chapters (6 Codex + DA, BT,
  SW, BA; generic SM boxes incl. DA CP, Heroes / Honoured of the Chapter) and 5
  Aeldari Craftworlds.
- **Flavour:** SM units + Aeldari are tagged; Chapters have an `identity` (full
  flavour), Craftworlds an identity + signature characters (`flavour: 0.5`); other
  factions are value-first.
- **Generator/costing:** combo boxes valued whole; paid-for spares fielded first;
  shared kits pooled; CP seeded round-robin. Users can tune composition in Advanced
  settings.
- **Backlog:** remaining factions, competitive mode, export/shareable URL (TODO.md).
