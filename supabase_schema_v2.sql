-- OBAVEZNO: Prvo obriši stare tabele ako postoje (Drop tables) da ne bi bilo konflikta
drop table if exists public.inventory;
drop table if exists public.items;
drop table if exists public.users;

-- USERS TABLE (Pojednostavljeno za Telegram)
create table public.users (
  telegram_id bigint primary key, -- Koristimo Telegram ID kao glavni ključ
  username text,
  first_name text,
  level int default 1,
  xp int default 0,
  hp int default 100,
  max_hp int default 100,
  gold int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ITEMS TABLE
create table public.items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text not null, -- 'weapon', 'armor', 'consumable'
  stats jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY TABLE
create table public.inventory (
  id uuid default gen_random_uuid() primary key,
  user_id bigint references public.users(telegram_id) not null, -- Veza preko Telegram ID-a
  item_id uuid references public.items(id) not null,
  quantity int default 1,
  equipped boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ubacivanje početnih predmeta
insert into public.items (name, description, type, stats) values
('Rusty Sword', 'Better than nothing.', 'weapon', '{"attack": 2}'),
('Wooden Shield', 'Splinters included.', 'armor', '{"defense": 1}'),
('Health Potion', 'Smells like strawberries.', 'consumable', '{"heal": 20}');
