-- Entry only: some staff key in records without being allowed to read the team's.
--
-- `profiles.entry_only` holds the modules where a person may add but not see what others added. Their own
-- entries stay visible so they can fix a mistake they just made. Deciding it is the owner's call, beside the
-- activity-history flag.
--
-- Run after staff-access-and-activity.sql, admin-role.sql, activity-viewers.sql and profile-and-pin.sql.

alter table public.profiles add column if not exists entry_only text[] not null default '{}';

create or replace function private.entry_only(m text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select m = any(entry_only) from public.profiles where id = auth.uid()), false)
$$;

grant execute on function private.entry_only(text) to authenticated;

-- Reads: the screen must be held, and if it is marked entry-only the person only sees their own rows.
alter policy "read leads" on public.leads
  using (private.can('leads') and (created_by = auth.uid() or not private.entry_only('leads')));

alter policy "edit leads" on public.leads
  using (private.can('leads') and (created_by = auth.uid() or not private.entry_only('leads')))
  with check (private.can('leads'));

alter policy "read quotes" on public.quotes
  using (private.can('quotes') and (created_by = auth.uid() or not private.entry_only('quotes')));

alter policy "edit quotes" on public.quotes
  using (private.can('quotes') and (created_by = auth.uid() or not private.entry_only('quotes')))
  with check (private.can('quotes'));

alter policy "read expenses" on public.expenses
  using (private.can('expenses') and (created_by = auth.uid() or not private.entry_only('expenses')));

-- The current guard, with the entry-only rule added. Keep this definition in step with the app: only the owner
-- may change entry_only, and a staff member can never change it on their own row.
create or replace function private.guard_owner_row() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  actor_role public.user_role;
begin
  if auth.uid() is null then return NEW; end if;
  select role into actor_role from public.profiles where id = auth.uid() and active;
  if actor_role is null then raise exception 'Your access is off'; end if;

  if NEW.id = auth.uid() and actor_role not in ('owner', 'admin') then
    if (to_jsonb(NEW) - 'full_name' - 'pin_set_at') is distinct from (to_jsonb(OLD) - 'full_name' - 'pin_set_at') then
      raise exception 'You can only change your own name';
    end if;
    return NEW;
  end if;

  if OLD.role = 'owner' and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can change the owner account';
  end if;

  if NEW.role is distinct from OLD.role
     and OLD.role = 'admin' and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can remove an admin';
  end if;

  if NEW.sees_activity is distinct from OLD.sees_activity and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can change who sees the activity history';
  end if;

  if NEW.entry_only is distinct from OLD.entry_only and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can decide who may see the data';
  end if;

  return NEW;
end $$;
