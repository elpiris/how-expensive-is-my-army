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
- **Sub-faction checks:** the same throwaway-script approach, run over the base
  faction and its sub-factions: integrity + € per bracket + a "% of 2000-pt lists per
  unit" table + a couple of example lists. Show the user that table and examples
  before committing tuning (that's how every sub-faction was signed off).
- **Vite caches files edited in quick succession:** after editing data/lib files,
  `touch` them before checking in the browser — a stale module once hid a cap that
  was correct on disk (and an empty `base.ts` was cached mid-edit before).
- **Deploys:** every push to `main` redeploys the live site on Netlify (~1 min). Check
  the live bundle carries the new commit (`APP_VERSION` = version + commit) before
  testing there.

## Conventions
- Match the existing data-file style (header comment noting sources + dates; bump
  `lastVerified`). Keep `competitiveLists: {}` (legacy/unused).
- Don't reintroduce the deleted `src/data/spaceMarines.ts` — SM is now the
  `spaceMarines/` folder.
- End commit messages with:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## Current state (2026-10-09, end of session)
- **Live** at <https://howexpensiveismyarmy.netlify.app/> (Netlify, public). In-app
  **feedback** (👍/👎 per list + general) lands in a Supabase `feedback` table that
  only accepts anonymous inserts — the user reads it in the Supabase dashboard; each
  row has faction / mode / points / stage / seed so the list can be regenerated
  (setup + reading guide in DEPLOY.md). Free Supabase projects pause after ~1 week
  idle (Restore in the dashboard).
- **Factions:** 21 non-SM factions + Space Marines, all with full MFM rosters (FW /
  terrain left out), verified en-EU prices (a handful of kitbash / Kill-Team-only
  units stay "≈"), real value boxes (Combat Patrols, Battleforces, combo boxes such as
  Necron Royal Court / Canoptek Circle, Huron + Masters, Venomcrawler + Obliterators)
  and composition profiles. Tyranids, CSM and Necrons were completed from the MFM
  this session. **Missing (low priority):** Imperial Agents, Deathwatch.
- **Sub-factions — complete** (`parent` + a second dropdown, alphabetical, "No
  specific …" first): SM Chapters (10), Aeldari Craftworlds (5), Tyranid Hive Fleets
  (7), CSM Legions (6), AM Regiments (5), T'au Septs (5), Drukhari forces (3), Ork
  Clans (7), Sororitas Orders (4), Necron Forces (3), Mechanicus Forces (2), Custodes
  Forces (3), Chaos Daemon Gods (4). Two patterns:
  - *Exclusive* (lore splits the roster): Legions, Regiments, Septs (only Shadowsun /
    Farsight), Daemon Gods — the helper drops other sub-factions' units and their
    `leads` / `transports` links; plain faction keeps everything.
  - *Favoured only* (same models, different style): Craftworlds, Hive Fleets,
    Drukhari, Clans, Orders, Necron / Mechanicus / Custodes Forces — `identity` tag
    weights + `signature` units + own profile, `flavour` 0.5 (0.75 where the themed
    units are poor value: Gorgon, Night Lords, Kroot, Talons).
  The rest (Knights, Grey Knights, Votann, GSC, DG/WE/EC/TS) were judged not worth
  splitting (TODO.md). The god armies instead have an "Include daemon datasheets"
  checkbox (off by default).
- **Tuning tools** (use these, not new mechanisms): `exclusiveGroup` = one per army
  across a family (Norns, Tervigon, Masters of the Maelstrom, AM super-heavies, Ork
  big walkers, Stormsurge, Obelisk); `pickWeight` = rarer in the value fill (huge or
  absurdly cheap models that made armies look cheap: Stompa 0.03, Deceiver 0.03,
  super-heavies 1/8, Stormsurge 0.2, Obelisk 0.08; sub-faction overrides via
  `PICK_WEIGHT`); `profile` shares (drop a category to stop it being filled, e.g.
  Slaanesh vehicles); `flavor` rating; `boxOnly` override.
- **Generator/costing:** combo boxes valued whole; paid-for spares fielded first;
  shared kits pooled; CP seeded only when the faction can field all of it; no
  battleline minimum; characters need a unit to lead + diminishing returns per HQ;
  leaders + transports shown with their unit ("Attached units", `lib/attachments.ts`;
  `leads` order = pairing preference); squads roll for a Dedicated Transport by size ×
  `Faction.transportChance`, preferring cheap rides (Rhino over Land Raider) and the
  sub-faction's taste; value boxes chosen by exhaustive cheapest combination;
  box-only byproducts (`isBoxOnly`) costed after the kits that credit them; Spore
  Mines from Biovores / Sporocysts aren't counted (spawned in game).
- **The user plays Tyranids and Chaos Space Marines** (and knows the rules well):
  defer to their calls there; show frequency tables + example lists first.
- **Everything is committed and pushed** (`main`); the working tree is clean.

## Next steps (suggested, see TODO.md)
1. Watch the incoming feedback (Supabase → Table Editor → `feedback`) and tune the
   lists people downvote — reproduce them from the row's faction / points / seed.
2. Re-confirm prices / points periodically (they drift); `lastVerified` per faction.
3. Open ideas in TODO.md: CSM (Obliterators' daemon tag in Word Bearers, one Daemon
   Prince per army?, Black Legion psykers, Haarken), transport carry-list review.
4. Low-priority factions (Imperial Agents, Deathwatch), the Exodites once sold.
5. Features: list export / shareable URL (feedback already stores seeds), competitive
   mode, per-unit value display.
