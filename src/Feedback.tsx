import { useEffect, useState } from 'react'
import { sendFeedback, APP_VERSION, type FeedbackPayload } from './lib/feedback'
import type { GeneratedList } from './types'

/** What the feedback is about: the list on screen and the settings that made it. */
export interface FeedbackContext {
  list: GeneratedList
  priceEUR: number
  mode: 'quick' | 'escalation'
  stage: number | null
  seed: number
  discount: number
  includeDaemons: boolean | null
  customProfile: unknown
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * "Rate this list" (👍 / 👎 + optional comment) and general app feedback, sent
 * to the feedback table with enough context to regenerate the exact list.
 */
export function FeedbackPanel({ context }: { context: FeedbackContext }) {
  const [kind, setKind] = useState<'list' | 'app'>('list')
  const [rating, setRating] = useState<1 | -1 | null>(null)
  const [comment, setComment] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  // A new list (reroll, other faction…) starts a fresh rating.
  const listKey = `${context.list.faction.id}|${context.seed}|${context.list.targetPoints}|${context.mode}`
  useEffect(() => {
    if (kind === 'list') {
      setRating(null)
      setComment('')
      setStatus('idle')
    }
  }, [listKey])

  const canSend =
    status !== 'sending' && (kind === 'list' ? rating !== null || comment.trim() !== '' : comment.trim() !== '')

  const send = async () => {
    const { list } = context
    const payload: FeedbackPayload = {
      kind,
      rating: kind === 'list' ? rating : null,
      comment: comment.trim() || null,
      contact: contact.trim() || null,
      faction_id: list.faction.id,
      mode: context.mode,
      points: list.targetPoints,
      stage: context.stage,
      seed: context.seed,
      discount: context.discount,
      include_daemons: context.includeDaemons,
      custom_profile: context.customProfile ?? null,
      list:
        kind === 'list'
          ? list.entries.map((e) => ({ id: e.unit.id, name: e.unit.name, count: e.count }))
          : null,
      total_points: list.totalPoints,
      price_eur: context.priceEUR,
      app_version: APP_VERSION,
    }
    setStatus('sending')
    setError('')
    try {
      await sendFeedback(payload)
      setStatus('sent')
      setComment('')
      setRating(null)
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Feedback not sent.')
    }
  }

  return (
    <section className="panel feedback" aria-label="Feedback">
      <div className="panel-head">
        <h2>Feedback</h2>
        <div className="segmented small">
          <button className={kind === 'list' ? 'seg active' : 'seg'} onClick={() => { setKind('list'); setStatus('idle') }}>
            This list
          </button>
          <button className={kind === 'app' ? 'seg active' : 'seg'} onClick={() => { setKind('app'); setStatus('idle') }}>
            The app
          </button>
        </div>
      </div>

      {status === 'sent' ? (
        <p className="fb-thanks">
          Thanks — your feedback was sent! {kind === 'list' && 'Reroll and rate another list any time.'}
          <button className="link" onClick={() => setStatus('idle')}>
            Send more
          </button>
        </p>
      ) : (
        <>
          {kind === 'list' ? (
            <div className="fb-rate">
              <span>Does this list look right for {context.list.faction.name}?</span>
              <button
                className={rating === 1 ? 'fb-thumb active' : 'fb-thumb'}
                onClick={() => setRating(rating === 1 ? null : 1)}
                aria-label="Looks good"
                title="Looks good"
              >
                👍
              </button>
              <button
                className={rating === -1 ? 'fb-thumb active down' : 'fb-thumb'}
                onClick={() => setRating(rating === -1 ? null : -1)}
                aria-label="Something's off"
                title="Something's off"
              >
                👎
              </button>
            </div>
          ) : (
            <p className="fb-hint">Ideas, bugs, a wrong price or points value — anything about the app.</p>
          )}
          <textarea
            className="fb-text"
            rows={3}
            maxLength={2000}
            placeholder={
              kind === 'list'
                ? 'Optional: what’s off? (e.g. too many characters, a wrong box, a unit you never see…)'
                : 'Your feedback…'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="fb-foot">
            <input
              className="fb-contact"
              type="text"
              maxLength={200}
              placeholder="Optional: name or email if you’d like a reply"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <button className="primary" disabled={!canSend} onClick={send}>
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </div>
          {status === 'error' && <p className="fb-error">{error}</p>}
          <p className="fb-note">
            {kind === 'list'
              ? 'Sends your rating with the list’s settings (faction, points, seed) so it can be reproduced. '
              : ''}
            Nothing personal is collected unless you add it above.
          </p>
        </>
      )}
    </section>
  )
}
