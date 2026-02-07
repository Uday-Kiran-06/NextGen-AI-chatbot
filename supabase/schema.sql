-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Create a table for public profiles that syncs with auth.users
create table public.profiles (
  id uuid REFERENCES auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to automatically create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CHATS TABLE
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.chats enable row level security;

-- Policies
create policy "Users can view their own chats."
  on chats for select
  using ( auth.uid() = user_id );

create policy "Users can create their own chats."
  on chats for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own chats."
  on chats for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own chats."
  on chats for delete
  using ( auth.uid() = user_id );


-- 3. MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'model', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view messages in their chats."
  on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their chats."
  on messages for insert
  with check (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

-- Indexes for performance
create index messages_chat_id_idx on messages(chat_id);
create index chats_user_id_idx on chats(user_id);
