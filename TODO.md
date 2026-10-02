# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

Active factions (9): **Imperium** — Adeptus Custodes, Adepta Sororitas,
Adeptus Mechanicus; **Chaos** — Death Guard, Chaos Space Marines, Chaos Knights;
**Xenos** — Necrons, Tyranids, Aeldari.

## Data verification

**All 9 factions fine-tuned as of 2026-10-02** — full MFM rosters (points +
escalation + wargear), real en-EU kit prices, real Combat Patrols / value boxes,
and composition profiles. Remaining data work is just confirming the handful of
best-effort (`verified:false`) kit prices noted per faction below, on individual
product pages — mostly Forge World / not-currently-stocked kits that didn't load
in the (virtualised) store grid. Re-check everything periodically; GW points and
prices drift.

### Per-faction status
- **Adeptus Custodes — DONE (2026-10-02).** Full 31-datasheet MFM roster; prices
  verified for every GW-sold kit; Forge World / battle-group-only kits (Aquilon,
  Agamatus, Caladius, both FW Contemptors, Telemon, Pallas, Coronus, Anathema
  Rhino, Knight-Centura) stay best-effort. **GW discontinued the Custodes Combat
  Patrol** — only the heavy €180 Support Battle Group remains, so no value box
  (`ignoreSizeCap` lets its 200+pt troops field below 2000).
- **Adepta Sororitas — DONE (2026-10-02).** Full 33-datasheet MFM roster; prices
  verified for every GW-sold kit; the foot Canoness and the Seraphim/Zephyrim box
  aren't currently sold, so those stay best-effort. Combat Patrol (€139) contents
  confirmed on the product page (1 Canoness, 5 Sacresants, 10 Battle Sisters,
  10 Arco-flagellants).
- **Adeptus Mechanicus — DONE (2026-10-02).** Full 34-datasheet MFM roster; prices
  verified for every GW-sold kit (Tech-Priest Enginseer isn't stocked → best-effort;
  Cybernetica Datasmith comes in the Kastelan box via alsoBuilds). Combat Patrol
  (€139) contents confirmed (1 Manipulus, 3 Serberys Sulphurhounds, 5 Pteraxii
  Sterylizors, 10 Skitarii Vanguard).
- **Chaos Space Marines — DONE (2026-10-02).** Comprehensive ~41-unit roster from
  the 54-datasheet MFM (omitting terrain, cross-faction kits, newest niche
  sub-faction units). Prices verified on en-EU; shared Chaos vehicle kits reuse
  DG's verified prices; a few not surfaced in the grid are best-effort (Legionaries
  box, foot/jump Chaos Lords, Vindicator, Master of Possession). Combat Patrol
  (€139) contents confirmed (1 Master of Possession, 5 Possessed, 10 Legionaries,
  10 Cultists). TODO: confirm the best-effort kit prices on individual product pages.
- **Chaos Knights — DONE (2026-10-02).** Points for all 20 MFM datasheets verified;
  prices verified on en-EU. Active roster is the 12 affordable plastic/cheap units
  (6 Questoris-class Knights incl. the newly-added Ruinator, 5 War Dogs, Moirax);
  the 8 Forge World super-heavy Titans (€175–593 resin) are omitted on purpose —
  they have decent points-per-euro and would dominate the generator, breaking the
  "affordable above all" ethos (data in git history if ever wanted). No Combat
  Patrol exists.
- **Aeldari — DONE (2026-10-02).** Focused ~38-unit Craftworlds roster from the
  huge 76-datasheet MFM index (omitting Harlequins / Ynnari / Corsairs sub-factions,
  FW Titans and support platforms). Prices verified on en-EU where surfaced (aspect
  boxes €51.50, grav-tank kit €57.50 = Falcon/Fire Prism/Night Spinner); a few
  core kits not loaded in the virtualised grid are best-effort (Farseer, Spiritseer,
  Striking Scorpions, Wraith kits, Wraithknight, Vyper, War Walkers, Wave Serpent,
  Yriel, Asurmen). Combat Patrol (€139) contents confirmed. TODO: confirm the
  best-effort kit prices on individual product pages.
