import { Fragment, useMemo, useState } from 'react'
import { factions, getFaction } from './data'
import { generateList } from './lib/generateList'
import { costList, discountedTotal } from './lib/costList'
import { isCharacter } from './lib/value'
import type { DiscountPercent, ListEntry, PointsBracket } from './types'

const BRACKETS: PointsBracket[] = [500, 1000, 1500, 2000]
const DISCOUNTS: DiscountPercent[] = [0, 10, 15, 20]

function eur(n: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n)
}

export default function App() {
  const [factionId, setFactionId] = useState(factions[0].id)
  const [bracket, setBracket] = useState<PointsBracket>(2000)
  const [discount, setDiscount] = useState<DiscountPercent>(0)
  const [seed, setSeed] = useState(() => Date.now())

  const faction = getFaction(factionId)!

  const list = useMemo(() => generateList(faction, bracket, seed), [faction, bracket, seed])
  const cost = useMemo(() => costList(list), [list])
  const finalTotal = useMemo(() => discountedTotal(cost, discount), [cost, discount])

  const saved = cost.rrpTotalEUR - finalTotal

  // Group the list into Characters / Battleline / Other for display.
  const listGroups = useMemo(() => {
    const groups: { label: string; entries: ListEntry[] }[] = [
      { label: 'Characters', entries: list.entries.filter((e) => isCharacter(e.unit)) },
      {
        label: 'Battleline',
        entries: list.entries.filter((e) => !isCharacter(e.unit) && e.unit.role === 'battleline'),
      },
      {
        label: 'Other units',
        entries: list.entries.filter(
          (e) => !isCharacter(e.unit) && e.unit.role !== 'battleline',
        ),
      },
    ]
    return groups.filter((g) => g.entries.length > 0)
  }, [list])

  return (
    <div className="app">
      <header className="hero">
        <h1>
          <span className="coin">💰</span> How Expensive Is My Army?
        </h1>
        <p className="tagline">
          Auto-build a Warhammer&nbsp;40,000 army list and price it up in euros — Combat Patrols
          included to keep the damage down.
        </p>
      </header>

      <section className="controls" aria-label="Army options">
        <div className="control">
          <label htmlFor="faction">Faction</label>
          <select
            id="faction"
            value={factionId}
            onChange={(e) => setFactionId(e.target.value)}
          >
            {factions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

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

        <div className="control grow">
          <label>&nbsp;</label>
          <button className="primary" onClick={() => setSeed(Date.now())}>
            🎲 Reroll list
          </button>
        </div>
      </section>

      <div className="blurb">
        <strong>{faction.name}.</strong> {faction.blurb}
      </div>

      <div className="grid">
        {/* ---- Army list ---- */}
        <section className="panel">
          <div className="panel-head">
            <h2>The list</h2>
            <div className="pts-badge">
              {list.totalPoints} <span>/ {bracket} pts</span>
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
                {listGroups.map((g) => {
                  const sub = g.entries.reduce((s, e) => s + e.unit.points * e.count, 0)
                  return (
                    <Fragment key={g.label}>
                      <tr className="group-row">
                        <td colSpan={2}>{g.label}</td>
                        <td className="num">{sub} pts</td>
                      </tr>
                      {/* One row per unit copy, so each squad is listed separately. */}
                      {g.entries.flatMap((e) =>
                        Array.from({ length: e.count }, (_, i) => (
                          <tr key={`${e.unit.id}-${i}`}>
                            <td>
                              {e.unit.epicHero && <span className="tag epic">Epic</span>}
                              {e.unit.name}
                            </td>
                            <td className="num">{e.unit.models}</td>
                            <td className="num">{e.unit.points}</td>
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

        {/* ---- Shopping list ---- */}
        <section className="panel">
          <div className="panel-head">
            <h2>What to buy</h2>
            <div className="pts-badge cost">{eur(cost.rrpTotalEUR)}</div>
          </div>

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
              {cost.lines.map((l, i) => (
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
                  <td className="num">{eur(l.unitPriceEUR)}</td>
                  <td className="num">{eur(l.lineTotalEUR)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {cost.notes.length > 0 && (
            <details className="surplus">
              <summary>Surplus & notes ({cost.notes.length})</summary>
              <ul>
                {cost.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </details>
          )}
        </section>
      </div>

      {/* ---- Totals / discount ---- */}
      <section className="totals">
        <div className="discount">
          <span className="disc-label">Retailer discount</span>
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
          {cost.nonDiscountableEUR > 0 && (
            <p className="disc-note">
              {eur(cost.nonDiscountableEUR)} is GW-webstore exclusive and can’t be discounted.
            </p>
          )}
        </div>

        <div className="grand">
          <div className="grand-row">
            <span>RRP total</span>
            <span className={discount ? 'struck' : 'strong'}>{eur(cost.rrpTotalEUR)}</span>
          </div>
          {discount > 0 && (
            <>
              <div className="grand-row saved">
                <span>You save ({discount}%)</span>
                <span>−{eur(saved)}</span>
              </div>
              <div className="grand-row total">
                <span>You pay</span>
                <span className="strong">{eur(finalTotal)}</span>
              </div>
            </>
          )}
          <div className="grand-row ppp">
            <span>Cost per point</span>
            <span>{list.totalPoints ? eur(finalTotal / list.totalPoints) : '—'}</span>
          </div>
        </div>
      </section>

      <footer className="foot">
        <p>
          <strong>Prices</strong> were verified on{' '}
          <a href="https://www.warhammer.com/en-EU/" target="_blank" rel="noreferrer">
            warhammer.com
          </a>{' '}
          (EU store) on <strong>{faction.lastVerified}</strong>; entries marked{' '}
          <span className="tag approx">≈ price</span> are not yet confirmed — check before buying.
          <br />
          {faction.pointsVerified ? (
            <>
              <strong>Points</strong> are sourced from Wahapedia (11th edition), verified{' '}
              {faction.lastVerified}. The 3rd+ copy of a unit costs a few points more than shown
              (escalating-cost rule, not modelled here). Not affiliated with Games Workshop.
            </>
          ) : (
            <>
              <strong>Points</strong> are indicative 11th-edition estimates and are{' '}
              <em>not yet sourced</em> from the official Munitorum Field Manual, so don’t rely on
              exact totals yet. Not affiliated with Games Workshop.
            </>
          )}
        </p>
      </footer>
    </div>
  )
}
