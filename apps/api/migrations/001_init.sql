create extension if not exists "uuid-ossp";

create table if not exists app_user (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  handle text unique not null,
  display_name text not null,
  password_hash text not null,
  reputation int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists garden_task (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_user(id) on delete cascade,
  title text not null,
  task_type text not null check (task_type in ('water','prune','feed','inspect','harvest')),
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','done','skipped')),
  created_at timestamptz not null default now()
);

create index if not exists idx_garden_task_user_due on garden_task(user_id, due_at);

create table if not exists task_completion (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references garden_task(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  completed_at timestamptz not null default now()
);

create table if not exists streak_snapshot (
  user_id uuid primary key references app_user(id) on delete cascade,
  current_streak_days int not null default 0,
  actions_this_week int not null default 0,
  last_action_at timestamptz
);
