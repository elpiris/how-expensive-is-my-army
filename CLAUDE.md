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
  heavily and scraping it is unreliable — **for price checks, generate a checklist
  CSV (unit id, kit name, models/box, current price) and ask the user to fill it
  in by hand**, then apply it. MFM points can still be read in the browser pane.
  Never solve GW CAPTCHAs. Warhammer points/prices drift — re-check periodically.

## Conventions
- Match the existing data-file style (header comment noting sources + dates; bump
  `lastVerified`). Keep `competitiveLists: {}` (legacy/unused).
- Don't reintroduce the deleted `src/data/spaceMarines.ts` — SM is now the
  `spaceMarines/` folder.
- End commit messages with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Current state (2026-10-03, evening)
9 non-SM factions fully fine-tuned (full MFM rosters, verified en-EU prices, real
value boxes, composition profiles). Space Marines added with a Chapter system (own
dropdown group): base + 6 Codex-compliant (UM, IF, Sal, IH, WS, RG) + 4
non-compliant (DA, BT, SW, BA) Chapters, with own CPs for DA/BT/SW/BA (the
generic-units DA CP + Heroes of the Chapter are offered to every Chapter). The SM
base roster is the full generic MFM list (68 datasheets, exact tiers); every kit
price is hand-verified (2026-10-03). Combo boxes are valued
whole and everything bought is fielded when possible. Users can tune composition
via Advanced settings. SM units carry thematic `tags` and each Chapter an `identity`;
Chapter lists are generated for flavour (factions without an identity stay value-first). Chapters are picked in a
Chapter sub-selector shown when Space Marines is chosen. Main backlog: competitive
mode, export/shareable URL.
