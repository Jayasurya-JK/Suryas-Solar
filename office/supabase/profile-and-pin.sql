-- Own-name editing, plus the sign-in PIN.
--
-- A person may change their own name from /profile, and set a 4 to 6 digit PIN. The PIN is not stored
-- beside the password: it becomes the password (`auth.users.encrypted_password`), so signing in with a
-- User ID and a PIN is an ordinary Supabase password login.
--
-- Run after staff-access-and-activity.sql, admin-role.sql and activity-viewers.sql.

alter table public.profiles add column if not exists pin_set_at timestamptz;

create policy "own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Final guard. Supersedes the version in activity-viewers.sql.
--   * anyone may edit their own name, nothing else on themselves
--   * an admin may make another admin; removing one stays with the owner
--   * only the owner touches the owner account or `sees_activity`
create or replace function private.guard_owner_row() returns trigger
language plpgsql security definer set search_path = 'public' as $$
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

  if NEW.role is distinct from OLD.role then
    if OLD.role = 'admin' and actor_role is distinct from 'owner' then
      raise exception 'Only the owner can remove an admin';
    end if;
  end if;

  if NEW.sees_activity is distinct from OLD.sees_activity and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can change who sees the activity history';
  end if;

  return NEW;
end $$;

create or replace function public.set_my_pin(p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if p_pin is null or p_pin !~ '^[0-9]{4,6}$' then raise exception 'The PIN must be 4 to 6 digits'; end if;
  if p_pin ~ '^(.)\1+$' then raise exception 'That PIN is too easy. Pick something less obvious'; end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_pin, extensions.gen_salt('bf')), updated_at = now()
   where id = auth.uid();
  update public.profiles set pin_set_at = now() where id = auth.uid();
end $$;

create or replace function public.reset_member_pin(p_member uuid, p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare
  actor_role public.user_role;
  target_role public.user_role;
begin
  select role into actor_role from public.profiles where id = auth.uid() and active;
  if actor_role is null or actor_role not in ('owner', 'admin') then
    raise exception 'Only an admin can reset a PIN';
  end if;
  if p_pin is null or p_pin !~ '^[0-9]{4,6}$' then raise exception 'The PIN must be 4 to 6 digits'; end if;
  select role into target_role from public.profiles where id = p_member;
  if target_role is null then raise exception 'That person was not found'; end if;
  if target_role = 'owner' and actor_role is distinct from 'owner' then
    raise exception 'Only the owner can reset the owner PIN';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_pin, extensions.gen_salt('bf')), updated_at = now()
   where id = p_member;
  update public.profiles set pin_set_at = now() where id = p_member;
end $$;

revoke all on function public.set_my_pin(text) from public, anon;
revoke all on function public.reset_member_pin(uuid, text) from public, anon;
grant execute on function public.set_my_pin(text) to authenticated;
grant execute on function public.reset_member_pin(uuid, text) to authenticated;
