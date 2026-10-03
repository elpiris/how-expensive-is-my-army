# TODO

Running list of outstanding work. Data facts were last checked on the dates noted;
Warhammer points and prices drift, so treat anything older with suspicion.

Active dropdown groups (`Faction.category`):
- **Imperium** — Custodes, Sororitas, Mechanicus, Astra Militarum, Imperial Knights,
  Grey Knights.
- **Space Marines** — one entry + a **Chapter** sub-selector: no Chapter,
  Ultramarines, Imperial Fists, Salamanders, Iron Hands, White Scars, Raven Guard,
  Dark Angels, Black Templars, Space Wolves, Blood Angels.
- **Chaos** — Death Guard, Chaos Space Marines, Chaos Knights, Emperor's Children,
  World Eaters, Thousand Sons, Chaos Daemons.
- **Xenos** — Necrons, Tyranids (+ a **Hive Fleet** sub-selector: Behemoth, Kraken,
  Leviathan, Gorgon, Jormungandr, Hydra, Kronos), Aeldari (+ a **Craftworld**
  sub-selector: Biel-Tan,
  Ulthwé, Saim-Hann, Iyanden, Alaitoc), T'au Empire, Leagues of Votann, Genestealer
  Cults, Drukhari, Orks.

Architecture overview: [ARCHITECTURE.md](ARCHITECTURE.md).

## Data verification

**21 non-SM factions + Space Marines (10 Chapters) are fully fine-tuned** — MFM
rosters (points + escalation + leader lists), en-EU kit prices, real Combat Patrols /
value boxes, composition profiles. Prices for everything added on 2026-10-03 were
confirmed with the user one kit at a time. Remaining data work: the few best-effort
(`verified:false` → "≈") kits noted below, and periodic re-checks (points/prices drift).

### Still missing factions (MFM)
- None of the main armies — every MFM faction is modelled except the low-priority ones below.
- **Low priority (skipped 2026-10-03 as marginal armies):** Imperial Agents, and
  Deathwatch (as an SM Chapter). Add later the same way.
- Out of scope: Titan Legions / Chaos Titan Legions (Forge World).

### Per-faction status

**Imperium**
- **Adeptus Custodes — DONE (2026-10-02).** Full 31-datasheet MFM roster; prices
  verified for every GW-sold kit; Forge World / battle-group-only kits (Aquilon,
  Agamatus, Caladius, both FW Contemptors, Telemon, Pallas, Coronus, Anathema
  Rhino, Knight-Centura) stay best-effort. **GW discontinued the Custodes Combat
  Patrol** — no value box (`ignoreSizeCap` lets its 200+pt troops field below 2000).
- **Adepta Sororitas — DONE (2026-10-02).** Full 33-datasheet MFM roster; the foot
  Canoness and the Seraphim/Zephyrim box aren't currently sold → best-effort. Combat
  Patrol (€139: Canoness, 5 Sacresants, 10 Battle Sisters, 10 Arco-flagellants).
- **Adeptus Mechanicus — DONE (2026-10-02).** Full 34-datasheet MFM roster; every
  kit verified (Tech-Priest Enginseer €34 confirmed 2026-10-03; the Cybernetica
  Datasmith's kit is the Kastelan box). Combat Patrol (€139: Manipulus, 3 Serberys
  Sulphurhounds, 5 Pteraxii Sterylizors, 10 Skitarii Vanguard).
- **Astra Militarum — DONE (2026-10-03).** 70 of the MFM's 72 datasheets (Aegis
  Defence Line and the FW Avenger left out); every kit price verified. Combat Patrol
  (€139: Cadian Command Squad, 10 Kasrkin, 10 Rough Riders). Shared kits pooled
  (Leman Russ, Rogal Dorn, Manticore/Deathstrike, Hydra/Wyvern, Ogryns/Bullgryns/
  Bodyguard, Taurox/Prime, Baneblade ×5, Shadowsword ×3); Graves' €83 box builds
  both versions (one fielded); the Nork Deddog box adds 2 Ogryns. Limited
  Battleforce Platoon skipped.
- **Imperial Knights — DONE (2026-10-03).** The 14 plastic datasheets (the 8 FW resin
  Knights omitted, as for Chaos Knights). Kits: Questoris €155 (Paladin / Errant /
  Gallant / Crusader / Warden / Defender), Dominus €156 (Castellan / Valiant),
  Preceptor / Canis Rex €155, Armigers €83 for 2 (either type), Destrier €145,
  Moirax €62 (online). No Combat Patrol exists. `ignoreSizeCap`.
