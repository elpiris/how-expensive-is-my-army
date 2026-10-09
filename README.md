# 💰 How Expensive Is My Army?

A web app that auto-builds a **Warhammer 40,000** army list for a chosen faction
and points level, then prices it up in **euros** using Games Workshop box kits —
folding in **Combat Patrol / battleforce** value boxes to keep the cost down, and
letting you apply a retailer discount.

Built with **Vite + React + TypeScript**.

> **Developing this?** Read [ARCHITECTURE.md](ARCHITECTURE.md) for the data model,
> generation/costing pipeline and data-sourcing recipe, and [TODO.md](TODO.md) for
> the per-faction data status and backlog.

## Features

- **Factions**, grouped in the dropdown (alphabetical within each group):
  - **Imperium** — Adeptus Custodes (+ a **Force** dropdown), Adepta Sororitas (+ an **Order** dropdown), Adeptus Mechanicus (+ a **Force** dropdown), Astra Militarum,
    Imperial Knights, Grey Knights
  - **Space Marines** (own group) — a **Chapter system**: a base, Chapter-agnostic
    roster, plus Codex-compliant Chapters that share that base + their own characters
    (Ultramarines, Imperial Fists, Salamanders, Iron Hands, White Scars, Raven Guard)
    and non-compliant Chapters with their own units (Dark Angels, Black Templars — no
    psykers, Space Wolves, Blood Angels). Space Marines is a single faction entry;
    the Chapter is chosen in a second **Chapter** dropdown that appears beside it.
  - **Chaos** — Death Guard, Chaos Space Marines (+ a **Legion** dropdown), Chaos
    Knights, Emperor's Children,
    World Eaters, Thousand Sons, Chaos Daemons (+ a **God** dropdown)
  - **Xenos** — Necrons (+ a **Force** dropdown), Tyranids (+ a **Hive Fleet** dropdown), Aeldari (+ a
    **Craftworld** dropdown), T'au Empire (+ a **Sept** dropdown),
    Leagues of Votann, Genestealer Cults, Drukhari (+ a **Kabal / Cult / Coven**
    dropdown), Orks (+ a **Clan** dropdown)
- **Two modes:**
  - **Quick list** — pick a faction + points bracket (500 / 1000 / 1500 / 2000)
    and get one list. Reroll for a new take.
  - **Escalation** — pick a faction and grow one collection 500 → 1000 → 1500 →
    2000, where each stage is a **superset** of the last, and see the new boxes to
    buy (and the spend) at each step.
- **Value-driven, legal lists:** prefers good points-per-euro kits, seeds the
  faction's value box (Combat Patrol) when it has one, picks battleline on merit
  (no forced minimum), gives some leadable units a Leader (characters need a unit
  to lead, with diminishing returns per HQ), and respects the official MFM unit limits (max 3
  of a datasheet, 6 for Battleline at 2000; Epic Heroes unique).
- **Army composition profiles:** each faction has a thematic "shape" (target share
  of points across characters / infantry / mounted / vehicles / monsters), so lists
  come out in-character — Tyranids lean on monsters + swarms, Chaos Knights are all
  walkers, Mechanicus/Custodes favour troops and machines over HQs — rather than
  every army defaulting to the same mix. An on-demand **Advanced settings** panel
  exposes the profile as sliders (recommended values marked + one-click reset), so
  users can slant a list toward characters, infantry, vehicles, etc.
- **Flavourful Space Marine Chapters:** Chapter lists favour what the Chapter is
  known for — its own units, and units matching its identity (bikes for White Scars,
  flamers and meltas for Salamanders, Terminators and Gravis for Imperial Fists…) —
  at about the same price as a pure value-for-money list.
