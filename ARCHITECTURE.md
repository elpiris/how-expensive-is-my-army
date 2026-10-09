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
    <faction>.ts      # one file per faction (16: custodes … chaosDaemons, aeldari)
    craftworlds.ts    # Aeldari Craftworld sub-factions ({...aeldari, parent, identity})
    hiveFleets.ts     # Tyranid Hive Fleet sub-factions (same pattern)
    legions.ts        # CSM Legions (same pattern + legion-only units removed from the others)
    regiments.ts      # AM Regiments (same as legions + BORROWS / PICK_WEIGHT overrides)
    septs.ts          # T'au Septs (same pattern + PICK_WEIGHT overrides)
    drukhariForces.ts # Drukhari Kabal / Wych Cult / Coven (favoured only, like Craftworlds)
    clans.ts          # Ork Clans (favoured only)
    orders.ts         # Sororitas Orders (favoured only)
    necronForces.ts   # Necron Forces (favoured only)
    mechanicusForces.ts # Mechanicus Skitarii / Cult (favoured only)
    custodesForces.ts # Custodes Shield Host / Talons / Solar Spearhead (favoured only)
    daemonGods.ts     # Daemon Gods (exclusive; undivided units at pickWeight 0.3)
    spaceMarines/     # SM is special: shared base + one file per Chapter
      base.ts         #   baseUnits[], exclusive(), gettingStartedBox, darkAngelsCP,
                      #   heroesOfTheChapter, honouredOfTheChapter
      vanilla.ts      #   Space Marines (no Chapter) = baseUnits
      ultramarines.ts #   compliant = [...baseUnits, ...exclusive(unique)]
      blackTemplars.ts#   non-compliant = baseUnits.filter(...) + exclusive(unique) + own CP
      …
  lib/
    value.ts          # points / points-per-euro / category helpers (pure)
    generateList.ts   # list generation (Quick + Escalation)
    attachments.ts    # leader ↔ unit matching (generator leaderOK + "Attached units" view)
    costList.ts       # box optimisation, discounts, escalation purchase deltas
  App.tsx             # all UI (single file: controls, ListPanel, ShopPanel, views)
  styles.css
