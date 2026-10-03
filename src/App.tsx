import { Fragment, useMemo, useState, type CSSProperties } from 'react'
import { factions, getFaction } from './data'
import { generateList, generateEscalation, BRACKETS } from './lib/generateList'
import { costList, discountedTotal, purchaseDelta, sumLines } from './lib/costList'
import {
  copyPoints,
  copySurcharge,
  entryPoints,
  escalateAt,
  isCharacter,
  unitCategory,
} from './lib/value'

/** "2nd+" / "3rd+" / "4th+" — the copy at which a datasheet's cost escalates. */
function ordinalPlus(n: number): string {
  const s = n === 2 ? '2nd' : n === 3 ? '3rd' : n === 4 ? '4th' : `${n}th`
  return `${s}+`
}
import type {
  CostBreakdown,
  DiscountPercent,
  Faction,
  FactionCategory,
  FactionProfile,
  GeneratedList,
  ListEntry,
  PurchaseLine,
  UnitCategory,
  UnitTag,
} from './types'

const CATEGORY_ORDER: FactionCategory[] = ['imperium', 'space-marines', 'chaos', 'xenos']
const CATEGORY_LABELS: Record<FactionCategory, string> = {
  imperium: 'Imperium',
  'space-marines': 'Space Marines',
  chaos: 'Chaos',
  xenos: 'Xenos',
}

const DISCOUNTS: DiscountPercent[] = [0, 10, 15, 20]

// Factions with sub-factions (Space Marine Chapters, Aeldari Craftworlds) appear
// once in the faction dropdown as their base force; the sub-faction is picked in
// a second dropdown labelled by the base's `subfactionLabel`.
const subfactionsOf = (parentId: string) =>
  factions.filter((f) => f.parent === parentId).sort((a, b) => a.name.localeCompare(b.name))
const CHAPTER_GROUPS: { kind: Faction['chapter']; label: string }[] = [
  { kind: 'codex', label: 'Codex-compliant' },
  { kind: 'non-codex', label: 'Non-compliant' },
]

function eur(n: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n)
}

/** Discount factor for a line — online-only kits are never discounted. */
function lineFactor(line: PurchaseLine, pct: DiscountPercent): number {
  return line.onlineOnly ? 1 : 1 - pct / 100
}

function groupEntries(entries: ListEntry[]): { label: string; entries: ListEntry[] }[] {
  const groups = [
    { label: 'Characters', entries: entries.filter((e) => isCharacter(e.unit)) },
    {
      label: 'Battleline',
      entries: entries.filter((e) => !isCharacter(e.unit) && e.unit.role === 'battleline'),
    },
    {
      label: 'Other units',
      entries: entries.filter((e) => !isCharacter(e.unit) && e.unit.role !== 'battleline'),
    },
  ]
  return groups.filter((g) => g.entries.length > 0)
}

type Stat = { lbl: string; value: string; big?: boolean; accent?: 'green'; struck?: boolean }

/** Prominent at-a-glance totals bar shown under the controls. */
function SummaryBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="summary">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <span className="lbl">{s.lbl}</span>
          <span
            className={
              (s.big ? 'v big' : 'v') + (s.accent === 'green' ? ' green' : '') + (s.struck ? ' struck' : '')
            }
          >
            {s.value}
          </span>
        </div>
      ))}
    </section>
  )
}

