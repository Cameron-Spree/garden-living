-- Garden Living MVP schema (PostgreSQL)

create extension if not exists "uuid-ossp";

create table app_user (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  handle text unique not null,
  display_name text not null,
  reputation int not null default 0,
  created_at timestamptz not null default now()
);

create table garden (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_user(id) on delete cascade,
  name text not null,
  climate_zone text,
  postcode text,
  created_at timestamptz not null default now()
);

create table plant (
  id uuid primary key default uuid_generate_v4(),
  garden_id uuid not null references garden(id) on delete cascade,
  common_name text not null,
  species text,
  location_type text not null check (location_type in ('indoor','balcony','allotment','yard')),
  created_at timestamptz not null default now()
);

create table garden_task (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_user(id) on delete cascade,
  plant_id uuid references plant(id) on delete set null,
  task_type text not null check (task_type in ('water','prune','feed','inspect','harvest')),
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','done','skipped')),
  source text not null default 'scheduler' check (source in ('scheduler','manual')),
  created_at timestamptz not null default now()
);

create index idx_garden_task_user_due on garden_task(user_id, due_at);
create index idx_garden_task_status on garden_task(status);

create table task_completion (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references garden_task(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  completed_at timestamptz not null default now(),
  notes text,
  offline_created_at timestamptz
);

create table weather_observation (
  id uuid primary key default uuid_generate_v4(),
  postcode text not null,
  observed_at timestamptz not null,
  rainfall_mm numeric(6,2) not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index idx_weather_postcode_time on weather_observation(postcode, observed_at desc);

create table post (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_user(id) on delete cascade,
  caption text not null,
  image_url text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table post_comment (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references post(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table post_like (
  post_id uuid not null references post(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table question (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_user(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null,
  image_url text,
  accepted_answer_id uuid,
  created_at timestamptz not null default now()
);

create table answer (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references question(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table question
  add constraint fk_question_accepted_answer
  foreign key (accepted_answer_id) references answer(id) on delete set null;

create table streak_snapshot (
  user_id uuid primary key references app_user(id) on delete cascade,
  current_streak_days int not null default 0,
  actions_this_week int not null default 0,
  last_action_at timestamptz
);
