# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

Active dropdown groups (`Faction.category`): **Imperium** (Custodes, Sororitas,
Mechanicus, Astra Militarum), **Space Marines** (11 entries: no-Chapter + Ultramarines, Imperial
Fists, Salamanders, Iron Hands, White Scars, Raven Guard, Dark Angels, Black
Templars, Space Wolves, Blood Angels), **Chaos** (Death
Guard, Chaos Space Marines, Chaos Knights), **Xenos** (Necrons, Tyranids, Aeldari).
New-architecture overview is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Data verification

**The 9 non-SM factions are fully fine-tuned (2026-10-02)** — full MFM rosters
(points + escalation + wargear), real en-EU kit prices, real Combat Patrols / value
boxes, composition profiles. **Space Marines (2026-10-03)** — the full generic MFM
roster (68 datasheets, every escalation tier + leader list) plus 10 Chapters; every
kit price hand-verified on en-EU 2026-10-03. Remaining data work = confirming the best-effort
(`verified:false`) kit prices on individual product pages. Re-check periodically.

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

## Space Marines + Chapters (2026-10-03)
Modelled as a **shared base Codex roster** (`spaceMarines/base.ts`, 68 generic datasheets — the whole MFM list minus the Forge World Thunderhawk)
reused by each Chapter, which is its own `Faction` entry under Imperium:
- **Base (no Chapter):** `space-marines`, value boxes = Getting Started with Space
  Marines (€139: Captain, Librarian, 5 Intercessors, 5 Vanguard, Land Speeder) and
  the **Dark Angels Combat Patrol**, which holds only generic units (Gravis Captain,
  3 Bladeguard, 5 Hellblasters, 10 Intercessors) and so is offered to EVERY Chapter,
  as is **Heroes of the Chapter** (€93: Lieutenant, Apothecary Biologis, 5 Sternguard).
- **Codex-compliant (base + unique characters):** Ultramarines (Guilliman, Calgar,
  Tigurius, Victrix Guard), Imperial Fists (Lysander, Tor Garadon), Salamanders
  (Vulkan He'stan, Adrax Agatone), Iron Hands (Caanok Var, Iron Father Feirros),
  White Scars (Kor'sarro Khan, Suboden Khan), Raven Guard (Kayvaan Shrike, Aethon
  Shaan) — all use the generic value boxes (Getting Started, DA CP, Heroes).
- **Non-compliant:** Dark Angels (+Deathwing/Ravenwing, Lion; DA CP first),
  Black Templars (base MINUS Psykers/Librarians, +Crusaders/Sword Brethren/Emperor's
  Champion; own CP + DA CP, no Getting Started — it has a Librarian), Space Wolves
  (+Grey Hunters/Blood Claws/Wulfen/Thunderwolves/Wolf Guard; own CP + both generic),
  Blood Angels (full base + 14 unique datasheets: Dante, Mephiston, Sanguinor,
  Lemartes, Astorath, BA/DC Captains, Sanguinary Priest, Death Company on foot/jump,
  Sanguinary Guard, DC Dreadnought, Baal Predator; own CP — Captain, 6 Sanguinary
  Guard, 10 Assault Intercessors — + the generic boxes).
- **2026-10-03:** BT + SW Combat Patrols confirmed on product pages (BT: Emperor's
  Champion, 3 Bladeguard, 5 Sword Brethren, 10 Crusaders; SW: Wolf Guard Battle
  Leader, 5 Wolf Guard Terminators, 5 Wulfen, 10 Blood Claws). All BT/SW-unique kit
  prices re-verified on en-EU (big drift: characters €27→€34–38.50, squads →€53),
  SW points incl. 3rd+ tiers from the MFM.
- Each Chapter has a style `profile` (IF lean vehicles, Salamanders/BT infantry,
  DA mounted, SW mounted/melee).

- **Flavour (2026-10-03):** all 68 base units tagged (`tags`), Chapter-only units
  marked `exclusive`, each Chapter has an `identity` (tag weights) → Chapter lists
  are generated for flavour (no slider: it barely changed prices). Non-SM factions
  have no tags/identity yet, so they stay value-first — tag them (and give them an
  identity) to make their lists flavourful too; check prices don't jump (Custodes
  went +47% when flavour relied on the generic `flavor` rating alone).