- **T'au Septs:** T'au Sept (Shadowsun, Fire Warriors), Farsight Enclaves (Farsight,
  battlesuits), Vior'la (fast strikes), Bork'an (long-range guns) and a Kroot Hunting
  Pack (Kroot with T'au gunships in support).
- **Astra Militarum Regiments:** Cadian Shock Troops (Creed, Kasrkin, Leman Russ),
  Catachan Jungle Fighters (flamers, Ogryns, Sly Marbo), Death Korps of Krieg
  (artillery, Dreir), Militarum Tempestus (Scions, Valkyries) and the Armageddon
  Steel Legion (tank companies, super-heavies, Yarrick, Graves).
- **Daemon allies off by default:** Death Guard, World Eaters, Emperor's Children and
  Thousand Sons hide the datasheets they share with the Chaos Daemons (Plaguebearers,
  Bloodthirsters…) unless "Include daemon datasheets" is ticked.
- **Chaos Space Marine Legions:** Black Legion (Abaddon, Chosen, Terminators), Iron
  Warriors (tanks, daemon engines, Vashtorr, Kravek Morne), Night Lords (Raptors, Warp
  Talons, Nemesis Claw), Word Bearers (Dark Apostles, Possessed, Daemon Princes), Alpha
  Legion (cultists, Traitor Guard) and Red Corsairs (Huron, Raiders) — each legion's
  own heroes and units are exclusive to it.
- **Tyranid Hive Fleets:** Behemoth (melee monsters, Old One Eye, the Swarmlord), Kraken (fast
  bugs, Genestealers, Raveners), Leviathan (synapse), Gorgon (toxins, spores),
  Jormungandr (tunnellers, Lictors), Hydra (gaunt swarms) and Kronos
  (bio-artillery) — picked in a Hive Fleet dropdown,
  halfway between value and flavour (Gorgon leans further to flavour). The
  Tyranid roster covers every MFM datasheet except the Forge World Bio-Titans.
- **Aeldari Craftworlds:** Biel-Tan (Aspect Warriors, Phoenix Lords, the Avatar),
  Ulthwé (seers, Guardians, Eldrad), Saim-Hann (jetbikes), Iyanden (wraith
  constructs, Yriel) and Alaitoc (Rangers, stealth) — picked in a Craftworld
  dropdown, balanced halfway between value and flavour.
  The Aeldari roster covers the full MFM Craftworld + Harlequin datasheets
  (support platforms, Warlocks, Lhykhis, Wayleaper, Ghostglaive Wraithknight,
  Troupes, Skyweavers, Star/Voidweavers…); Ynnari, Corsairs and Exodites aren't
  modelled yet.
- **Accurate points:** sourced from the **Munitorum Field Manual** (11th ed),
  including each datasheet's **escalating cost** for repeat copies (a unit can step
  up on its 2nd, 3rd or 4th copy — shown on the list row) and the single
  **highest-cost wargear** option a unit can take.
- **Transports** are only added to carry a unit already in the list (one unit each).
- **Smart shopping list:** works out which boxes to buy, preferring value boxes when
  they genuinely save money, credits bonus sprues, pools datasheets that share a kit
  (one Leman Russ box builds any variant; one War Dogs box builds any 2), and flags
  leftover models.
- **Combo boxes & "use what you buy":** a box that builds several datasheets (e.g.
  Horrors of the Hive, Heroes of the Chapter, the Troupe box) is valued as a whole,
  and anything already paid for but unused — box-mates, a gaunt box's Ripper, spare
  Combat Patrol units — is fielded first when it fits.
