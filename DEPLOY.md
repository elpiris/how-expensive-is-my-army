# Deploying + collecting feedback

The app is a static site (Vite build in `dist/`) hosted on **Netlify**; feedback
is stored in a **Supabase** table. Both free plans are enough.

## 1. Create the feedback table (Supabase)

1. Open your project at <https://supabase.com/dashboard> (create one if needed: any
   name, a strong database password you keep somewhere safe, the region closest to
   you — e.g. Frankfurt or Paris).
2. Left sidebar → **SQL Editor** → **New query**.
3. Paste the whole of [`supabase/feedback.sql`](supabase/feedback.sql) and press **Run**.
   You should see "Success. No rows returned".
4. Left sidebar → **Project Settings** → **API**. Note two values for step 2:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public** key (a long string under "Project API keys"). This key is meant
     to be public; the table only lets it *add* feedback. **Never** use the
     `service_role` key in the app.

## 2. Publish the site (Netlify)

1. <https://app.netlify.com> → **Add new site** → **Import an existing project** →
   **GitHub** → pick `how-expensive-is-my-army`.
2. Build settings are read from [`netlify.toml`](netlify.toml) — leave the defaults.
3. Before deploying, open **Add environment variables** (or later: **Site
   configuration → Environment variables**) and add:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the anon public key
4. **Deploy**. After a minute the site is live at `https://<name>.netlify.app`
   (rename it under **Site configuration → Change site name**).
5. From now on every `git push` to `main` redeploys automatically. If you change the
   environment variables, trigger a redeploy (**Deploys → Trigger deploy**).

## 3. Check feedback works

1. Open the live site, rate a list with 👍 / 👎 (and a comment) and press **Send**.
2. Supabase → **Table Editor** → `feedback`: the row should be there, with the
   faction, points, seed and the list's units.

## Reading feedback later

- **Table Editor** shows rows like a spreadsheet; filter by `faction_id`, `rating`…
- **Export**: Table Editor → `feedback` → *Export → CSV*.
- To reproduce a rated list: in the app pick the same faction / sub-faction, points
  and mode — the `seed` column regenerates the exact list (as long as the generator
  hasn't changed since; the `list` column keeps what the user saw either way).
- Free Supabase projects **pause after ~1 week without activity** — feedback can't be
  sent while paused. The dashboard has a **Restore** button; data is kept.

## Local testing

Without the two variables the feedback form works but only logs the payload to the
browser console. To test against the real table, copy `.env.example` to
`.env.local`, fill in the values and restart `npm run dev`.