- **Grey Knights — DONE (2026-10-03).** 23 datasheets (FW Thunderhawk and the
  discontinued Stormtalon/Stormhawk omitted). Combat Patrol (€139: Crowe, 10 Strike,
  5 Terminators, Venerable Dreadnought). Shared kits: Strike Squad €56.50/10 (Strike
  / Purifier / Purgation / Interceptor), Terminators €51/5 (+ Paladins), Dreadknight
  €66 (+ GM), Grand Master / Voldus €34.50; SM kits for the Terminator Librarian /
  Chaplain and Techmarine. Kitbash proxies ("≈"): Brother-Captain, Champion (Crowe
  €38.50), Razorback (Rhino €50).

**Chaos**
- **Chaos Space Marines — DONE (2026-10-02).** ~41-unit roster from the
  54-datasheet MFM (omitting terrain, cross-faction kits, newest niche sub-faction
  units). Combat Patrol (€139: Master of Possession, 5 Possessed, 10 Legionaries,
  10 Cultists). TODO: confirm the best-effort kits (Legionaries box, foot/jump Chaos
  Lords, Vindicator, Master of Possession) — newer factions show e.g. the Chaos
  Vindicator at €64.
- **Death Guard — DONE (2026-10-02).** Full 35-datasheet MFM roster (incl. the Nurgle
  daemons; Miasmic Malignifier terrain omitted); every kit verified. Combat Patrol
  "Maggot Lords" (€139).
- **Chaos Knights — DONE (2026-10-02).** The 12 plastic datasheets (6 Questoris-class
  Knights, 5 War Dogs, Moirax); the 8 FW Titans omitted on purpose (would dominate
  the generator). No Combat Patrol exists.
- **Emperor's Children — DONE (2026-10-03).** All 23 MFM datasheets (incl. the
  Daemons of Slaanesh). Shared kits: Tormentors / Infractors €57.50 for 10, Daemon
  Prince ± wings €74, Keeper / Shalaxi €139. Combat Patrol (€139: Lord Exultant,
  6 Flawless Blades, 10 Infractors).
- **World Eaters — DONE (2026-10-03).** All 30 MFM datasheets (incl. Khârn, the
  Daemons of Khorne, the Kill Team Goremongers). Shared kits: Eightbound / Exalted €53
  for 3, Juggernaut kit (+ Lord Invocatus), Maulerfiend / Forgefiend €74, Daemon
  Prince ± wings, Chaos Predators. Combat Patrol (€139: Daemon Prince, Master of
  Executions, 10 Berzerkers, 10 Jakhals).
- **Thousand Sons — DONE (2026-10-03).** All 34 MFM datasheets (incl. the Daemons of
  Tzeentch). Exalted Sorcerers box = 2 on foot + 1 on Disc (modelled as 3
  interchangeable models); Lord of Change / Kairos €139. Combat Patrol (€139: Daemon
  Prince, Tzaangor Shaman, 3 Enlightened, 10 Rubrics).
- **Chaos Daemons — DONE (2026-10-03).** 47 datasheets (the MFM's 53 minus 6 with
  phased-out kits: Blue Scribes, Fluxmaster, Epidemius, Tranceweaver, Hellflayer,
  Tormentbringer); all verified. No Combat Patrol exists. Skullmaster kitbashed from
  the Bloodcrushers box. Idea: Khorne / Tzeentch / Nurgle / Slaanesh sub-factions
  (like the Craftworlds).

**Xenos**
- **Necrons — DONE (2026-10-02).** ~34-unit roster from the 52-datasheet MFM; prices
  re-verified. A few units best-effort (Imotekh, Trazyn, Reanimator); Canoptek
  Scarabs come with the Necron Warriors box (`alsoBuilds`).
- **Tyranids — DONE (2026-10-03).** All 50 MFM datasheets except the FW Bio-Titans
  (Harridan, Hierophant); every price verified except The Red Terror (Kill Team box
  only, ≈ €60). Ripper Swarms are single bases whose kit is the Termagants box;
  Spore Mines come 3 per Biovore / Pyrovore box and 6 per Sporocyst box. Shared
  kits: Warriors (melee / ranged), Biovore / Pyrovore €43, Tyrannofex / Tervigon
  €56.50, Harpy / Hive Crone €80, Kill Team: Raveners €56.50/5 (+ Hyperadapted),
  Carnifex Brood €87 (2 Carnifexes or 1 + Old One Eye; the store also lists it as
  "Screamer-Killer Brood" — the Screamer-Killer itself is only in Horrors of the
  Hive). Value boxes: Combat Patrol (€139) and Battleforce: Tyranid Swarm (€212,
  while stocks last). Seven **Hive Fleet** sub-factions (`hiveFleets.ts`) at
  `flavour: 0.5` (Gorgon 0.75): +4…19% over value lists, 2000-pt lists 38–84%
  on-theme (Gorgon only ~30% — its toxin units are poor value).
