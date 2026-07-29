-- Run this once in the Supabase project's SQL Editor.

create table if not exists task_completions (
  kid_id text not null,
  date date not null,
  task_id text not null,
  updated_at timestamptz not null default now(),
  primary key (kid_id, date, task_id)
);

create table if not exists app_settings (
  id int primary key default 1,
  parent_pin text not null default '0000',
  constraint app_settings_single_row check (id = 1)
);

insert into app_settings (id, parent_pin)
values (1, '0000')
on conflict (id) do nothing;

alter table task_completions enable row level security;
alter table app_settings enable row level security;

-- This is a private family app with no login system, so the anon (public)
-- key is allowed to read/write freely. Don't reuse this schema for data
-- that needs real access control.
create policy "anon can read completions" on task_completions
  for select to anon using (true);
create policy "anon can insert completions" on task_completions
  for insert to anon with check (true);
create policy "anon can delete completions" on task_completions
  for delete to anon using (true);

create policy "anon can read settings" on app_settings
  for select to anon using (true);
create policy "anon can update settings" on app_settings
  for update to anon using (true) with check (true);
