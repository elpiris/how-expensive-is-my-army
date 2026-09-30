# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

## Data verification (highest priority — accuracy)

### Refresh prices across all kits
Individual kit prices are mostly still at their **2026-09-10** values and have
already been seen to drift. Do a fresh pass over warhammer.com (EU) and update
every `priceEUR`, bumping each faction's `lastVerified`.
- Known drift already spotted (some updated in data, some not): Combat Patrols
  €135 → **€139**; Termagants €37 → **€38.50**; Carnifex/Screamer-Killer Brood
  €84 → **€87**; Necrons Royal Court €105 → **€107.50**.
- Re-confirm the `≈`-flagged (unverified) kit prices and drop the badge once set:
  Necron Scarabs (placeholder); SM Intercessors, Scout Squad, Outriders,
  Apothecary Biologis, Lieutenant; Tyranid Neurotyrant, Ripper Swarms.

### Finish the Space Marines box model-count verification
The box-count audit (2026-09-30) was cut short by GW's "Human Verification" bot
check. Still to confirm on the product pages:
- **Intercessor Squad** — set to a 10-model box by *inference* (its siblings
  Assault Intercessors / Hellblasters / Infernus are confirmed 10). Confirm
  directly, and confirm its price (currently an unverified €50).
- **Scout Squad** — box size (currently modelled as 5) and price (unverified €30).
- **Outrider Squad** — box size (currently 3) and price (unverified €50).

**Process notes:** never solve GW CAPTCHAs; space out warhammer.com crawling to
avoid tripping the bot check. Product model counts are often spelled out as words
("ten Necron Warriors") and the base count ("ten Citadel … Bases") is a reliable
proxy; watch for bonus sprues (e.g. Necron Warriors → +3 Scarabs).

## Model / rules refinements
- **11th-ed escalating unit cost** (3rd+ copy of a datasheet costs more) is not
  modelled — the tool uses the flat base cost, so lists with 3 of a datasheet
  read a few points low.
- **Multi-unit boxes** whose bonus units aren't in the roster (e.g. Necrons Royal
  Court builds Skorpekh Lord / Plasmancer / Cryptothralls / Reanimator) aren't
  credited. Would need those units added to the dataset.
- Optional: a **floor that skips very-low-value units** in the fill unless nothing
  better fits, to make cheap filler (e.g. Ripper Swarms) even rarer.

## Features / scope (backlog)
- Restore a **competitive-list** mode (curated event netlists) — the
  `competitiveLists` data is still in the faction files, just unused.
- **More factions** (the other ~22 official 40k armies).
- More **units per faction** (current rosters are a curated subset).
- **Space Marines Combat Patrol**: none exists for the generic/Ultramarines
  roster (GW discontinued it). If a specific Chapter with a Combat Patrol is
  added (Dark Angels, Blood Angels, …), model that box.
- UI niceties: copy/export a list, shareable URL, per-box savings vs. buying
  single kits, show the points-per-euro value per unit.
