-- Feedback table for "How Expensive Is My Army?" (paste into Supabase → SQL Editor → Run).
--
-- The app sends rows with the public "anon" key. Row-level security allows that
-- key to INSERT only: visitors can submit feedback but never read, edit or
-- delete it. You read it in the Supabase dashboard (Table Editor), which uses
-- your own admin access.

create table if not exists public.feedback (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  kind           text not null check (kind in ('list', 'app')),
  rating         smallint check (rating in (-1, 1)),
  comment        text check (char_length(comment) <= 2000),
  contact        text check (char_length(contact) <= 200),
  -- Settings that regenerate the exact list (the generator is seeded).
  faction_id     text check (char_length(faction_id) <= 100),
  mode           text check (mode in ('quick', 'escalation')),
  points         integer,
  stage          integer,
  seed           bigint,
  discount       integer,
  include_daemons boolean,
  custom_profile jsonb,
  -- What the user saw (unit id / name / count), in case the generator changes.
  list           jsonb check (octet_length(list::text) <= 20000),
  total_points   integer,
  price_eur      numeric(8, 2),
  app_version    text check (char_length(app_version) <= 50)
);

alter table public.feedback enable row level security;

-- Anyone using the app may add feedback; nobody can read it through the API.
drop policy if exists "anyone can send feedback" on public.feedback;
create policy "anyone can send feedback"
  on public.feedback for insert
  to anon
  with check (true);

-- Handy views for later analysis (run in the SQL Editor):
--   select faction_id, count(*) filter (where rating = 1) as up,
--          count(*) filter (where rating = -1) as down
--   from feedback where kind = 'list' group by faction_id order by down desc;
