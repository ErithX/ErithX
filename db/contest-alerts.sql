-- Database migration for contest alert preferences and alert logging

alter table if exists user_profiles
  add column if not exists contest_alerts_enabled boolean default false;

alter table if exists user_profiles
  add column if not exists alert_minutes_before integer default 30;

create table if not exists contest_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  contest_id text not null,
  contest_name text not null,
  contest_platform text,
  start_time timestamptz not null,
  alert_minutes_before integer not null,
  status text not null default 'sent',
  error_message text,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists contest_alerts_user_contest_unique
  on contest_alerts(user_id, contest_id);
