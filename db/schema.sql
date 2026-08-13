-- Unidos por Colombia — esquema de base de datos (Postgres / Neon vía Vercel).
-- Ejecutar una sola vez contra la base de datos del proyecto (SQL editor de
-- Neon/Vercel, o `psql "$DATABASE_URL" -f db/schema.sql`).

create extension if not exists pgcrypto;

do $$ begin
  create type entry_status as enum
    ('pendiente', 'publicado', 'rechazado', 'urgente', 'buscando', 'difundir');
exception
  when duplicate_object then null;
end $$;

create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  category     text not null,          -- CategorySlug; validado en la app, sin FK (categorías son config estática en lib/data.ts)
  title        text not null,
  subtitle     text not null default '',
  description  text not null,
  photo_url    text,
  status       entry_status not null default 'pendiente',
  contact      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists entries_category_status_idx on entries (category, status);

create table if not exists admins (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Rate limiting básico del formulario público de reporte.
create table if not exists report_submissions (
  id          uuid primary key default gen_random_uuid(),
  ip          text not null,
  created_at  timestamptz not null default now()
);

create index if not exists report_submissions_ip_idx on report_submissions (ip, created_at);
