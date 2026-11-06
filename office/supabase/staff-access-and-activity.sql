-- Surya's Solar Office: staff access requests, per-screen access and activity history.
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste everything -> Run.
-- PART 1 only adds things. PART 2 replaces the "who can see what" rules for leads, quotes and expenses.
-- No table, row or file is deleted.

-- =====================================================================
-- PART 1: add things
-- =====================================================================

-- 1) Fields on each person: User ID, the screens they asked for, the screens they were given
alter table public.profiles
  add column if not exists username text,
  add column if not exists perms text[] not null default array['leads','quotes','expenses']::text[],
  add column if not exists requested_perms text[] not null default array[]::text[],
  add column if not exists requested_at timestamptz,
  add column if not exists decided_at timestamptz,
  add column if not exists active boolean not null default true,
  add column if not exists last_seen_at timestamptz;
alter table public.profiles drop constraint if exists profiles_perms_check;
alter table public.profiles add constraint profiles_perms_check
  check (perms <@ array['leads','quotes','expenses']::text[] and requested_perms <@ array['leads','quotes','expenses']::text[]);
create unique index if not exists profiles_username_key on public.profiles (lower(username)) where username is not null;

-- 2) New sign-ups arrive as "pending" with the screens they asked for. They get nothing until the owner approves.
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  uname text := lower(nullif(trim(meta->>'username'), ''));
  req text[];
  first_owner boolean := not exists (select 1 from public.profiles where role = 'owner');
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
    case when first_owner then 'owner'::public.user_role else 'pending'::public.user_role end,
    case when first_owner then array['leads','quotes','expenses']::text[] else array[]::text[] end,
    req, now());
  return new;
end $$;

-- 3) Helper: can this person use a screen? (owner = all; staff = only the ones ticked for them)
create or replace function private.can(m text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select active and (role = 'owner' or (role = 'staff' and m = any(perms))) from public.profiles where id = auth.uid()), false)
$$;
revoke execute on function private.can(text) from public, anon;
grant execute on function private.can(text) to authenticated;

-- 4) "Last active" ping
create or replace function public.touch_seen() returns void
language sql security definer set search_path = public as $$
  update public.profiles set last_seen_at = now()
  where id = auth.uid() and (last_seen_at is null or last_seen_at < now() - interval '2 minutes');
$$;
revoke execute on function public.touch_seen() from public, anon;
grant execute on function public.touch_seen() to authenticated;

-- 5) Activity log (only the owner can read it)
create table if not exists public.activity_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid,
  actor_name text,
  table_name text,
  record_id uuid,
  action text not null,
  label text,
  summary text,
  changes jsonb
);
create index if not exists activity_log_at_idx on public.activity_log (at desc);
create index if not exists activity_log_record_idx on public.activity_log (record_id);
create index if not exists activity_log_actor_idx on public.activity_log (actor);
alter table public.activity_log enable row level security;
grant select on public.activity_log to authenticated;
drop policy if exists "owner reads activity" on public.activity_log;
create policy "owner reads activity" on public.activity_log for select to authenticated using (private.is_owner());

create or replace function private.row_diff(o jsonb, n jsonb) returns jsonb
language plpgsql immutable set search_path = public as $$
declare k text; kk text; res jsonb := '{}'::jsonb; ov jsonb; nv jsonb; sov jsonb; snv jsonb;
begin
  for k in select jsonb_object_keys(coalesce(o,'{}'::jsonb) || coalesce(n,'{}'::jsonb)) loop
    if k in ('updated_at','created_at','id','created_by','last_seen_at','next_quote_no','requested_at') then continue; end if;
    ov := o -> k; nv := n -> k;
    if ov is not distinct from nv then continue; end if;
    if jsonb_typeof(ov) = 'object' and jsonb_typeof(nv) = 'object' then
      for kk in select jsonb_object_keys(ov || nv) loop
        sov := ov -> kk; snv := nv -> kk;
        if sov is distinct from snv then
          res := res || jsonb_build_object(k || '.' || kk, jsonb_build_array(sov, snv));
        end if;
      end loop;
    else
      res := res || jsonb_build_object(k, jsonb_build_array(ov, nv));
    end if;
  end loop;
  return res;