/** The army list panel — one row per unit copy, grouped Characters / Battleline / Other. */
function ListPanel({ list }: { list: GeneratedList }) {
  const groups = groupEntries(list.entries)
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>The list</h2>
        <div className="pts-badge">
          {list.totalPoints} <span>/ {list.targetPoints} pts</span>
        </div>
      </div>
      {list.entries.length === 0 ? (
        <p className="empty">No units generated.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Unit</th>
              <th className="num">Models</th>
              <th className="num">Points</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const sub = g.entries.reduce((s, e) => s + entryPoints(e.unit, e.count), 0)
              return (
                <Fragment key={g.label}>
                  <tr className="group-row">
                    <td colSpan={2}>{g.label}</td>
                    <td className="num">{sub} pts</td>
                  </tr>
                  {g.entries.flatMap((e) =>
                    Array.from({ length: e.count }, (_, i) => (
                      <tr key={`${e.unit.id}-${i}`}>
                        <td>
                          {e.unit.epicHero && <span className="tag epic">Epic</span>}
                          {e.unit.name}
                          {e.unit.wargear && (
                            <span className="wg">
                              + {e.unit.wargear.name} ({e.unit.wargear.points})
                            </span>
                          )}
                          {copySurcharge(e.unit, i + 1) > 0 && (
                            <span
                              className="esc"
                              title="Repeat-unit surcharge — later copies of a datasheet cost more (Munitorum Field Manual escalating cost)"
                            >
                              + {copySurcharge(e.unit, i + 1)} ({ordinalPlus(escalateAt(e.unit))} unit)
                            </span>
                          )}
                        </td>
                        <td className="num">{e.unit.models}</td>
                        <td className="num">{copyPoints(e.unit, i + 1)}</td>
                      </tr>
                    )),
                  )}
                </Fragment>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total points</td>
              <td className="num strong">{list.totalPoints}</td>
            </tr>
          </tfoot>
        </table>
      )}
      {list.notes.map((n, i) => (
        <p className="note" key={i}>
          {n}
        </p>
      ))}
    </section>
  )
}