- **Aeldari — DONE (2026-10-03).** 54-unit roster: Craftworlds + Harlequins + support
  platforms, Warlocks, Lhykhis, Wayleaper, Ghostglaive Wraithknight; every kit price
  verified. Combat Patrol (€139: Spiritseer, 5 Wraithblades, 5 Warp Spiders, 10 Dire
  Avengers). Not modelled: Ynnari, Corsairs (incl. Kharseth, Starfangs), FW Titans.
  Five **Craftworld** sub-factions (`craftworlds.ts`) at `flavour: 0.5`.
- **T'au Empire — DONE (2026-10-03).** 36 datasheets (the MFM's 43 minus the FW
  Tiger Sharks / Manta / Ta'unar and the Tidewall fortifications); all prices
  verified. Shared kits: Fire Warriors €51/10 (Strike / Breacher), Commander €53
  (Enforcer / Coldstar), Crisis €74/3 (Fireknife / Starscythe / Sunforge),
  Hammerhead / Sky Ray €64, Razorshark / Sun Shark €74; Stealth Suits and Vespid in
  Kill Team boxes (€56.50, 5 / 10). Combat Patrol (€139: Enforcer Commander,
  Devilfish, 10 Breachers, 10 Pathfinders).
- **Leagues of Votann — DONE (2026-10-03).** All 22 MFM datasheets; every kit price
  from the en-EU grid, box sizes / sharing confirmed by the user (Steeljacks €51/3
  either loadout, Kapricus Defender / Carrier €52, Grimnyr box = 3 models, Iron-master
  box = 5, Yaegirs in a Kill Team box). Combat Patrol (€139: Einhyr Champion,
  3 Thunderkyn, 5 Hearthguard, 10 Hearthkyn).
- **Genestealer Cults — DONE (2026-10-03).** All 24 MFM datasheets (Brood Brother
  AM allies not modelled); every price verified (grid + user). Shared kits: Acolyte
  Hybrids (both loadouts) / Metamorphs €38.50/5, Goliath Truck / Rockgrinder €56.50;
  the Broodcoven (€60: Patriarch + Magus + Primus) is the only source of the
  Patriarch and Primus. Combat Patrol (€139: Jackal Alphus, Ridgerunner, 5 Jackals,
  10 Metamorphs). Genestealers €47.50 (Tyranid kit price updated too).
- **Drukhari — DONE (2026-10-03).** All 23 MFM datasheets; prices verified (grid +
  user) except Hand of the Archon (Kill Team box, temporarily unavailable → ≈ €56.50).
  Shared kits: Talos / Cronos €53, Scourges €34/5 (both loadouts); Mandrakes in a
  Kill Team box. Combat Patrol (€139: Haemonculus, Cronos, Talos, 10 Wracks).
- **Orks — DONE (2026-10-03).** 52 datasheets (the MFM's 55 minus Big'ed Bossbunka
  terrain, the FW Gargantuan Squiggoth and the Runtherd — no kit on sale); every
  price verified (grid + user; "Classic" made-to-order kits not used). Value box:
  Getting Started with Orks (€139: Warboss, Weirdboy, 20 Boyz, 10 Gretchin,
  Wartrakk). Combo: Armageddon Kommand Krew (€80: Bigboss, Bannernob, Painboy).
  Shared kits: Battlewagon / Gunwagon, Kill / Hunta Rig, Wartrakk / Warbuggy,
  Gorkanaut / Morkanaut €125, the jet kit €77, Mek Gunz, Kill Team Breaka Boyz /
  Tankbustas €56.50/6, Meganobz / Big Mek in MA €60/3.
- **TODO — Exodites:** Clanblade (70 pts, leads Dragon Knights), Stonesinger (55,
  supports Dragon Knights), Leystalker (75), Dragon Knights (3 models 85 / 3rd+ 95)
  are in the MFM but only sold in a Kill Team box for now. Add them (tag `exodite`)
  once individual kits exist, or model the Kill Team box as a value box.