end $$;

create or replace function private.log_change() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  who text; rec jsonb; old_j jsonb; chg jsonb; lbl text; act text; kind text; sm text; rid uuid;
begin
  if TG_TABLE_NAME = 'profiles' and uid is null then return coalesce(NEW, OLD); end if;
  select full_name into who from public.profiles where id = uid;
  if TG_OP = 'DELETE' then rec := to_jsonb(OLD); else rec := to_jsonb(NEW); end if;
  old_j := case when TG_OP = 'INSERT' then null else to_jsonb(OLD) end;
  kind := case TG_TABLE_NAME when 'leads' then 'lead' when 'quotes' then 'quote' when 'expenses' then 'expense'
    when 'packages' then 'package' when 'brands' then 'brand' when 'app_settings' then 'settings'
    when 'profiles' then 'team member' else TG_TABLE_NAME end;
  lbl := case TG_TABLE_NAME
    when 'leads' then rec->>'name'
    when 'quotes' then (rec->>'ref_no') || ' · ' || coalesce(rec#>>'{customer,name}', '')
    when 'expenses' then '₹' || (rec->>'amount') || ' ' || (rec->>'category')
    when 'profiles' then coalesce(rec->>'full_name', rec->>'email')
    when 'packages' then rec->>'name'
    when 'brands' then rec->>'name'
    else '' end;
  rid := case when TG_TABLE_NAME = 'app_settings' then null else (rec->>'id')::uuid end;
  if TG_OP = 'INSERT' then
    act := 'create'; chg := null;
    if TG_TABLE_NAME = 'leads' and rec->>'source' = 'website' then
      who := 'Website form'; sm := 'New website enquiry: ' || lbl;
    else
      sm := 'Added ' || kind || ' ' || lbl;
    end if;
  elsif TG_OP = 'UPDATE' then
    chg := private.row_diff(old_j, rec);
    if chg = '{}'::jsonb then return NEW; end if;
    act := 'update'; sm := 'Edited ' || kind || ' ' || lbl;
  else
    act := 'delete'; chg := jsonb_build_object('deleted', old_j); sm := 'Deleted ' || kind || ' ' || lbl;
  end if;
  insert into public.activity_log (actor, actor_name, table_name, record_id, action, label, summary, changes)
  values (uid, coalesce(who, case when uid is null then 'System' else 'Unknown' end), TG_TABLE_NAME, rid, act, trim(lbl), trim(sm), chg);
  return coalesce(NEW, OLD);
end $$;
revoke execute on function private.log_change() from public, anon, authenticated;

drop trigger if exists audit_leads on public.leads;
drop trigger if exists audit_quotes on public.quotes;
drop trigger if exists audit_expenses on public.expenses;
drop trigger if exists audit_packages on public.packages;
drop trigger if exists audit_brands on public.brands;
drop trigger if exists audit_settings on public.app_settings;
drop trigger if exists audit_profiles on public.profiles;
create trigger audit_leads after insert or update or delete on public.leads for each row execute function private.log_change();
create trigger audit_quotes after insert or update or delete on public.quotes for each row execute function private.log_change();
create trigger audit_expenses after insert or update or delete on public.expenses for each row execute function private.log_change();
create trigger audit_packages after insert or update or delete on public.packages for each row execute function private.log_change();
create trigger audit_brands after insert or update or delete on public.brands for each row execute function private.log_change();
create trigger audit_settings after update on public.app_settings for each row execute function private.log_change();
create trigger audit_profiles after update on public.profiles for each row execute function private.log_change();

-- 6) Things that change no row: sign-ins, PDF downloads, WhatsApp sends, bill views
create or replace function public.log_event(p_action text, p_table text default null, p_record uuid default null, p_label text default null)
returns void language plpgsql security definer set search_path = public as $$
declare who text; sm text;
begin
  if not private.is_member() then return; end if;
  if p_action not in ('login','logout','pdf','whatsapp','bill_view') then return; end if;
  select full_name into who from public.profiles where id = auth.uid();
  sm := case p_action
    when 'login' then 'Signed in'
    when 'logout' then 'Signed out'
    when 'pdf' then 'Downloaded the PDF of ' || coalesce(p_label, 'a quote')
    when 'whatsapp' then 'Sent ' || coalesce(p_label, 'a quote') || ' on WhatsApp'
    else 'Viewed a bill photo' end;
  insert into public.activity_log (actor, actor_name, table_name, record_id, action, label, summary)
  values (auth.uid(), coalesce(who, 'Unknown'), p_table, p_record, p_action, left(p_label, 120), sm);
