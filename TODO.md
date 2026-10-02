# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

Active factions (9): **Imperium** — Adeptus Custodes, Adepta Sororitas,
Adeptus Mechanicus; **Chaos** — Death Guard, Chaos Space Marines, Chaos Knights;
**Xenos** — Necrons, Tyranids, Aeldari.

## Data verification (highest priority — accuracy)

### New factions: verify best-effort prices + Combat Patrol contents
Fine-tune each 2026-10-02 faction against warhammer.com: set real `priceEUR` +
drop the `verified:false` flag, confirm the Combat Patrol units/price, and
sanity-check box model-counts + shared-kit mappings.
- **Adeptus Custodes — DONE (2026-10-02).** Full 31-datasheet MFM roster; prices
  verified for every GW-sold kit; Forge World / battle-group-only kits (Aquilon,
  Agamatus, Caladius, both FW Contemptors, Telemon, Pallas, Coronus, Anathema
  Rhino, Knight-Centura) stay best-effort (not sold standalone). **GW discontinued
  the Custodes Combat Patrol** — only the heavy €180 Support Battle Group remains,
  so the faction has no value box (`ignoreSizeCap` lets its 200+pt troops field
  below 2000).
- **Still best-effort (MFM points only):** Adepta Sororitas, Adeptus Mechanicus,
  Chaos Space Marines, Chaos Knights, Aeldari.

### Refresh prices across all kits
Necron & Tyranid kit prices are mostly still at their **2026-09-10** values and
have already been seen to drift (e.g. Necron Warriors €42 → €43 on 2026-10-01).
Do a fresh pass over warhammer.com and update every `priceEUR`, bumping each
faction's `lastVerified`. Death Guard prices were verified 2026-10-01 (en-FI).
- Known drift spotted: Combat Patrols €135 → **€139**; Termagants €37 → €38.50;
  Carnifex/Screamer-Killer Brood €84 → €87; Necrons Royal Court €105 → €107.50.
- Re-confirm the `≈`-flagged kit prices and drop the badge once set: Necron
  Scarabs and Tyranid Ripper Swarms — both are placeholder prices for units not
  sold on their own (they come bundled in other boxes / the Combat Patrol).
- **Tip:** the per-faction store grid can get throttled after heavy crawling, but
  individual product pages keep working; the **en-FI** store also shows euros and
  loaded when en-EU's grid didn't.

### Confirm a few assumed Death Guard box sizes
DG points/keywords/leaders and prices are verified, but these box model-counts
were assumed from standard GW sizes (not read off the product page): Poxwalkers
(10), Plaguebearers (10), Blightlord Terminators (5). Deathshroud (3) and Plague
Marines (7) are confirmed.

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
