-- Enable required extensions
 create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text,
  unit text default 'kg' check (unit in ('kg','lbs')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Workouts table
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  notes text default '',
  date date default current_date,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.workouts enable row level security;

-- Exercises table
create table if not exists public.exercises (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references public.workouts on delete cascade not null,
  name text not null,
  muscle_group text not null,
  order_index int default 0,
  created_at timestamptz default now()
);
alter table public.exercises enable row level security;

-- Sets table
create table if not exists public.sets (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid references public.exercises on delete cascade not null,
  set_number int not null,
  reps int default 0,
  weight float default 0,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.sets enable row level security;

-- RLS policies
create policy "profiles_own" on public.profiles for all using (id = auth.uid());
create policy "workouts_own" on public.workouts for all using (user_id = auth.uid());
create policy "exercises_own" on public.exercises for all using (workout_id in (select id from public.workouts where user_id = auth.uid()));
create policy "sets_own" on public.sets for all using (exercise_id in (
  select e.id from public.exercises e join public.workouts w on e.workout_id = w.id where w.user_id = auth.uid()
));

-- Auto-create profile on new auth user
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.email, new.phone));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime (ensure publication exists)
drop publication if exists supabase_realtime;
create publication supabase_realtime;
alter publication supabase_realtime add table public.workouts;
alter publication supabase_realtime add table public.exercises;
alter publication supabase_realtime add table public.sets;
