-- Migration to create structured faculty and department tables
-- This ensures high-accuracy retrieval for personnel-related queries.

create table if not exists public.faculty (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  designation text,
  department text not null,
  qualification text,
  image_url text,
  is_hod boolean default false,
  profile_url text,
  meta_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, department) -- Prevent duplicates within the same department
);

-- Enable RLS
alter table public.faculty enable row level security;

-- Policies for public viewing
create policy "Faculty data is viewable by everyone."
  on public.faculty for select
  using ( true );

-- Only service role/admin can insert/update (scraping happens on server)
create policy "Only admins can modify faculty data."
  on public.faculty for all
  using ( (select auth.role()) = 'service_role' );

-- Indexes for fast lookup
create index if not exists faculty_name_idx on public.faculty(name);
create index if not exists faculty_department_idx on public.faculty(department);
create index if not exists faculty_is_hod_idx on public.faculty(is_hod);
