-- Customer documents: a private folder per project inside Supabase Storage.
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > paste > Run).
-- Re-running is safe: the bucket insert is skipped when it already exists and the policies are recreated.

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- The folder name is the project id, so every policy reads the folder and asks the projects rules.
-- Read: anyone who can open the Projects screen.
drop policy if exists "read project files" on storage.objects;
create policy "read project files" on storage.objects for select to authenticated
  using (
    bucket_id = 'project-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = split_part(name, '/', 1) and private.can('projects')
    )
  );

-- Add: same people who may open Projects.
drop policy if exists "add project files" on storage.objects;
create policy "add project files" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = split_part(name, '/', 1) and private.can('projects')
    )
  );

-- Remove: the owner (or admin), and whoever added the job.
drop policy if exists "delete project files" on storage.objects;
create policy "delete project files" on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = split_part(name, '/', 1)
        and (private.is_owner() or p.created_by = auth.uid())
    )
  );

-- Downloads use a short-lived signed link (10 minutes), so nobody needs a public bucket.