/** A purchase table, showing discounted prices per kit (online-only kits excepted). */
function ShopPanel({
  title,
  headline,
  lines,
  discount,
  notes,
  emptyText,
}: {
  title: string
  headline: string
  lines: PurchaseLine[]
  discount: DiscountPercent
  notes?: string[]
  emptyText?: string
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        <div className="pts-badge cost">{headline}</div>
      </div>
      {lines.length === 0 ? (
        <p className="empty">{emptyText ?? 'Nothing to buy.'}</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Box</th>
              <th className="num">Qty</th>
              <th className="num">Each</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => {
              const f = lineFactor(l, discount)
              const discounted = f < 1
              return (
                <tr key={i}>
                  <td>
                    <div className="box-name">
                      {l.name}
                      {l.isValueBox && <span className="tag value">Value box</span>}
                      {l.onlineOnly && <span className="tag online">GW only</span>}
                      {!l.verified && (
                        <span className="tag approx" title="Price not yet confirmed on warhammer.com">
                          ≈ price
                        </span>
                      )}
                    </div>
                    <div className="covers">{l.covers.join(' · ')}</div>
                  </td>
                  <td className="num">{l.quantity}</td>
                  <td className="num">{eur(l.unitPriceEUR * f)}</td>
                  <td className="num">
                    {discounted && <span className="struck small">{eur(l.lineTotalEUR)}</span>}{' '}
                    {eur(l.lineTotalEUR * f)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {notes && notes.length > 0 && (
        <details className="surplus">
          <summary>Surplus & notes ({notes.length})</summary>
          <ul>
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}

export default function App() {
  const [factionId, setFactionId] = useState(factions[0].id)
  // Last sub-faction picked per base faction — restored when the base is re-selected.
  const [lastSub, setLastSub] = useState<Record<string, string>>({})
  const [appMode, setAppMode] = useState<'quick' | 'escalation'>('quick')
  const [bracket, setBracket] = useState<(typeof BRACKETS)[number]>(2000)
  const [stageIndex, setStageIndex] = useState(0)
  const [discount, setDiscount] = useState<DiscountPercent>(0)
  const [seed, setSeed] = useState(() => Date.now())
  const [showAdvanced, setShowAdvanced] = useState(false)
  // User-tuned composition per faction (absent = the faction's recommended profile).
  const [customProfiles, setCustomProfiles] = useState<Record<string, FactionProfile>>({})

  const baseFaction = getFaction(factionId)!
  const parentId = baseFaction.parent ?? baseFaction.id
  const parentFaction = getFaction(parentId)!
  const customProfile = customProfiles[factionId]
  // The faction as the generator sees it — with the user's profile swapped in.
  const faction = useMemo<Faction>(
    () => (customProfile ? { ...baseFaction, profile: customProfile } : baseFaction),
    [baseFaction, customProfile],
  )

  const quickList = useMemo(() => generateList(faction, bracket, seed), [faction, bracket, seed])
  const quickCost = useMemo(() => costList(quickList), [quickList])

  const stages = useMemo(() => generateEscalation(faction, seed), [faction, seed])
  const stageCosts = useMemo<CostBreakdown[]>(() => stages.map(costList), [stages])

  return (
    <div className="app">
      <header className="hero">
        <h1>
          <span className="coin">💰</span> How Expensive Is My Army?
        </h1>
        <p className="tagline">
          Auto-build a Warhammer&nbsp;40,000 army and price it in euros — Combat Patrols included to
          keep the damage down.
        </p>
      </header>

      <section className="controls" aria-label="Army options">
        <div className="control">
          <label>Mode</label>
          <div className="segmented">
            <button
              className={appMode === 'quick' ? 'seg active' : 'seg'}
              onClick={() => setAppMode('quick')}
            >
              Quick list
            </button>
            <button
              className={appMode === 'escalation' ? 'seg active' : 'seg'}
              onClick={() => setAppMode('escalation')}
            >
              Escalation
            </button>
          </div>
        </div>

        <div className="control">
          <label htmlFor="faction">Faction</label>
          <select
            id="faction"
            value={baseFaction.parent ?? factionId}
            onChange={(e) => setFactionId(lastSub[e.target.value] ?? e.target.value)}
          >
            {CATEGORY_ORDER.map((cat) => {
              // Sub-factions live in the second dropdown; list only base factions.
              const inCat = factions
                .filter((f) => f.category === cat && !f.parent)
                .sort((a, b) => a.name.localeCompare(b.name))
              if (!inCat.length) return null
              return (
                <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
                  {inCat.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </div>

        {subfactionsOf(parentId).length > 0 && (
          <div className="control">
            <label htmlFor="subfaction">{parentFaction.subfactionLabel ?? 'Sub-faction'}</label>
            <select
              id="subfaction"
              value={factionId}
              onChange={(e) => {
                setFactionId(e.target.value)
                setLastSub((prev) => ({ ...prev, [parentId]: e.target.value }))
              }}
            >
              <option value={parentId}>
                No specific {parentFaction.subfactionLabel ?? 'sub-faction'}
              </option>
              {subfactionsOf(parentId).some((f) => f.chapter)
                ? CHAPTER_GROUPS.map(({ kind, label }) => (
                    <optgroup key={kind} label={label}>
                      {subfactionsOf(parentId)
                        .filter((f) => f.chapter === kind)
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </optgroup>
                  ))
                : subfactionsOf(parentId).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
            </select>
          </div>
        )}

        {appMode === 'quick' ? (
          <div className="control">
            <label>Points</label>
            <div className="segmented">
              {BRACKETS.map((b) => (
                <button
                  key={b}
                  className={b === bracket ? 'seg active' : 'seg'}
                  onClick={() => setBracket(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="control">
            <label>Stage (total spend)</label>
            <div className="segmented">
              {stages.map((s, i) => (
                <button
                  key={s.targetPoints}
                  className={i === stageIndex ? 'seg active stage' : 'seg stage'}
                  onClick={() => setStageIndex(i)}
                >
                  {s.targetPoints}
                  <small>{eur(discountedTotal(stageCosts[i], discount))}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="control">
          <label>Retailer discount</label>
          <div className="segmented">
            {DISCOUNTS.map((d) => (
              <button
                key={d}
                className={d === discount ? 'seg active' : 'seg'}
                onClick={() => setDiscount(d)}
              >
                {d === 0 ? 'None' : `${d}%`}
              </button>
            ))}
          </div>
        </div>

        <div className="control grow">
          <label>&nbsp;</label>
          <button className="primary" onClick={() => setSeed(Date.now())}>
            🎲 Reroll{appMode === 'escalation' ? ' plan' : ' list'}
          </button>
        </div>
      </section>

      <div className="adv-toggle-row">
        <button
          className="adv-toggle"
          aria-expanded={showAdvanced}
          aria-controls="advanced-settings"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <span className="chev">{showAdvanced ? '▾' : '▸'}</span> Advanced settings
          {customProfile && <span className="tag custom">Custom mix</span>}
        </button>
      </div>
      {showAdvanced && (
        <AdvancedSettings
          faction={baseFaction}
          profile={customProfile ?? baseFaction.profile ?? {}}
          isCustom={!!customProfile}
          list={appMode === 'quick' ? quickList : stages[stageIndex]}
          onChange={(cat, value) =>
            setCustomProfiles((prev) => {
              const rec = baseFaction.profile ?? {}
              const edited = { ...(prev[factionId] ?? rec), [cat]: value }
              const next = { ...prev }
              // Dragging every slider back onto its recommendation drops the custom mix.
              if (sameProfile(edited, rec)) delete next[factionId]
              else next[factionId] = edited
              return next
            })
          }
          onReset={() =>
            setCustomProfiles((prev) => {
              const next = { ...prev }
              delete next[factionId]
              return next
            })
          }
        />
      )}

      <div className="blurb">
        <strong>{faction.name}.</strong> {faction.blurb}
        {appMode === 'escalation' && (
          <>
            {' '}
            Escalation grows one collection from 500 up to 2000 pts — every stage re-uses what you
            already bought.
          </>
        )}
      </div>

      {appMode === 'quick' ? (
        <QuickView list={quickList} cost={quickCost} discount={discount} />
      ) : (
        <EscalationView
          stages={stages}
          stageCosts={stageCosts}
          stageIndex={stageIndex}
          discount={discount}
        />
      )}

      <footer className="foot">
        <p>
          <strong>Prices</strong> from{' '}
          <a href="https://www.warhammer.com/en-EU/" target="_blank" rel="noreferrer">
            warhammer.com
          </a>{' '}
          (EU), checked <strong>{faction.lastVerified}</strong>; entries marked{' '}
          <span className="tag approx">≈ price</span> aren’t confirmed. Discounts apply to all kits
          except <span className="tag online">GW only</span> webstore exclusives.
          <br />
          {faction.pointsVerified ? (
            <>
              <strong>Points</strong> from the Munitorum Field Manual (11th ed) — including the
              highest-cost wargear on units that pay for it, and the escalating cost of repeat units
              (each datasheet steps up on its 2nd, 3rd or 4th copy per the MFM). Not affiliated with
              Games Workshop.
            </>
          ) : (
            <>
              <strong>Points</strong> are indicative 11th-edition estimates, <em>not yet sourced</em>
              {' '}— don’t rely on exact totals yet. Not affiliated with Games Workshop.
            </>
          )}
        </p>
      </footer>
    </div>
  )
}

/** The composition buckets, in display order, with user-facing names. */
const PROFILE_CATEGORIES: { cat: UnitCategory; label: string; hint: string }[] = [
  { cat: 'character', label: 'Characters', hint: 'HQs and heroes' },
  { cat: 'infantry', label: 'Infantry', hint: 'squads on foot' },
  { cat: 'mounted', label: 'Mounted', hint: 'bikes, cavalry, beasts' },
  { cat: 'vehicle', label: 'Vehicles', hint: 'tanks, walkers, transports' },
  { cat: 'monster', label: 'Monsters', hint: 'big creatures and Primarchs' },
]
const PROFILE_MAX = 10
const PROFILE_STEP = 0.5

/** Readable names for identity tags (shown as "Salamanders favour: …"). */
const TAG_LABELS: Record<UnitTag, string> = {
  flamer: 'flamers',
  melta: 'meltas',
  plasma: 'plasma',
  bolter: 'bolters',
  melee: 'melee',
  terminator: 'Terminators',
  gravis: 'Gravis armour',
  phobos: 'Phobos / stealth',
  jump: 'jump packs',
  bike: 'bikes',
  speeder: 'speeders',
  dreadnought: 'Dreadnoughts',
  tank: 'tanks',
  psyker: 'psykers',
  chaplain: 'Chaplains',
  techmarine: 'Techmarines',
  veteran: 'veterans',
  aspect: 'Aspect Warriors',
  phoenix: 'Phoenix Lords',
  guardian: 'Guardians',
  seer: 'seers',
  wraith: 'wraith constructs',
  jetbike: 'jetbikes',
  gravtank: 'grav-tanks',
  walker: 'walkers',
  aircraft: 'aircraft',
  stealth: 'Rangers / stealth',
  harlequin: 'Harlequins',
}

/** "bikes, speeders and Chapter units" — a faction's identity, strongest first. */
function favouredText(faction: Faction): string {
  const tags = Object.entries(faction.identity ?? {})
    .filter(([, w]) => (w ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .map(([t]) => TAG_LABELS[t as UnitTag])
  if (faction.units.some((u) => u.exclusive)) tags.push(`${faction.chapter ? 'Chapter' : 'faction'}-only units`)
  for (const id of faction.signature ?? []) {
    const u = faction.units.find((x) => x.id === id)
    if (u) tags.push(u.name)
  }
  if (!tags.length) return 'its iconic units'
  return tags.length === 1 ? tags[0] : `${tags.slice(0, -1).join(', ')} and ${tags[tags.length - 1]}`
}


function sameProfile(a: FactionProfile, b: FactionProfile): boolean {
  return PROFILE_CATEGORIES.every(({ cat }) => (a[cat] ?? 0) === (b[cat] ?? 0))
}

function shareOf(profile: FactionProfile, cat: UnitCategory, cats: UnitCategory[]): number {
  const sum = cats.reduce((s, c) => s + (profile[c] ?? 0), 0)
  return sum > 0 ? (profile[cat] ?? 0) / sum : 0
}

function pct(x: number): string {
  return `${Math.round(x * 100)}%`
}

/**
 * Advanced settings: the faction's composition profile as editable sliders. Each
 * slider is a relative weight (normalised to a target share of the list's points);
 * the faction's recommended value is marked on the track and one click away.
 */
function AdvancedSettings({
  faction,
  profile,
  isCustom,
  list,
  onChange,
  onReset,
}: {
  faction: Faction
  profile: FactionProfile
  isCustom: boolean
  list: GeneratedList
  onChange: (cat: UnitCategory, value: number) => void
  onReset: () => void
}) {
  const recommended = faction.profile ?? {}
  // Only offer buckets this roster can actually fill.
  const rows = PROFILE_CATEGORIES.filter(({ cat }) =>
    faction.units.some((u) => unitCategory(u) === cat),
  )
  const cats = rows.map((r) => r.cat)

  const listPts = list.entries.reduce((s, e) => s + entryPoints(e.unit, e.count), 0)
  const actualShare = (cat: UnitCategory) =>
    listPts > 0
      ? list.entries
          .filter((e) => unitCategory(e.unit) === cat)
          .reduce((s, e) => s + entryPoints(e.unit, e.count), 0) / listPts
      : 0
  const unshaped = cats.every((c) => (profile[c] ?? 0) === 0)

  return (
    <section id="advanced-settings" className="advanced" aria-label="Advanced settings">
      <div className="adv-head">
        <div>
          <h2>Army composition</h2>
          <p className="adv-sub">
            How much of the list’s points should go to each unit type.{' '}
            {faction.identity ? (
              <>
                Units are picked for flavour — {faction.name} favour{' '}
                <strong>{favouredText(faction)}</strong>.
              </>
            ) : (
              <>The generator favours the best value-for-money kits, so this nudges the mix.</>
            )}
          </p>
        </div>
        {rows.length >= 2 && (
          <button className="adv-reset" onClick={onReset} disabled={!isCustom}>
            ↺ Reset to recommended
          </button>
        )}
      </div>

      {rows.length < 2 ? (
        <p className="adv-empty">
          {faction.name} fields only one kind of unit, so there’s no composition to adjust.
        </p>
      ) : (
        <>
          <div className="adv-rows">
            <div className="adv-row adv-cols" aria-hidden="true">
              <span />
              <span />
              <span className="num">Target</span>
              <span className="num">This list</span>
            </div>
            {rows.map(({ cat, label, hint }) => {
              const value = profile[cat] ?? 0
              const rec = recommended[cat] ?? 0
              const changed = value !== rec
              const id = `profile-${cat}`
              return (
                <div key={cat} className={changed ? 'adv-row changed' : 'adv-row'}>
                  <label htmlFor={id} className="adv-label">
                    {label}
                    <small>{hint}</small>
                  </label>
                  <div className="adv-slider">
                    <input
                      id={id}
                      type="range"
                      min={0}
                      max={PROFILE_MAX}
                      step={PROFILE_STEP}
                      value={value}
                      onChange={(e) => onChange(cat, Number(e.target.value))}
                      aria-valuetext={`weight ${value}, ${pct(shareOf(profile, cat, cats))} of points`}
                    />
                    <span
                      className="rec-mark"
                      style={{ '--pos': rec / PROFILE_MAX } as CSSProperties}
                      aria-hidden="true"
                    />
                    <div className="adv-meta">
                      <span>Weight {value}</span>
                      {changed ? (
                        <button className="rec-link" onClick={() => onChange(cat, rec)}>
                          Recommended: {rec}
                        </button>
                      ) : (
                        <span className="rec-ok">Recommended</span>
                      )}
                    </div>
                  </div>
                  <span className="num adv-target">
                    {unshaped ? '—' : pct(shareOf(profile, cat, cats))}
                  </span>
                  <span className="num adv-actual">{pct(actualShare(cat))}</span>
                </div>
              )
            })}
          </div>
          <p className="adv-foot">
            <span className="rec-mark legend" aria-hidden="true" /> marks the recommended mix for{' '}
            {faction.name}
            {unshaped
              ? '. Every weight is 0, so the list is picked on value alone.'
              : '. A weight of 0 makes a unit type rare, not impossible.'}
          </p>
        </>
      )}
    </section>
  )
}

function QuickView({
  list,
  cost,
  discount,
}: {
  list: GeneratedList
  cost: CostBreakdown
  discount: DiscountPercent
}) {
  const pay = discountedTotal(cost, discount)
  const saved = cost.rrpTotalEUR - pay
  const stats: Stat[] = [
    { lbl: 'You pay', value: eur(pay), big: true, accent: 'green' },
    { lbl: 'RRP', value: eur(cost.rrpTotalEUR), struck: discount > 0 },
    ...(discount > 0 ? [{ lbl: `Saved (${discount}%)`, value: '−' + eur(saved) } as Stat] : []),
    { lbl: 'Cost / point', value: list.totalPoints ? eur(pay / list.totalPoints) : '—' },
  ]
  return (
    <>
      <SummaryBar stats={stats} />
      <div className="grid">
        <ListPanel list={list} />
        <ShopPanel
          title="What to buy"
          headline={eur(pay)}
          lines={cost.lines}
          discount={discount}
          notes={cost.notes}
        />
      </div>
    </>
  )
}

function EscalationView({
  stages,
  stageCosts,
  stageIndex,
  discount,
}: {
  stages: GeneratedList[]
  stageCosts: CostBreakdown[]
  stageIndex: number
  discount: DiscountPercent
}) {
  const list = stages[stageIndex]
  const cost = stageCosts[stageIndex]
  const prevCost = stageIndex > 0 ? stageCosts[stageIndex - 1] : null
  const delta = purchaseDelta(prevCost, cost)
  const step = sumLines(delta, discount)
  const cumulativePay = discountedTotal(cost, discount)
  const target = list.targetPoints
  const stats: Stat[] = [
    {
      lbl: stageIndex === 0 ? 'Starter spend' : `This step (→ ${target})`,
      value: eur(step.pay),
      big: true,
      accent: 'green',
    },
    { lbl: `Total spent at ${target} pts`, value: eur(cumulativePay) },
    { lbl: 'Cost / point', value: list.totalPoints ? eur(cumulativePay / list.totalPoints) : '—' },
  ]
  return (
    <>
      <SummaryBar stats={stats} />
      <div className="grid">
        <ListPanel list={list} />
        <ShopPanel
          title={stageIndex === 0 ? 'Buy to start (500 pts)' : `Buy to reach ${target} pts`}
          headline={eur(step.pay)}
          lines={delta}
          discount={discount}
          emptyText="Nothing new — already covered by what you own."
          notes={cost.notes}
        />
      </div>
    </>
  )
}
