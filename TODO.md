# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

Active factions (9): **Imperium** — Adeptus Custodes, Adepta Sororitas,
Adeptus Mechanicus; **Chaos** — Death Guard, Chaos Space Marines, Chaos Knights;
**Xenos** — Necrons, Tyranids, Aeldari.

## Data verification (highest priority — accuracy)

Fine-tune each faction against the current MFM + warhammer.com: pull the **full**
datasheet roster with MFM points (escalation thresholds + highest-cost wargear),
set real kit `priceEUR` and drop the `verified:false` flag, and confirm the real
Combat Patrol / value box (units + price) — or set `valueBoxes: []` if GW no
longer sells one. Bump each faction's `lastVerified`.

### Per-faction status
- **Adeptus Custodes — DONE (2026-10-02).** Full 31-datasheet MFM roster; prices
  verified for every GW-sold kit; Forge World / battle-group-only kits (Aquilon,
  Agamatus, Caladius, both FW Contemptors, Telemon, Pallas, Coronus, Anathema
  Rhino, Knight-Centura) stay best-effort. **GW discontinued the Custodes Combat
  Patrol** — only the heavy €180 Support Battle Group remains, so no value box
  (`ignoreSizeCap` lets its 200+pt troops field below 2000).
- **Adepta Sororitas — TODO.** Points MFM-verified (curated ~17 units); **prices
  best-effort**, roster not yet full, Combat Patrol contents approximate.
- **Adeptus Mechanicus — TODO.** Same as Sororitas (curated ~16 units).
- **Chaos Space Marines — TODO.** Same (curated ~17 units).
- **Chaos Knights — TODO.** Same (10 units; superheavy, no Combat Patrol).
- **Aeldari — TODO.** Same (curated ~17 units).
- **Necrons — prices PENDING refresh.** Points verified (Wahapedia→MFM); kit
  prices mostly still at **2026-09-10** values and seen to drift (Necron Warriors
  €42→€43). Re-confirm `≈` placeholders (Canoptek Scarabs — not sold standalone).
- **Tyranids — prices PENDING refresh.** Same as Necrons (2026-09-10 prices);
  re-confirm `≈` Ripper Swarms (not sold standalone).
- **Death Guard — prices verified 2026-10-01 (en-FI).** Recheck periodically.
  Assumed box model-counts (not read off the page): Poxwalkers (10), Plaguebearers
  (10), Blightlord Terminators (5); Deathshroud (3) + Plague Marines (7) confirmed.

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
