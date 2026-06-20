-- Vynyl — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
--
-- Stores each user's library (liked songs + playlists) as one row, locked down
-- with Row Level Security so a user can only ever read/write their own row.

create table if not exists public.user_library (
  user_id    uuid primary key references auth.users on delete cascade,
  liked      jsonb not null default '{}'::jsonb,
  playlists  jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_library enable row level security;

create policy "Users read own library"
  on public.user_library for select
  using (auth.uid() = user_id);

create policy "Users insert own library"
  on public.user_library for insert
  with check (auth.uid() = user_id);

create policy "Users update own library"
  on public.user_library for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
