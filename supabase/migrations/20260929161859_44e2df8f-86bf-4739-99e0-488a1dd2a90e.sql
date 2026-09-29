create type public.app_role as enum ('admin', 'photographer', 'client');

create table public.profiles (
  id uuid primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Own roles read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'client');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.favourites (
  user_id uuid not null,
  photographer_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, photographer_id)
);
grant select, insert, delete on public.favourites to authenticated;
grant all on public.favourites to service_role;
alter table public.favourites enable row level security;
create policy "Own favourites" on public.favourites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  photographer_id text not null,
  package_name text not null,
  price integer not null,
  service_fee integer not null default 15,
  session_date date not null,
  session_time text not null,
  status text not null default 'Confirmed',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "Own bookings read" on public.bookings for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Own bookings insert" on public.bookings for insert to authenticated with check (auth.uid() = user_id);
create policy "Own bookings update" on public.bookings for update to authenticated using (auth.uid() = user_id);