-- Crashes reported by the app itself, so "it is not opening" becomes a message we can read.
-- Written by src/lib/reportError.js from any signed-in phone or laptop.

create table if not exists public.client_errors (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  user_id uuid default auth.uid(),
  kind text,
  message text,
  stack text,
  page text,
  ua text,
  online boolean,
  version text
);

create index if not exists client_errors_created_idx on public.client_errors (created_at desc);

alter table public.client_errors enable row level security;

-- Anyone signed in may report; only the owner may read. Nobody can edit or delete.
drop policy if exists "report own error" on public.client_errors;
create policy "report own error" on public.client_errors
  for insert to authenticated with check (true);

drop policy if exists "owner reads errors" on public.client_errors;
create policy "owner reads errors" on public.client_errors
  for select to authenticated using (private.is_owner());

revoke all on public.client_errors from anon;
