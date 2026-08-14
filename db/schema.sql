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

-- Categorías gestionables desde el panel admin (antes: array estático en lib/data.ts).
create table if not exists categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,        -- usado en la URL /[categoria]; inmutable tras crear
  name          text not null,
  description   text not null default '',
  icon          text not null,               -- nombre de ícono lucide-react; lista fija validada en la app (ver lib/icons.ts CATEGORY_ICON_NAMES)
  accent_color  text not null default 'gold' check (accent_color in ('gold', 'navy', 'success', 'urgent')),
  report_label  text not null,
  report_noun   text not null,
  display_order integer not null default 0,
  -- Si es true, el contacto de sus entradas no se muestra en texto plano en
  -- el sitio público — se protege detrás de un correo de admin (ver
  -- components/entry-card.tsx). Pensado para categorías como "Desaparecidos".
  is_sensitive_contact boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Para bases de datos creadas antes de que existiera is_sensitive_contact.
alter table categories add column if not exists is_sensitive_contact boolean not null default false;

create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  category     text not null,          -- CategorySlug; se conserva en paralelo a category_id hasta confirmar la migración
  category_id  uuid references categories(id),
  title        text not null,
  subtitle     text not null default '',
  description  text not null,
  photo_url    text,
  status       entry_status not null default 'pendiente',
  contact      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Para bases de datos creadas antes de que existiera categories/category_id.
alter table entries add column if not exists category_id uuid references categories(id);

create index if not exists entries_category_status_idx on entries (category, status);
create index if not exists entries_category_id_idx on entries (category_id);

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
