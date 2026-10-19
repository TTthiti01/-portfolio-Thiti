-- Portfolio schema: tables, RLS policies, and seed row.
-- Run once in Supabase Dashboard -> SQL Editor. Safe to re-run.

create extension if not exists pgcrypto;

-- ============ Tables ============

create table if not exists public.profile_settings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default '',
  bio text not null default '',
  profile_image_url text,
  resume_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  tech_stack text[] not null default '{}',
  demo_url text,
  github_url text,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  duration text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_name text,
  category text not null default 'frontend',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  browser text,
  os text,
  device_type text,
  country text,
  city text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- ============ Row Level Security ============
-- Visitors (anon): read public content, send messages, record page views.
-- Admin (authenticated): full access. Disable public sign-ups in Auth settings
-- so only the admin user you create can log in.

alter table public.profile_settings enable row level security;
alter table public.projects         enable row level security;
alter table public.experiences      enable row level security;
alter table public.skills           enable row level security;
alter table public.messages         enable row level security;
alter table public.page_views       enable row level security;

-- Public read
drop policy if exists "public read profile_settings" on public.profile_settings;
create policy "public read profile_settings" on public.profile_settings
  for select to anon, authenticated using (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select to anon, authenticated using (true);

drop policy if exists "public read experiences" on public.experiences;
create policy "public read experiences" on public.experiences
  for select to anon, authenticated using (true);

drop policy if exists "public read skills" on public.skills;
create policy "public read skills" on public.skills
  for select to anon, authenticated using (true);

-- Visitors may insert only
drop policy if exists "public insert messages" on public.messages;
create policy "public insert messages" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "public insert page_views" on public.page_views;
create policy "public insert page_views" on public.page_views
  for insert to anon, authenticated with check (true);

-- Admin: read private tables
drop policy if exists "admin read messages" on public.messages;
create policy "admin read messages" on public.messages
  for select to authenticated using (true);

drop policy if exists "admin read page_views" on public.page_views;
create policy "admin read page_views" on public.page_views
  for select to authenticated using (true);

-- Admin: write content tables
drop policy if exists "admin write profile_settings" on public.profile_settings;
create policy "admin write profile_settings" on public.profile_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write experiences" on public.experiences;
create policy "admin write experiences" on public.experiences
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write skills" on public.skills;
create policy "admin write skills" on public.skills
  for all to authenticated using (true) with check (true);

drop policy if exists "admin delete messages" on public.messages;
create policy "admin delete messages" on public.messages
  for delete to authenticated using (true);

-- ============ Seed ============
-- The app reads profile_settings with .single() and updates it by id,
-- so exactly one row must exist.
insert into public.profile_settings (full_name, bio)
select 'Your Name', 'Your bio'
where not exists (select 1 from public.profile_settings);