- **Aeldari Craftworlds (2026-10-03):** Biel-Tan, Ulthwé, Saim-Hann, Iyanden,
  Alaitoc in `craftworlds.ts`, sharing the Aeldari roster (units now tagged).
  Halfway flavour (full flavour cost +25–30% for Alaitoc/Saim-Hann). Not modelled:
  Ynnari and Corsairs (user can't QA them; incl. Kharseth, Starfangs) and the FW
  Titans. Since 2026-10-03 the roster also has the support platforms, Warlocks,
  Lhykhis, Autarch Wayleaper, Ghostglaive Wraithknight and the Harlequins.
- **TODO — Exodites:** Clanblade (70 pts, leads Dragon Knights), Stonesinger (55,
  supports Dragon Knights), Leystalker (75), Dragon Knights (3 models 85 / 3rd+ 95)
  are in the MFM but only sold in a Kill Team box for now. Add them (tag
  `exodite`) once individual kits exist, or model the Kill Team box as a value box.

- **Astra Militarum — DONE (2026-10-03).** 70 of the MFM's 72 datasheets (Aegis
  Defence Line and the FW Avenger left out); points + escalation + leader lists from
  the MFM; every kit price hand-checked (grid + user). Combat Patrol (€139: Cadian
  Command Squad, 10 Kasrkin, 10 Rough Riders). Shared kits pooled (Leman Russ,
  Rogal Dorn, Manticore/Deathstrike, Hydra/Wyvern, Ogryns/Bullgryns/Bodyguard,
  Taurox/Prime, Baneblade ×5, Shadowsword ×3); Graves' €83 box builds both versions
  (one fielded); the Nork Deddog box adds 2 Ogryns. Limited Battleforce Platoon
  skipped. No identity/tags yet → value-first.
- **Imperial Knights — DONE (2026-10-03).** The 14 plastic datasheets (the 8 FW
  resin Knights omitted, as for Chaos Knights); MFM points + escalation; prices from
  the en-EU grid, kit sharing confirmed by the user (Questoris €155: Paladin /
  Errant / Gallant / Crusader / Warden / Defender; Dominus €156: Castellan /
  Valiant; Preceptor / Canis Rex €155; Armigers €83 for 2, either type; Destrier
  €145; Moirax €62 online). No Combat Patrol exists. `ignoreSizeCap`.
- **Still missing factions (MFM):** Emperor's Children, World Eaters, Thousand
  Sons, Chaos Daemons, Grey Knights, Imperial Agents, Orks,
  T'au Empire, Drukhari, Genestealer Cults, Leagues of Votann (+ Deathwatch as an
  SM Chapter). Titan Legions (FW) out of scope.

**SM TODOs:**
- **Points:** the whole generic roster + Ultramarines re-read from the MFM
  2026-10-03 (exact 3rd+ / 2nd+ tiers, leader lists). Units use the default size;
  a few carry an optional costed upgrade in the MFM (Desolation Vengor launcher,
  Invader multi-melta…) not modelled as wargear.
- **Combo / box-only kits:** Heroes of the Chapter (€93, online only: Lieutenant
  w/ Combi-weapon, Apothecary Biologis, 5 Sternguard), Honoured of the Chapter (€139:
  Chaplain, Judiciar, Bladeguard Ancient, 3 Bladeguard, 3 Eradicators) — both value
  boxes for every Chapter; their box-only units use the box as their kit. Captain
  Titus + 6 Wardens of Ultramar share one €77 box. Infiltrator (10, either squad),
  Reiver (10) and Drop Pod (2) boxes build more than one unit — spares get fielded.
- **Prices:** ALL SM kits (base + every Chapter) re-verified on en-EU 2026-10-03,
  checked by hand (GW's grid is unreliable to scrape — hand the user a checklist
  CSV instead). Big drift fixed (characters €27→€34–38.50, squads →€51–53, Lion
  €115→€60). The box-only Apothecary Biologis is priced as the "Heroes of the
  Chapter" box (€93: Lieutenant w/ Combi-weapon, Apothecary Biologis, 5 Sternguard),
  which is also a value box for every Chapter. The box's Lieutenant w/ Combi-weapon
  (MFM 85 pts, its own datasheet) is counted as the generic Lieutenant — add the
  variant as a unit if accuracy matters.
- **New-Chapter prices (2026-10-03):** all IH/WS/RG/BA kits hand-checked. Many BA
  datasheets reuse generic kits (BA/DC Captain → Captain; Death Company → Assault
  Intercessors / Jump Pack Intercessors; DC Dreadnought → Brutalis Dreadnought).
- **More Chapters:** Deathwatch, Grey Knights (own roster), Crimson Fists, Black
  Dragons etc. are not modelled.

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
