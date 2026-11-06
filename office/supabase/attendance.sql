-- Daily attendance: every staff member marks Working / Working partially / Leave once a day.
--
-- One row per person per day, so re-marking the same day corrects the row instead of adding another.
-- Run after staff-access-and-activity.sql, admin-role.sql, activity-viewers.sql and profile-and-pin.sql.

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_date date not null default current_date,
  status text not null check (status in ('working', 'partial', 'leave')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, work_date)
);

create index if not exists attendance_date_idx on public.attendance (work_date);

-- A plain `create table` does not grant anything, and RLS alone is not enough: without these the app gets
-- "permission denied for table attendance" even for the owner.
grant select, insert, update, delete on public.attendance to authenticated;
grant select on public.attendance to service_role;

alter table public.attendance enable row level security;

create policy "read own or admin" on public.attendance for select to authenticated
  using (user_id = auth.uid() or private.is_owner());

-- Only today can be marked, and only for yourself. Back-dating is not possible from the app.
create policy "mark own day" on public.attendance for insert to authenticated
  with check (user_id = auth.uid() and work_date = current_date);

create policy "change own day" on public.attendance for update to authenticated
  using (user_id = auth.uid() and work_date = current_date)
  with check (user_id = auth.uid());

-- The owner and admins can correct someone else's day (a missed mark, a wrong tap).
create policy "admin changes any day" on public.attendance for update to authenticated
  using (private.is_owner()) with check (private.is_owner());

create policy "admin deletes a day" on public.attendance for delete to authenticated
  using (private.is_owner());
