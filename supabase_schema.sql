-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key, -- Links to Supabase Auth
  telegram_id bigint unique,
  username text,
  first_name text,
  level int default 1,
  xp int default 0,
  hp int default 100,
  max_hp int default 100,
  gold int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- ITEMS TABLE
create table public.items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text not null, -- 'weapon', 'armor', 'consumable'
  stats jsonb default '{}'::jsonb, -- e.g. {"attack": 5}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.items enable row level security;
create policy "Everyone can view items" on public.items for select using (true);

-- INVENTORY TABLE
create table public.inventory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  item_id uuid references public.items(id) not null,
  quantity int default 1,
  equipped boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inventory enable row level security;

create policy "Users can view their own inventory" on public.inventory
  for select using (auth.uid() = user_id);

-- Insert some starter items
insert into public.items (name, description, type, stats) values
('Rusty Sword', 'Better than nothing.', 'weapon', '{"attack": 2}'),
('Wooden Shield', 'Splinters included.', 'armor', '{"defense": 1}'),
('Health Potion', 'Smells like strawberries.', 'consumable', '{"heal": 20}');