```

## Data model (`types.ts`)

- **`Faction`** — `id`, `name`, `category` (`imperium | space-marines | chaos | xenos`,
  drives dropdown optgroups), `chapter?` (`codex | non-codex`, SM Chapters only —
  groups the Chapter sub-selector), `profile?` (composition shape), `identity?`
  (`FactionIdentity`: tag → weight 1–3, what the faction is known for), `signature?`
  (unit ids the sub-faction is famous for — same flavour bonus as `exclusive`),
  `parent?` (base faction id → this is a sub-faction, shown in the second dropdown),
  `subfactionLabel?` (on a base: "Chapter" / "Craftworld" / "Hive Fleet"), `flavour?` (value↔flavour
  balance override, see Generation), `ignoreSizeCap?`,
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
1. **Combat Patrol seed** — add `valueBoxes[0]` units round-robin (one copy of each
   box unit, cheapest first, before any second copies) within budget, so a partly
   fielded CP still covers most of its unit types; the rest is deferred to a bigger
   bracket. CP units are size-cap exempt.
2. **Leaders** — `LEADER_CHANCE` (50%) × `hqDecay` chance to give an unled in-list
   unit a `leads` character (skipped once characters run past ~1.3× their profile
   share).
3. **Guarantee a character** (one with a unit to lead, if possible).
4. **Value fill** — pick by `appeal(u, remaining, 3) * flavorBias * profileFactor *
   characterDecay`.

There is **no battleline minimum** (removed 2026-10-03 — lists ran battleline-heavy):
battleline competes on value / flavour like any unit (it keeps its doubled cap).

**Value ↔ Flavour** (`GenerateOptions.flavour`, 0..1; no UI — `defaultFlavour(faction)`
= `faction.flavour` if set (Aeldari Craftworlds, Hive Fleets: 0.5; Gorgon 0.75), else 1 for factions with an
`identity` (the SM Chapters), 0 otherwise):
`appeal = valueOf^(p·(1−f)) · themeScore^(1.5·p·f)` where
`valueOf` = points-per-euro (or the whole combo box's) and `themeScore` = `flavor/3 ×
(exclusive ? 3 : 1) × (1 + Σ identity[tag], max 6)`. Every weighted pick uses it (
leaders and character with p = 1; the fill with p = 3). f = 0 reproduces the original
pure-value generator. A user slider was tried and dropped (2026-10-03): over 300 seeds ×
4 brackets, full-flavour SM lists cost about the same as value ones (−4…+8% at 2000;
White Scars +17%), while untagged factions only got pricier (Custodes +47%).

Key rules/knobs:
- **Caps** — `DATASHEET_LIMIT` (1/2/3/3 per bracket, doubled for battleline/transport;
  always 1 at 500). Epic Heroes unique. Characters stricter (unique unless a sub-100pt
  leader has 2+ leadable units). `exclusiveGroup` mutex.
- **`SIZE_CAP`** (120/200/350/∞) excludes over-cost units outside the CP, unless
  `faction.ignoreSizeCap` (Custodes, Chaos Knights, Imperial Knights —
  elite/superheavy armies).
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
- **Transports** (`rideCheck`, 2026-10-04) — each squad that can ride rolls once
  for a Dedicated Transport as it enters the list: chance =
  `Faction.transportChance` (default 0.35) × (squad + leader points ÷ 250), capped
  at 90%; a leader joining later rolls again for the difference only. The
  ride is mostly the cheapest that can carry it and fits (weight (cheapest /
  cost)^3 — Rhinos over Land Raiders, flavour over value — × the sub-faction's
  themeScore^(1.5·flavour), so Sacred Rose favours Immolators); transports get only
  0.15× weight in the value fill; a second big transport (≥150 pts) is a 20%
  chance, even when it's the only ride (Terminators). Bases: Orks / Drukhari 0.6, Marines / CSM / DG /
  WE / EC / Sororitas 0.5, Necrons 0.25, Custodes 0.2, Tyranids 0.1; Steel Legion
  0.9, Saim-Hann 0.6, Night Lords 0.3, Catachan / Krieg 0.25. The list view shows
  leader + unit + transport together (`attachAll`).
- **Daemon allies** (`data/index.ts`: `daemonAllyIds` / `withoutDaemonAllies`) — the
  god-aligned armies' datasheets shared with Chaos Daemons (matched by name; their
  own Daemon Princes excepted) are removed unless the user ticks "Include daemon
  datasheets" (App, per base faction, off by default): the rules only allow them in
  a specific detachment, a concept the app leaves out.
- **`pickWeight`** (Unit, default 1) — multiplier on the value-fill weight, for a
  family of datasheets that would each get their own chance (the 8 AM super-heavies
  at 1/8 share one chance). The Combat Patrol is only seeded when the faction can
  field every unit in it (a sub-faction may exclude some).
- **`profileFactor`** — gentle multiplier: >1 when a category is under its target
  share, easing to a floor when over. Soft on purpose (HQ-led armies still field
  1–2 big leaders). Unshaped factions (no `profile`) get factor 1.
- **Character brakes** (count-based — a points share can't tell one big hero from
  six cheap HQs; added 2026-10-03, 2000-pt lists went from ~5–7 characters to ~3–4.5):
  - `leaderOK` — a character with a `leads` list is only added (leaders step,
    guarantee, fill) if it grows the maximum leader↔bodyguard matching, i.e. some
    unit it can lead is still unled (one leader per unit). Characters that lead
    nothing (Daemon Princes, Knights, C'tan, lone operatives) are unaffected; CP
    units, spares and combo box-mates are exempt (already bought).
  - `characterDecay` — each `character`-category unit already in the list multiplies
    the next one's weight by `CHARACTER_DECAY` (0.5). Monster / vehicle characters
    aren't counted or decayed. Tune `CHARACTER_DECAY` / `LEADER_CHANCE` to taste.

## Costing (`lib/costList.ts`)

- `costList(list)` → `{lines, rrpTotalEUR, discountable/nonDiscountableEUR, notes}`.
  Computes model needs, tries every combination of value boxes (each covering ≥2
  needed unit types; 0…3 of each, ≤256 combos) and keeps the cheapest total
  (exhaustive since 2026-10-04 — the old greedy estimate mis-priced combo kits and
  let a Battleforce beat a cheaper Combat Patrol), then covers the rest with
  individual kits (`ceil(models/kit.models)` whole boxes), crediting `alsoBuilds`
  bonus sprues and reporting surplus. A kit line's `covers` describes **one box**
  (the quantity column says how many) so it's correct in both the full and
  per-escalation-step views.
- `spare` — paid-for but unfielded models per datasheet (see "Use what you buy").
- Kits with `alsoBuilds` are costed before the units they credit: units sold as
  themselves first, then box-only ones (`isBoxOnly` — kit name ≠ unit name unless
  `Unit.boxOnly` says otherwise, e.g. the Biovore in the "Biovore and Pyrovore"
  kit), so a Sporocyst's 6 Spore Mines are credited before Spore Mines buy boxes.
- Datasheets sharing a plain kit (no `alsoBuilds`) **pool** models into whole boxes
  (a €83 War Dogs box builds any 2 War Dogs); kits shared through `alsoBuilds`
  merge into one line whose `covers` lists everything the box builds.
- `discountedTotal(cost, pct)` — discount applies only to non-online-only lines.
- `purchaseDelta(prev, curr)` — new boxes per escalation step (quantities only rise).
- `sumLines(lines, pct)` — totals for an arbitrary line set.

## UI (`App.tsx`)

Single file. Two modes (**Quick list**, **Escalation**) via a segmented control.
Faction `<select>` renders `<optgroup>`s from `CATEGORY_ORDER` / `CATEGORY_LABELS`,
listing only base factions (no `parent`), alphabetically within each group. When the
active faction has sub-factions (factions whose `parent` is it), a second `<select>`
labelled by the base's `subfactionLabel` appears — "Chapter" for Space Marines
(grouped Codex-compliant / Non-compliant via `chapter`), "Craftworld" for Aeldari —
with "No specific …" first and the sub-factions alphabetical (`subfactionsOf`).
`lastSub` remembers the last pick per base. A new sub-faction just needs `parent` set.
The app opens on `factions[0]` (Adeptus Custodes).
`ListPanel` renders per-copy rows (points via `copyPoints`, wargear tag `.wg`,
escalation surcharge tag `.esc`), grouped Attached units (each leader + the unit it
leads, via `attachLeaders`; priciest leaders pick first) / Characters / Battleline / Other.
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
  `[...baseUnits, ...exclusive(unique)]` (compliant) or a filtered base + unique
  (non-compliant), with `parent: 'space-marines'`, `chapter: 'codex' | 'non-codex'`,
  an `identity` and a `profile`; reuse the generic boxes (Getting Started, DA CP,
  Heroes / Honoured of the Chapter) or add the Chapter's own CP first; register it.
- **Another sub-faction** (e.g. a Craftworld): `{ ...base, id, name, parent: base.id,
  identity, signature?, profile?, flavour? }` — see `craftworlds.ts`; register it.
- **Shared kits:** datasheets built from the same box share an identical `kit`
  (name/price/models) and get pooled when costing. A box-only unit whose box also
  builds other datasheets uses that box as its kit with `alsoBuilds` (combo box).
- **Value box:** add a `ValueBox` to `valueBoxes` (its `builds` reference unit ids),
  or `[]` if the faction has none.

## Data-gathering recipe (how the data was sourced)

- **Points — MFM** (`mfm.warhammer-community.com/en/<faction>`, an SPA): the units
  list renders in the container whose textContent starts `UNITS…`. Walk its leaf
  text nodes; each unit starts at the capitalised name before a `YOUR UNIT COSTS` /
  `YOUR 1ST…` label (allow accented capitals — Khârn); read the size→pts pairs and
  the `LEADER` / `SUPPORT` lists. Labels map to escalation: `YOUR UNIT COSTS` = flat;
  `1ST TO 2ND / 3RD+` = escalateAt 3; `1ST / 2ND+` = escalateAt 2; `1ST TO 3RD / 4TH+`
  = escalateAt 4. Section headers (e.g. "HARLEQUINS", "YNNARI") mark sub-rosters.
- **Prices + Combat Patrols — warhammer.com en-EU**: category page
  `.../shop/warhammer-40000/{armies-of-the-imperium|xenos-armies|armies-of-chaos|
  space-marines}/<faction>`. Decline cookies, scroll to lazy-load, read name/price
  text lines. Confirm value-box contents on the product page (expand "Read More").
  The grid virtualises — some items never load; those get best-effort (`verified:false`).
  The **Space Marines** store grid virtualises especially hard. Never solve CAPTCHAs;
  space out crawling; en-FI also shows euros. **Preferred for prices:** pre-fill what
  the grid shows, then ask the user **one kit at a time in chat** (price / "ok" / box
  size / which datasheets the box builds) — far more reliable than scraping; this is
  how every faction added on 2026-10-03 was priced. Product pages are still fine for
  reading a box's contents.

## Known limitations (see TODO.md for specifics)

- Some kit prices are best-effort estimates or kitbash proxies (`verified:false` → "≈").
- Forge World resin, terrain and discontinued kits are deliberately left out.
- Units use their default (smallest) size; optional costed upgrades beyond the one
  `wargear` option aren't modelled.
- Per-faction status, the low-priority missing factions (Imperial Agents,
  Deathwatch) and backlog features (competitive mode,
  shareable URL/export, per-unit value display) are tracked in TODO.md.
