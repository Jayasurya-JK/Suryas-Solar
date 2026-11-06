-- Surya's Solar Office: the "admin" role.
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste everything -> Run.
-- Already applied to the live project (suryas-office) on 6 Nov 2026.
--
-- Admin = every owner power (all screens, approve people, read the activity history), but the
-- "owner" account stays the one that can never be locked out. Only an owner can change the owner.

-- 1) New role value. This must run on its own before the value can be used.
alter type public.user_role add value if not exists 'admin';

-- Run the rest in a second query, so the new value is visible.
-- 2) Who counts as an owner-level user. Every existing rule calls private.is_owner(), so adding
--    'admin' here gives admins full access everywhere without touching any policy.
create or replace function private.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','admin') and active from public.profiles where id = auth.uid()), false)
$$;

-- 3) The single top-level account. Used only to protect the owner from being locked out.
create or replace function private.is_super() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'owner' and active from public.profiles where id = auth.uid()), false)
$$;

create or replace function private.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','admin','staff') and active from public.profiles where id = auth.uid()), false)
$$;

create or replace function private.can(m text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select active and (role in ('owner','admin') or (role = 'staff' and m = any(perms))) from public.profiles where id = auth.uid()), false)
$$;

-- 4) First sign-up on a fresh project becomes the owner, unless an admin already exists.
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  uname text := lower(nullif(trim(meta->>'username'), ''));
  req text[];
  first boolean := not exists (select 1 from public.profiles where role in ('owner','admin'));
begin
  if uname is not null and (uname !~ '^[a-z0-9][a-z0-9._-]{2,19}$'
     or exists (select 1 from public.profiles where lower(username) = uname)) then
    uname := null;
  end if;
  req := array(
    select distinct x from jsonb_array_elements_text(
      case when jsonb_typeof(meta->'requested_perms') = 'array' then meta->'requested_perms' else '[]'::jsonb end) x
    where x in ('leads','quotes','expenses'));
  insert into public.profiles (id, email, full_name, username, role, perms, requested_perms, requested_at)
  values (
    new.id, new.email,
    left(coalesce(nullif(trim(meta->>'full_name'), ''), split_part(new.email, '@', 1)), 80),
    uname,
    case when first then 'owner'::public.user_role else 'pending'::public.user_role end,
    case when first then array['leads','quotes','expenses']::text[] else array[]::text[] end,
    req, now());
  return new;
end $$;

-- 5) An admin can manage everyone except the owner. Without this an admin could switch off or
--    demote the owner account and lock the business out of its own app.
create or replace function private.guard_owner_row() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'UPDATE' and OLD.role = 'owner' and auth.uid() is not null then
    if not exists (select 1 from public.profiles where id = auth.uid() and role = 'owner' and active) then
      raise exception 'Only the owner can change the owner account';
    end if;
  end if;
  return NEW;
end $$;
revoke execute on function private.guard_owner_row() from public, anon, authenticated;

drop trigger if exists guard_owner_row on public.profiles;
create trigger guard_owner_row before update on public.profiles for each row execute function private.guard_owner_row();
