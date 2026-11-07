-- =====================================================================
-- Projects: every customer, from the first survey to the last payment.
--
-- Paste this whole file into the Supabase SQL editor and press Run.
-- It is safe to run twice: nothing is dropped and no existing table is touched.
-- =====================================================================

-- 1) Crash log written by the app (src/lib/reportError.js) -----------------
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
drop policy if exists "report own error" on public.client_errors;
create policy "report own error" on public.client_errors for insert to authenticated with check (true);
drop policy if exists "owner reads errors" on public.client_errors;
create policy "owner reads errors" on public.client_errors for select to authenticated using (private.is_owner());
revoke all on public.client_errors from anon;
grant select, insert on public.client_errors to authenticated;

-- 2) Projects ------------------------------------------------------------
create sequence if not exists public.project_ref_seq;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  ref_no text unique,
  lead_id uuid references public.leads(id) on delete set null,
  customer text not null,
  phone text,
  town text,
  address text,
  system_kw numeric,
  panel_brand text,
  project_type text not null default 'residential',
  subsidy boolean not null default true,
  quoted_amount numeric not null default 0,
  stage text not null default 'survey',
  status text not null default 'open',
  started_on date not null default current_date,
  target_on date,
  completed_on date,
  notes text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_status_idx on public.projects (status, stage);
create index if not exists projects_phone_idx on public.projects (phone);

create table if not exists public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  key text not null,
  name text not null,
  position int not null default 0,
  status text not null default 'pending',
  due_on date,
  done_on date,
  note text
);
create index if not exists project_steps_project_idx on public.project_steps (project_id, position);

create table if not exists public.project_payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null default 'part',
  amount numeric not null,
  paid_on date not null default current_date,
  mode text default 'cash',
  reference text,
  note text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists project_payments_project_idx on public.project_payments (project_id, paid_on desc);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null default 'document',
  path text not null,
  name text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists project_files_project_idx on public.project_files (project_id);

-- 3) The eleven steps every rooftop job goes through, created with the project
create or replace function private.seed_project_steps() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.project_steps (project_id, key, name, position) values
    (new.id, 'survey',    'Enquiry and site survey',        1),
    (new.id, 'quote',     'Quotation given',                2),
    (new.id, 'advance',   'Advance received',               3),
    (new.id, 'material',  'Structure and material at site', 4),
    (new.id, 'install',   'Panel and inverter fixed',       5),
    (new.id, 'wiring',    'Wiring and earthing',            6),
    (new.id, 'meter_app', 'Net meter application (TNEB)',    7),
    (new.id, 'meter',     'Net meter installed',            8),
    (new.id, 'subsidy',   'Subsidy application filed',      9),
    (new.id, 'subsidy_ok','Subsidy received',              10),
    (new.id, 'handover',  'Final payment and handover',    11);
  return new;
end $$;

drop trigger if exists seed_project_steps on public.projects;
create trigger seed_project_steps after insert on public.projects
  for each row execute function private.seed_project_steps();

-- 4) Reference number and timestamps
create or replace function private.project_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.ref_no is null then
    new.ref_no := 'SSP/' || lpad(nextval('public.project_ref_seq')::text, 4, '0') || '/' || to_char(now(), 'YY');
  end if;
  new.updated_at := now();
  if new.status = 'completed' and new.completed_on is null then new.completed_on := current_date; end if;
  return new;
end $$;

drop trigger if exists project_before_write on public.projects;
create trigger project_before_write before insert or update on public.projects
  for each row execute function private.project_before_write();

-- 5) Who may see and change what (same rule as leads: a screen, plus own-rows-only for entry staff)
alter table public.projects enable row level security;
alter table public.project_steps enable row level security;
alter table public.project_payments enable row level security;
alter table public.project_files enable row level security;

drop policy if exists "read projects" on public.projects;
drop policy if exists "add projects" on public.projects;
drop policy if exists "edit projects" on public.projects;
drop policy if exists "owner deletes projects" on public.projects;
create policy "read projects" on public.projects for select to authenticated
  using (private.can('projects') and (not private.entry_only('projects') or created_by = auth.uid()));
create policy "add projects" on public.projects for insert to authenticated
  with check (private.can('projects') and created_by = auth.uid());
create policy "edit projects" on public.projects for update to authenticated
  using (private.can('projects') and (not private.entry_only('projects') or created_by = auth.uid()))
  with check (private.can('projects'));
create policy "owner deletes projects" on public.projects for delete to authenticated
  using (private.is_owner());

drop policy if exists "read project steps" on public.project_steps;
drop policy if exists "write project steps" on public.project_steps;
create policy "read project steps" on public.project_steps for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy "write project steps" on public.project_steps for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id))
  with check (exists (select 1 from public.projects p where p.id = project_id));

drop policy if exists "read project payments" on public.project_payments;
drop policy if exists "write project payments" on public.project_payments;
create policy "read project payments" on public.project_payments for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy "write project payments" on public.project_payments for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id))
  with check (exists (select 1 from public.projects p where p.id = project_id));

drop policy if exists "read project files" on public.project_files;
drop policy if exists "write project files" on public.project_files;
create policy "read project files" on public.project_files for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy "write project files" on public.project_files for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id))
  with check (exists (select 1 from public.projects p where p.id = project_id));

grant select, insert, update, delete on public.projects, public.project_steps, public.project_payments, public.project_files to authenticated;

-- 6) The owner sees every rupee that came in, at a glance
create or replace view public.project_totals as
  select p.id as project_id,
         p.ref_no,
         p.customer,
         p.status,
         p.stage,
         p.quoted_amount,
         coalesce((select sum(amount) from public.project_payments pp where pp.project_id = p.id), 0) as received,
         p.quoted_amount - coalesce((select sum(amount) from public.project_payments pp where pp.project_id = p.id), 0) as balance
    from public.projects p;
grant select on public.project_totals to authenticated;
