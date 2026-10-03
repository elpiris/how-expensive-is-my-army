# Architecture & dev notes

Onboarding map of the codebase for anyone continuing development. Pair this with
[README.md](README.md) (what it is / how to run) and [TODO.md](TODO.md) (per-faction
data status + backlog). Stack: **Vite + React + TypeScript**, no backend — it's a
pure client app over hand-curated data.

## Build gate

```bash
npm install
npx tsc --noEmit    # type-check (points/ids/categories are all type-checked)
npm run build       # vite production build
npm run dev         # local dev server on :5173
```
`npx tsc --noEmit` catches almost every data mistake (missing ids, bad category,
wrong field types). Always run it + `vite build` before committing.
Node is at `C:\Program Files\nodejs` (prefix `export PATH="/c/Program Files/nodejs:$PATH"`).

## Layout

```
src/
  types.ts            # the whole domain model (read this first)
  data/
    index.ts          # the faction registry (array + getFaction)
    <faction>.ts      # one file per faction (necrons, tyranids, custodes, …)
    spaceMarines/     # SM is special: shared base + one file per Chapter
      base.ts         #   baseUnits[], gettingStartedBox, darkAngelsCP
      vanilla.ts      #   Space Marines (no Chapter) = baseUnits
      ultramarines.ts #   compliant = [...baseUnits, ...unique]
      blackTemplars.ts#   non-compliant = baseUnits.filter(...) + unique + own CP
      …
  lib/
    value.ts          # points / points-per-euro / category helpers (pure)
    generateList.ts   # list generation (Quick + Escalation)
    costList.ts       # box optimisation, discounts, escalation purchase deltas
  App.tsx             # all UI (single file: controls, ListPanel, ShopPanel, views)
  styles.css
```

## Data model (`types.ts`)

- **`Faction`** — `id`, `name`, `category` (`imperium | space-marines | chaos | xenos`,
  drives dropdown optgroups), `chapter?` (`codex | non-codex`, SM Chapters only —
  groups the Chapter sub-selector), `profile?` (composition shape), `identity?`
  (`FactionIdentity`: tag → weight 1–3, what the faction is known for), `ignoreSizeCap?`,
  `pointsVerified?`, `lastVerified`, `blurb`, `units[]`, `valueBoxes[]`,
  `competitiveLists` (legacy, unused — kept `{}`).
- **`Unit`** — `id` (unique **within a faction**), `name`, `role`
  (`epic-hero|character|battleline|infantry|mounted|vehicle|monster|transport`),
  `points` (base/1st copy at `models` size), `pointsEscalated?` + `escalateAt?`
  (11th-ed escalating cost: the copy index — 2/3/4 — where the higher cost starts;
  default 3), `wargear?{name,points}` (single highest-cost option, folded into
  points + shown on the row), `models` (default unit size), `keywords?`, `flavor?`
  (1–5, biases generation), `tags?` (thematic `UnitTag`s: flamer, melta, bike, jump,
  terminator, gravis, phobos…), `exclusive?` (only this faction/Chapter can field it —
  set via `exclusive(unique)` in Chapter files), `leads?` (unit ids a character can lead), `transports?`
  (unit ids a transport can carry), `exclusiveGroup?` (mutex — at most one model
  across the group, e.g. the 3 Hive Tyrant variants), `epicHero?`, and `kit`.
- **`Kit`** — `name`, `priceEUR`, `models` (how many the box builds), `verified?`
  (true = confirmed on warhammer.com; false/absent → shows "≈ price"), `onlineOnly?`
  (webstore-exclusive → excluded from retailer discounts), `alsoBuilds?`
  (bonus units the same box yields, e.g. Necron Warriors box → 3 Scarabs — credited
  when costing), `url?`.
- **`ValueBox`** — a Combat Patrol / starter bundle; `builds[]` = `{unitId, models}`.
  The generator seeds `valueBoxes[0]`.
- **`FactionProfile`** — `Partial<Record<UnitCategory, number>>`; relative target
  **share of points** per category (normalised internally). **`UnitCategory`** =
  `character|infantry|mounted|vehicle|monster`; a Monster/Vehicle keyword outranks
  the Character keyword (so a Hive Tyrant counts as a monster, not an HQ).

## Value helpers (`lib/value.ts`, all pure)

- `unitCostEUR(u)` = `ceil(models/kit.models) * kit.priceEUR` (whole boxes).
- `unitPoints(u)` = base + wargear; `unitPointsEscalated(u)` = escalated + wargear.
- `escalateAt(u)` (default 3); `copyPoints(u, n)` = cost of the n-th copy (1-based);
  `copySurcharge(u, n)` = extra the n-th copy pays (shown as the gold "+N" row tag).