end $$;
revoke execute on function public.log_event(text, text, uuid, text) from public, anon;
grant execute on function public.log_event(text, text, uuid, text) to authenticated;

-- =====================================================================
-- PART 2: who can see what (staff only reach the screens ticked for them)
-- =====================================================================

create or replace function private.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','staff') and active from public.profiles where id = auth.uid()), false)
$$;

-- leads
drop policy if exists "read leads" on public.leads;
drop policy if exists "add leads" on public.leads;
drop policy if exists "edit leads" on public.leads;
create policy "read leads" on public.leads for select to authenticated
  using (private.is_owner() or (private.can('leads') and (created_by = auth.uid() or assigned_to = auth.uid())));
create policy "add leads" on public.leads for insert to authenticated
  with check (private.can('leads') and created_by = auth.uid());
create policy "edit leads" on public.leads for update to authenticated
  using (private.is_owner() or (private.can('leads') and (created_by = auth.uid() or assigned_to = auth.uid())))
  with check (private.can('leads'));

-- quotes
drop policy if exists "read quotes" on public.quotes;
drop policy if exists "add quotes" on public.quotes;
drop policy if exists "edit quotes" on public.quotes;
create policy "read quotes" on public.quotes for select to authenticated
  using (private.is_owner() or (private.can('quotes') and created_by = auth.uid()));
create policy "add quotes" on public.quotes for insert to authenticated
  with check (private.can('quotes') and created_by = auth.uid());
create policy "edit quotes" on public.quotes for update to authenticated
  using (private.is_owner() or (private.can('quotes') and created_by = auth.uid()))
  with check (private.can('quotes'));

-- expenses (staff can fix their own entries for 2 days)
drop policy if exists "read expenses" on public.expenses;
drop policy if exists "add expenses" on public.expenses;
drop policy if exists "edit expenses" on public.expenses;
create policy "read expenses" on public.expenses for select to authenticated
  using (private.is_owner() or (private.can('expenses') and created_by = auth.uid()));
create policy "add expenses" on public.expenses for insert to authenticated
  with check (private.can('expenses') and created_by = auth.uid());
create policy "edit expenses" on public.expenses for update to authenticated
  using (private.is_owner() or (private.can('expenses') and created_by = auth.uid() and spent_on >= current_date - 2))
  with check (private.can('expenses'));

-- price packages are needed to make quotes
drop policy if exists "members read packages" on public.packages;
create policy "members read packages" on public.packages for select to authenticated using (private.can('quotes'));

-- bill photos
drop policy if exists "members upload bills" on storage.objects;
create policy "members upload bills" on storage.objects for insert to authenticated
  with check (bucket_id = 'bills' and private.can('expenses') and (storage.foldername(name))[1] = auth.uid()::text);

-- quote numbers
create or replace function public.next_quote_ref() returns text
language plpgsql security definer set search_path = public as $$
declare n int; p text;
begin
  if not private.can('quotes') then raise exception 'not allowed'; end if;
  update public.app_settings set next_quote_no = next_quote_no + 1 where id = 1
    returning next_quote_no - 1, quote_prefix into n, p;
  return p || '/' || lpad(n::text, 4, '0') || '/' || to_char(now() at time zone 'Asia/Kolkata', 'YY');
end $$;