- **Necrons — DONE (2026-10-02).** Expanded to a ~34-unit roster from the
  52-datasheet MFM; prices RE-VERIFIED on en-EU (drift fixed: Warriors €42→43,
  Immortals €37→38.50, C'tan €105→107.50, CP €135→139, etc.). Canoptek Scarabs
  stay ≈ (not sold standalone); a few units best-effort (Imotekh, Trazyn,
  Reanimator). Re-added the Technomancer (it IS an MFM datasheet).
- **Tyranids — DONE (2026-10-02).** Expanded to a ~33-unit roster from the
  52-datasheet MFM (omitting the FW Bio-Titans); prices RE-VERIFIED on en-EU
  (drift fixed: Hive Tyrant/Warriors/Swarmlord €51.50→53, Trygon €76→80, Hive
  Guard €67→70, Zoanthropes €64→66, Exocrine €70→74, Horrors €87.50→93, CP
  €135→139). Ripper Swarms stay ≈ (bonus sprue, not sold standalone).
- **Death Guard — DONE (2026-10-02).** Full 35-datasheet MFM roster (incl. the
  Nurgle daemon units; Miasmic Malignifier terrain omitted); every kit price
  verified on en-EU. Combat Patrol "Maggot Lords" (€139) contents confirmed.

Known price drift spotted earlier: Combat Patrols €135 → **€139**; Termagants
€37 → €38.50; Carnifex/Screamer-Killer Brood €84 → €87; Necrons Royal Court
€105 → €107.50.

**Scraping tips.** MFM: the SPA holds all data in `document.body.textContent` —
normalise apostrophes, strip ▼▲, then read each unit's tier labels + size→pts
table (see git history / custodes.ts). GW store: the faction category page is
`warhammer.com/en-EU/shop/warhammer-40000/armies-of-the-imperium/<faction>` (or
`.../xenos-armies/...`); decline cookies, let the grid lazy-load, then read
name/price text lines. The grid can get throttled after heavy crawling, but
individual product pages keep working; en-FI also shows euros. Never solve GW
CAPTCHAs; space out crawling.

## Parked: Space Marines (Chapter system)
Space Marines were pulled from the MVP set — their Chapter system (Chapter
Tactics, chapter-specific characters and Combat Patrols) makes list-building and
data noticeably more complex. The data file is kept at `src/data/spaceMarines.ts`
(deregistered from `src/data/index.ts`). To bring them back:
- Decide how to handle Chapters (pick one, e.g. Ultramarines, or model Chapter
  choice as an option).
- There is **no generic Space Marines Combat Patrol** (GW discontinued it); only
  chapter-specific ones. Model a specific Chapter's box if that Chapter is added.
- Finish the box model-count checks cut short by GW's bot check: **Intercessor
  Squad** (set to 10 by inference — confirm + price), **Scout Squad** (size +
  price), **Outrider Squad** (size + price).
- Process note: never solve GW CAPTCHAs; space out crawling.

## Model / rules refinements
- **Multi-unit / combo boxes** whose extra units aren't in the roster aren't
  credited (e.g. Necrons Royal Court; the DG online "Chosen of Mortarion" box
  builds a Plaguecaster + Blightbringer + Champion but only the Plaguecaster is
  modelled, so a lone one reads as poor value).
- Optional: a **floor that skips very-low-value units** in the fill unless nothing
  better fits, to make cheap filler even rarer.

## Features / scope (backlog)
- Restore a **competitive-list** mode (curated event netlists) — `competitiveLists`
  data is still in the Necron/Tyranid files, just unused.
- **More factions** (the remaining official 40k armies) and more **units per
  faction** (the 9 current rosters are solid but not exhaustive).
- UI niceties: copy/export a list, shareable URL, per-box savings vs. buying
  single kits, show the points-per-euro value per unit.
