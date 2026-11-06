-- Restricts the activity history to the people the owner names.
--
-- Before this, `activity_log` was readable by anyone private.is_owner() accepted, which includes every
-- admin. The business only wants the owner plus whoever the owner picks, so visibility now comes from an
-- explicit flag on the profile instead of the role.
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

-- Hands the choice to the owner only. Replaces the version in admin-role.sql.
create or replace function private.guard_owner_row() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  actor_role public.user_role;
begin
  if auth.uid() is null then return NEW; end if;
  select role into actor_role from public.profiles where id = auth.uid() and active;

  if OLD.role = 'owner' and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can change the owner account';
  end if;

  if NEW.role is distinct from OLD.role
     and (OLD.role = 'admin' or NEW.role = 'admin')
     and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can make or remove an admin';
  end if;

  if NEW.sees_activity is distinct from OLD.sees_activity
     and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can change who sees the activity history';
  end if;

  return NEW;
end $$;

-- The owner always keeps it; the owner switches it on for anyone else from Settings > Team > Manage.
update public.profiles set sees_activity = true where role = 'owner';