- `entryPoints(u, count)` = total for `count` copies applying the threshold.
- `pointsPerEuro(u)` = `unitPoints / unitCostEUR` — the core "value" metric.
- `unitCategory(u)` → the profile bucket; `isCharacter(u)` → UI grouping (by the
  CHARACTER keyword, not `role`).

## Generation (`lib/generateList.ts`)

`augmentList(faction, base, target, rand)` grows an entry list to `target` points
and is the shared core. `generateList` = augment from empty; `generateEscalation`
= augment 500→1000→1500→2000 carrying entries forward (each stage a superset).
Steps:
1. **Combat Patrol seed** — add `valueBoxes[0]` units cheapest-first within budget
   (a >bracket CP is fielded as a subset, rest deferred; CP units are size-cap exempt).
2. **Battleline backbone** — ≥100 pts of battleline per 1000.
3. **Leaders** — ~75% chance to give a leadable in-list unit a `leads` character
   (skipped once characters run past ~1.3× their profile share).
4. **Guarantee a character.**
5. **Value fill** — pick by `appeal(u, remaining, 3) * flavorBias * profileFactor`.

**Value ↔ Flavour** (`GenerateOptions.flavour`, 0..1; no UI — `defaultFlavour(faction)`
= 1 for factions with an `identity` (the SM Chapters), 0 otherwise):
`appeal = valueOf^(p·(1−f)) · themeScore^(1.5·p·f)` where
`valueOf` = points-per-euro (or the whole combo box's) and `themeScore` = `flavor/3 ×
(exclusive ? 3 : 1) × (1 + Σ identity[tag], max 6)`. Every weighted pick uses it (backbone,
leaders and character with p = 1; the fill with p = 3). f = 0 reproduces the original
pure-value generator. A user slider was tried and dropped (2026-10-03): over 300 seeds ×
4 brackets, full-flavour SM lists cost about the same as value ones (−4…+8% at 2000;
White Scars +17%), while untagged factions only got pricier (Custodes +47%).

Key rules/knobs:
- **Caps** — `DATASHEET_LIMIT` (1/2/3/3 per bracket, doubled for battleline/transport;
  always 1 at 500). Epic Heroes unique. Characters stricter (unique unless a sub-100pt
  leader has 2+ leadable units). `exclusiveGroup` mutex.
- **`SIZE_CAP`** (120/200/350/∞) excludes over-cost units outside the CP, unless
  `faction.ignoreSizeCap` (Custodes, Chaos Knights — elite/superheavy armies).
- **`nextCopyCost` / `copyPoints`** apply escalation; all budget checks use them.
- **`transportOK`** — a `role:'transport'` unit is only added while an uncovered
  carriable unit (`transports` list) is present (one unit per transport).
- **Combo boxes** — a kit whose `alsoBuilds` yields ≥1 complete unit of another
  datasheet (Horrors of the Hive, Heroes of the Chapter, Talons of the Emperor,
  Chosen of Mortarion, Kastelan+Datasmith, Warriors+Scarabs) is valued as the
  whole box (`valueOf`: all its units' points / price) and picking one unit adds
  its box-mates (`addPick`) — only when every mate is legal and the group fits the
  points left; otherwise the unit is valued/added alone. A box-only unit's `kit`
  IS that box (kit name ≠ unit name), with `alsoBuilds` listing the rest (e.g.
  Apothecary Biologis, Neurotyrant, Ripper Swarms → Termagants box); such units
  are only picked when their box-mates fit too (`comboOK`).
- **Use what you buy** — `fieldSpare` runs after the Combat Patrol and before every
  fill pick: anything `costList(...).spare` reports as paid-for but unfielded
  (unused value-box contents, kit leftovers, bonus `alsoBuilds` models) is fielded
  first as whole units, if legal and it fits — size-cap exempt, like CP units.
- **`profileFactor`** — gentle multiplier: >1 when a category is under its target
  share, easing to a floor when over. Soft on purpose (HQ-led armies still field
  1–2 big leaders). Unshaped factions (no `profile`) get factor 1.

## Costing (`lib/costList.ts`)

- `costList(list)` → `{lines, rrpTotalEUR, discountable/nonDiscountableEUR, notes}`.
  Computes model needs, greedily consumes value boxes while they pull their weight
  (cover ≥2 unit types AND euro-value ≥ box price), then covers the rest with
  individual kits (`ceil(models/kit.models)` whole boxes), crediting `alsoBuilds`
  bonus sprues and reporting surplus. A kit line's `covers` describes **one box**
  (the quantity column says how many) so it's correct in both the full and
  per-escalation-step views.
- `spare` — paid-for but unfielded models per datasheet (see "Use what you buy").
- Datasheets sharing a plain kit (no `alsoBuilds`) **pool** models into whole boxes
  (a €83 War Dogs box builds any 2 War Dogs); kits shared through `alsoBuilds`
  merge into one line whose `covers` lists everything the box builds.
- `discountedTotal(cost, pct)` — discount applies only to non-online-only lines.
- `purchaseDelta(prev, curr)` — new boxes per escalation step (quantities only rise).
- `sumLines(lines, pct)` — totals for an arbitrary line set.

## UI (`App.tsx`)

Single file. Two modes (**Quick list**, **Escalation**) via a segmented control.
Faction `<select>` renders `<optgroup>`s from `CATEGORY_ORDER` / `CATEGORY_LABELS`,
listing Space Marines once (the `space-marines` base faction). When an SM faction
is active, a **Chapter** `<select>` appears ("No specific Chapter" + Codex-compliant
/ Non-compliant groups from `faction.chapter`); `chapterId` remembers the last pick
so re-selecting Space Marines restores it. A new Chapter only needs `chapter` set.
`ListPanel` renders per-copy rows (points via `copyPoints`, wargear tag `.wg`,
escalation surcharge tag `.esc`), grouped Characters / Battleline / Other.
`ShopPanel` renders the buy list with per-line discounts (online-only struck/exempt).
`SummaryBar` (top) shows pay / RRP / cost-per-point. **Advanced settings**
(collapsed by default) renders `AdvancedSettings`: one slider per `UnitCategory`
present in the roster, defaulting to `faction.profile` (recommended value marked on
the track). Edits live in `customProfiles[factionId]` and are swapped into a copy of
the faction before generation; matching the recommendation again drops the override.
For factions with an `identity`, the composition panel also names what the
list favours (e.g. "White Scars favour bikes, speeders…").
Theming via CSS vars in
`styles.css` (dark only).

## Adding data

- **A unit:** add a `Unit` to a faction's `units`. Give `pointsEscalated`+`escalateAt`
  if it escalates, `wargear` for the top option, `leads`/`transports` for links.
- **A faction:** create `src/data/<faction>.ts` exporting a `Faction` (with `category`
  + optional `profile`), then register it in `src/data/index.ts`.
- **A Space Marine Chapter:** add `src/data/spaceMarines/<chapter>.ts` =
  `[...baseUnits, ...unique]` (compliant) or a filtered base + unique (non-compliant),
  reuse `gettingStartedBox`/`darkAngelsCP` or add the Chapter's own box, register it.
- **Value box:** add a `ValueBox` to `valueBoxes` (its `builds` reference unit ids),
  or `[]` if the faction has none.

## Data-gathering recipe (how the data was sourced)

- **Points — MFM** (`mfm.warhammer-community.com/en/<faction>`, an SPA): read
  `document.body.textContent`, normalise apostrophes, strip ▼▲, then for each unit
  name grab the following ~150 chars to read its cost-tier labels + size→pts table.
  Labels map to escalation: `YOUR UNIT COSTS` = flat; `1ST TO 2ND / 3RD+` = escalateAt
  3; `1ST / 2ND+` = escalateAt 2; `1ST TO 3RD / 4TH+` = escalateAt 4.
- **Prices + Combat Patrols — warhammer.com en-EU**: category page
  `.../shop/warhammer-40000/{armies-of-the-imperium|xenos-armies|armies-of-chaos|
  space-marines}/<faction>`. Decline cookies, scroll to lazy-load, read name/price
  text lines. Confirm value-box contents on the product page (expand "Read More").
  The grid virtualises — some items never load; those get best-effort (`verified:false`).
  The **Space Marines** store grid virtualises especially hard. Never solve CAPTCHAs;
  space out crawling; en-FI also shows euros. **Preferred for prices:** generate a
  checklist CSV (unit id, kit name, models/box, current price, blank new price) and
  have the user fill it in by hand — far more reliable than scraping (this is how
  every SM price was verified on 2026-10-03). Product pages are still fine for
  reading a box's contents. MFM *points* the agent can read itself (the units
  list renders in a container whose textContent starts `UNITS…`).

## Known limitations (see TODO.md for specifics)

- Some kit prices are best-effort estimates (`verified:false` → "≈").
- Per-faction verification status, the remaining best-effort prices, more SM Chapters,
  and backlog features (competitive mode, shareable URL/export, per-unit value display)
  are all tracked in TODO.md.
