-- Restricts the activity history to a named few.
--
-- Before this, `activity_log` was readable by anyone private.is_owner() accepted, which includes every
-- admin. The business only wants the owner and one named person to read it, so visibility now comes from
-- an explicit flag on the profile instead of the role.
--
-- Run after staff-access-and-activity.sql and admin-role.sql.

alter table public.profiles add column if not exists sees_activity boolean not null default false;

create or replace function private.can_see_activity() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select active and (role = 'owner' or sees_activity) from public.profiles where id = auth.uid()), false)
$$;
revoke execute on function private.can_see_activity() from public, anon;
grant execute on function private.can_see_activity() to authenticated;

-- `alter` instead of drop-and-create so the policy is never momentarily missing.
alter policy "owner reads activity" on public.activity_log to authenticated using (private.can_see_activity());

-- The owner always keeps it; grant it to the named person as well.
update public.profiles set sees_activity = true
where role = 'owner' or username = 'kanimolzhi';
