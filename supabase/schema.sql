-- Lernwelt: eine Zeile pro Kind und gespeichertem App-Schlüssel.
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und "Run" klicken.

create table if not exists public.progress (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  key        text        not null,
  value      text,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.progress enable row level security;

-- Jedes Kind sieht und ändert nur den eigenen Fortschritt.
drop policy if exists "eigenen Fortschritt lesen" on public.progress;
create policy "eigenen Fortschritt lesen" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "eigenen Fortschritt anlegen" on public.progress;
create policy "eigenen Fortschritt anlegen" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "eigenen Fortschritt ändern" on public.progress;
create policy "eigenen Fortschritt ändern" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
