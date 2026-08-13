import 'server-only'
import { sql } from './db'
import type { CategorySlug, Entry, EntryStatus } from './types'

/** Estados visibles públicamente; 'pendiente' y 'rechazado' quedan ocultos. */
const PUBLIC_STATUSES: EntryStatus[] = [
  'publicado',
  'urgente',
  'buscando',
  'difundir',
]

interface EntryRow {
  id: string
  category: string
  title: string
  subtitle: string
  description: string
  photo_url: string | null
  status: EntryStatus
  contact: string | null
  updated_at: string
}

function mapRow(row: EntryRow): Entry {
  return {
    id: row.id,
    category: row.category as CategorySlug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    photo: row.photo_url ?? '/placeholder.svg',
    status: row.status,
    contact: row.contact ?? undefined,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

/** Entradas visibles al público de una categoría, más recientes primero. */
export async function getEntriesByCategory(
  category: CategorySlug,
): Promise<Entry[]> {
  const rows = (await sql`
    select id, category, title, subtitle, description, photo_url, status, contact, updated_at
    from entries
    where category = ${category} and status = any(${PUBLIC_STATUSES})
    order by updated_at desc
  `) as EntryRow[]
  return rows.map(mapRow)
}

export async function getEntryCountByCategory(
  category: CategorySlug,
): Promise<number> {
  const rows = (await sql`
    select count(*)::int as count
    from entries
    where category = ${category} and status = any(${PUBLIC_STATUSES})
  `) as { count: number }[]
  return rows[0]?.count ?? 0
}

/** Todas las entradas de una categoría (cualquier estado) para el panel admin. */
export async function getAllEntriesByCategory(
  category: CategorySlug,
): Promise<Entry[]> {
  const rows = (await sql`
    select id, category, title, subtitle, description, photo_url, status, contact, updated_at
    from entries
    where category = ${category}
    order by updated_at desc
  `) as EntryRow[]
  return rows.map(mapRow)
}

export interface EntryInput {
  category: CategorySlug
  title: string
  subtitle: string
  description: string
  photoUrl?: string
  status: EntryStatus
  contact?: string
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  const rows = (await sql`
    insert into entries (category, title, subtitle, description, photo_url, status, contact)
    values (
      ${input.category}, ${input.title}, ${input.subtitle}, ${input.description},
      ${input.photoUrl ?? null}, ${input.status}, ${input.contact ?? null}
    )
    returning id, category, title, subtitle, description, photo_url, status, contact, updated_at
  `) as EntryRow[]
  return mapRow(rows[0])
}

export type EntryUpdate = Partial<
  Pick<
    EntryInput,
    'title' | 'subtitle' | 'description' | 'photoUrl' | 'status' | 'contact'
  >
>

export async function updateEntry(
  id: string,
  patch: EntryUpdate,
): Promise<Entry | null> {
  const rows = (await sql`
    update entries set
      title = coalesce(${patch.title ?? null}, title),
      subtitle = coalesce(${patch.subtitle ?? null}, subtitle),
      description = coalesce(${patch.description ?? null}, description),
      photo_url = coalesce(${patch.photoUrl ?? null}, photo_url),
      status = coalesce(${patch.status ?? null}, status),
      contact = coalesce(${patch.contact ?? null}, contact),
      updated_at = now()
    where id = ${id}
    returning id, category, title, subtitle, description, photo_url, status, contact, updated_at
  `) as EntryRow[]
  return rows[0] ? mapRow(rows[0]) : null
}

export async function deleteEntry(id: string): Promise<boolean> {
  const rows = (await sql`
    delete from entries where id = ${id} returning id
  `) as { id: string }[]
  return rows.length > 0
}
