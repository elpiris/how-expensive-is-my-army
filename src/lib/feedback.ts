import pkg from '../../package.json'

// ---------------------------------------------------------------------------
// Feedback — stored in a Supabase table (see supabase/feedback.sql) through its
// REST API, no extra dependency. The browser only holds the public "anon" key,
// which the table's row-level security limits to INSERT: visitors can send
// feedback but never read it back. Configured with two build-time env vars
// (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — see .env.example / DEPLOY.md);
// without them (local dev) the payload is logged to the console instead.
// ---------------------------------------------------------------------------

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** "0.1.0+abc1234" — package version + the deployed commit (Netlify sets it). */
export const APP_VERSION = `${pkg.version}+${((import.meta.env.VITE_COMMIT_REF as string | undefined) ?? 'dev').slice(0, 7)}`

export const feedbackConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

/** One row of the `feedback` table (snake_case = column names). */
export interface FeedbackPayload {
  kind: 'list' | 'app'
  /** +1 / -1 for a list rating, null for general feedback. */
  rating: 1 | -1 | null
  comment: string | null
  contact: string | null
  /** Everything needed to regenerate the exact list (the generator is seeded). */
  faction_id: string | null
  mode: 'quick' | 'escalation' | null
  points: number | null
  stage: number | null
  seed: number | null
  discount: number | null
  include_daemons: boolean | null
  custom_profile: unknown
  /** What the user saw, in case the generator changes later. */
  list: { id: string; name: string; count: number }[] | null
  total_points: number | null
  price_eur: number | null
  app_version: string
}

/** Send one feedback row. Resolves on success, throws with a message otherwise. */
export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  if (!feedbackConfigured) {
    console.info('[feedback] Supabase not configured — would send:', payload)
    return
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Feedback not sent (${res.status}). Please try again later.`)
}
