import { Fragment, useMemo, useState } from 'react'
import { factions, getFaction } from './data'
import { generateList, generateEscalation, BRACKETS } from './lib/generateList'
import { costList, discountedTotal, purchaseDelta, sumLines } from './lib/costList'
import { copyPoints, copySurcharge, entryPoints, escalateAt, isCharacter } from './lib/value'

/** "2nd+" / "3rd+" / "4th+" — the copy at which a datasheet's cost escalates. */
function ordinalPlus(n: number): string {
  const s = n === 2 ? '2nd' : n === 3 ? '3rd' : n === 4 ? '4th' : `${n}th`
  return `${s}+`
}
import type { CostBreakdown, DiscountPercent, GeneratedList, ListEntry, PurchaseLine } from './types'

const DISCOUNTS: DiscountPercent[] = [0, 10, 15, 20]

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
  const [appMode, setAppMode] = useState<'quick' | 'escalation'>('quick')
  const [bracket, setBracket] = useState<(typeof BRACKETS)[number]>(2000)
  const [stageIndex, setStageIndex] = useState(0)
  const [discount, setDiscount] = useState<DiscountPercent>(0)
  const [seed, setSeed] = useState(() => Date.now())

  const faction = getFaction(factionId)!

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
          <select id="faction" value={factionId} onChange={(e) => setFactionId(e.target.value)}>
            {factions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

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