**Scraping tips.** MFM: the units list renders in a container whose textContent
starts `UNITS…`; walk its leaf nodes, split per unit at each `YOUR UNIT COSTS` /
`YOUR 1ST…` label and read the size→pts pairs + LEADER/SUPPORT lists (allow
accented capitals, e.g. Khârn). GW store: `warhammer.com/en-EU/shop/warhammer-40000/
{armies-of-the-imperium|armies-of-chaos|xenos-armies|space-marines}/<faction>`;
decline cookies, scroll to lazy-load, read name/price lines — the grid virtualises,
so expect gaps. Product pages are reliable for Combat Patrol contents ("Read More").
**For prices, ask the user one kit at a time in chat** (price / "ok" / box size) —
far more reliable than scraping. Never solve GW CAPTCHAs.

## Space Marines + Chapters (2026-10-03)
A **shared base roster** (`spaceMarines/base.ts`, 68 generic datasheets — the whole
MFM list minus the FW Thunderhawk) reused by each Chapter; Chapters are sub-factions
(`parent: 'space-marines'`) picked in the Chapter dropdown.
- **Generic value boxes** (every Chapter): Getting Started with Space Marines (€139:
  Captain, Librarian, 5 Intercessors, 5 Vanguard, Land Speeder), the **Dark Angels
  Combat Patrol** (only generic units: Gravis Captain, 3 Bladeguard, 5 Hellblasters,
  10 Intercessors), **Heroes of the Chapter** (€93, online only: Lieutenant w/
  Combi-weapon, Apothecary Biologis, 5 Sternguard) and **Honoured of the Chapter**
  (€139: Chaplain, Judiciar, Bladeguard Ancient, 3 Bladeguard, 3 Eradicators). Their
  box-only units (Apothecary Biologis, Lieutenant w/ Combi-weapon, Judiciar,
  Bladeguard Ancient) use the box as their kit.
- **Codex-compliant (base + unique characters):** Ultramarines (Guilliman, Calgar,
  Tigurius, Titus + Wardens of Ultramar — one €77 box, Sicarius, Konorius, Victrix
  Guard), Imperial Fists (Lysander, Tor Garadon), Salamanders (Vulkan He'stan, Adrax
  Agatone), Iron Hands (Caanok Var, Feirros), White Scars (Kor'sarro, Suboden),
  Raven Guard (Shrike, Aethon Shaan).
- **Non-compliant:** Dark Angels (Deathwing/Ravenwing, Lion; DA CP first), Black
  Templars (no Psykers; own CP; no Getting Started — it has a Librarian), Space
  Wolves (pack infantry, Thunderwolves, Wolf Guard; own CP), Blood Angels (14 unique
  datasheets, many built from generic kits; own CP).
- **Flavour:** all base units carry `tags`, Chapter-only units are `exclusive`, each
  Chapter has an `identity` → Chapter lists are generated at full flavour (a slider
  was tried and dropped — flavour barely changed prices). Each Chapter also has a
  composition `profile`.
- **Prices:** every SM kit hand-checked 2026-10-03. Multi-unit boxes: Infiltrators
  (10, either squad), Reivers (10), Drop Pods (2) — spares get fielded.

**SM TODOs:**
- A few units carry an optional costed upgrade in the MFM (Desolation Vengor
  launcher, Invader multi-melta…) not modelled as wargear.
- More Chapters (Deathwatch — low priority; Crimson Fists, Black Dragons… not modelled).

## Model / rules refinements
- **Flavour for other factions:** only SM Chapters, Aeldari Craftworlds and Tyranid
  Hive Fleets have
  `tags` / `identity`; the rest stay value-first. Tag them (and add identities or
  sub-factions — e.g. Astra Militarum regiments, Chaos Daemon gods) for flavourful
  lists; check prices don't jump (Custodes went +47% when flavour relied on the
  generic `flavor` rating alone).
- **Combo boxes** whose extra units aren't in the roster aren't credited (e.g.
  Necrons Royal Court; the DG "Chosen of Mortarion" box's Champion).
- Optional: a **floor that skips very-low-value units** in the fill unless nothing
  better fits, to make cheap filler even rarer.

## Features / scope (backlog)
- Restore a **competitive-list** mode (curated event netlists) — `competitiveLists`
  data is still in the Necron/Tyranid files, just unused.
- **Low-priority factions:** Imperial Agents, Deathwatch (see above).
- UI niceties: copy/export a list, shareable URL, per-box savings vs. buying
  single kits, show the points-per-euro value per unit.