- **Discounts:** one-click 10 / 15 / 20 % retailer discount, correctly excluding
  Games-Workshop-webstore-exclusive kits (which don't get discounted), applied per
  line and to the totals.
- **Cost per point** and total-points readouts.

## Running it

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

To build for production:

```bash
npm run build
npm run preview
```

## A note on the data (please read)

Warhammer points and prices change often — points get a Munitorum Field Manual
update roughly monthly/quarterly, and GW adjusts prices periodically.

- **Points** reflect the 11th-edition MFM and are verified per faction, but are
  *indicative* — always re-check the current MFM.
- **Prices** are in euros from warhammer.com (en-EU). Kits confirmed against the
  live store are shown normally; kits whose price is a best-effort estimate (not
  yet confirmed, or not sold on their own — e.g. Forge World) are flagged **`≈
  price`** in the UI. Always confirm the live price at
  [warhammer.com](https://www.warhammer.com/en-EU/) before buying.
- Not every faction has a value box: GW has discontinued some Combat Patrols (e.g.
  Adeptus Custodes), and Imperial Knights, Chaos Knights and Chaos Daemons have
  none — those lists are built from individual kits.
- Forge World resin kits, terrain and discontinued kits are left out of the rosters;
  a few units with no kit on sale are priced as kitbashes (shown with `≈`).
- Each faction file records a `lastVerified` date; see [TODO.md](TODO.md) for the
  per-faction verification status.

This tool is a **planning aid**, not a store. It is not affiliated with or
endorsed by Games Workshop. Warhammer 40,000 is a trademark of Games Workshop Ltd.

## Project layout

```
src/
  types.ts              # domain model (Unit, Kit, ValueBox, Faction, cost types)
  data/
    index.ts            # faction registry (grouped by category in the UI)
    <faction>.ts        # one file per faction: units + kits + points + prices
                        # (custodes, sororitas, mechanicus, astraMilitarum,
                        #  imperialKnights, greyKnights, deathGuard,
                        #  chaosSpaceMarines, chaosKnights, emperorsChildren,
                        #  worldEaters, thousandSons, chaosDaemons, necrons,
                        #  tyranids, aeldari, tauEmpire, leaguesOfVotann,
                        #  genestealerCults, drukhari, orks)
    craftworlds.ts      # the 5 Aeldari Craftworld sub-factions
    hiveFleets.ts       # the 7 Tyranid Hive Fleet sub-factions
    legions.ts          # the 6 Chaos Space Marine Legion sub-factions
    regiments.ts        # the 5 Astra Militarum Regiment sub-factions
    septs.ts            # the 5 T'au Sept sub-factions (incl. Kroot Hunting Pack)
    drukhariForces.ts   # Drukhari Kabal / Wych Cult / Haemonculus Coven
    clans.ts            # the 7 Ork Clan sub-factions
    orders.ts           # the 4 Adepta Sororitas Order sub-factions
    necronForces.ts     # Necron Destroyer Cult / Canoptek Court / Awakened Dynasty
    mechanicusForces.ts # Mechanicus Skitarii Hunter Cohort / Cult Mechanicus
    custodesForces.ts   # Custodes Shield Host / Talons of the Emperor / Solar Spearhead
    daemonGods.ts       # Chaos Daemons Khorne / Tzeentch / Nurgle / Slaanesh
    spaceMarines/       # base Codex roster + per-Chapter Faction files
      base.ts           #   shared roster + generic value boxes
      vanilla.ts        #   Space Marines, no Chapter
      ultramarines.ts   #   …and the other Chapters
  lib/
    value.ts            # points-per-euro, copy/escalation + wargear points helpers
    generateList.ts     # Quick + Escalation list generation
    costList.ts         # box optimisation, discounts, per-step purchase deltas
  App.tsx               # UI
  styles.css
```

## Adding / updating data

- **Update points or prices:** edit the relevant `src/data/<faction>.ts` file and
  bump its `lastVerified` date. Set a kit's `verified: true` once you've confirmed
  the price on warhammer.com — that removes the `≈` badge.
- **Escalating cost:** give a unit `pointsEscalated` (the higher per-copy cost) and,
  if it steps up before the 3rd copy, `escalateAt: 2` (or `4`).
- **Wargear:** add `wargear: { name, points }` for the single highest-cost option.
- **Add a unit:** add a `Unit` object (with its `kit`) to that faction's `units`.
  Characters can `leads: [unitId, …]`; transports `transports: [unitId, …]`.
- **Add a faction:** create `src/data/<faction>.ts` exporting a `Faction` (with a
  `category` of `imperium` / `chaos` / `xenos`), then add it to `src/data/index.ts`.
  Optionally give it a `profile` (relative target share of points per category) to
  shape its lists; omit it to leave the faction unshaped.
- **Add a sub-faction** (a Chapter, a Craftworld…): a `Faction` with `parent` set to
  the base faction's id (the base gets a `subfactionLabel`); give it an `identity`
  (tag weights) and optionally `signature` units / its own `profile` / `flavour`.
- **Shared / combo kits:** units that share a box use the same kit name (pooled
  when costing); a box that also builds other datasheets lists them in
  `kit.alsoBuilds`.
- **Add a value box:** add a `ValueBox` to the faction's `valueBoxes`, listing what
  it `builds` (unit id + model count). Leave `valueBoxes: []` if the faction has no
  Combat Patrol.

## Outstanding work

See [TODO.md](TODO.md) for the current to-do list — per-faction price/Combat-Patrol
verification, model/rules refinements, and backlog features.
