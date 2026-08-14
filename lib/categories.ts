import 'server-only'
import { sql } from './db'
import type { AccentColor, Category } from './types'

interface CategoryRow {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  accent_color: AccentColor
  report_label: string
  report_noun: string
  display_order: number
  is_sensitive_contact: boolean
}

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    accent: row.accent_color,
    reportLabel: row.report_label,
    reportNoun: row.report_noun,
    displayOrder: row.display_order,
    isSensitiveContact: row.is_sensitive_contact,
  }
}

/** Todas las categorías, ordenadas para el grid del home / nav admin. */
export async function getCategories(): Promise<Category[]> {
  const rows = (await sql`
    select id, slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact
    from categories
    order by display_order asc, name asc
  `) as CategoryRow[]
  return rows.map(mapRow)
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const rows = (await sql`
    select id, slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact
    from categories
    where slug = ${slug}
  `) as CategoryRow[]
  return rows[0] ? mapRow(rows[0]) : null
}

export interface CategoryWithCount extends Category {
  entryCount: number
}

/**
 * Categorías con su número de entradas asociadas, para el panel admin.
 * Cuenta por category_id o por el texto legacy `category`, lo que cubra:
 * mientras no se confirme que el backfill de category_id corrió en
 * producción, algunas entradas viejas solo tienen el texto.
 */
export async function getCategoriesWithCounts(): Promise<
  CategoryWithCount[]
> {
  const rows = (await sql`
    select
      c.id, c.slug, c.name, c.description, c.icon, c.accent_color,
      c.report_label, c.report_noun, c.display_order, c.is_sensitive_contact,
      count(e.id)::int as entry_count
    from categories c
    left join entries e on e.category_id = c.id or e.category = c.slug
    group by c.id
    order by c.display_order asc, c.name asc
  `) as (CategoryRow & { entry_count: number })[]
  return rows.map((row) => ({ ...mapRow(row), entryCount: row.entry_count }))
}

export interface CategoryInput {
  slug: string
  name: string
  description?: string
  icon: string
  accent: AccentColor
  reportLabel: string
  reportNoun: string
  displayOrder?: number
  isSensitiveContact?: boolean
}

/** Si no se pasa displayOrder, la categoría se agrega al final del orden actual. */
export async function createCategory(
  input: CategoryInput,
): Promise<Category> {
  const rows = (await sql`
    insert into categories
      (slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact)
    values (
      ${input.slug}, ${input.name}, ${input.description ?? ''}, ${input.icon},
      ${input.accent}, ${input.reportLabel}, ${input.reportNoun},
      coalesce(${input.displayOrder ?? null}, (select coalesce(max(display_order), -1) + 1 from categories)),
      ${input.isSensitiveContact ?? false}
    )
    returning id, slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact
  `) as CategoryRow[]
  return mapRow(rows[0])
}

export type CategoryUpdate = Partial<
  Pick<
    CategoryInput,
    | 'name'
    | 'description'
    | 'icon'
    | 'accent'
    | 'reportLabel'
    | 'reportNoun'
    | 'displayOrder'
    | 'isSensitiveContact'
  >
>

/** No permite editar el slug: una vez creado, es parte de URLs ya compartidas. */
export async function updateCategory(
  id: string,
  patch: CategoryUpdate,
): Promise<Category | null> {
  const rows = (await sql`
    update categories set
      name = coalesce(${patch.name ?? null}, name),
      description = coalesce(${patch.description ?? null}, description),
      icon = coalesce(${patch.icon ?? null}, icon),
      accent_color = coalesce(${patch.accent ?? null}, accent_color),
      report_label = coalesce(${patch.reportLabel ?? null}, report_label),
      report_noun = coalesce(${patch.reportNoun ?? null}, report_noun),
      display_order = coalesce(${patch.displayOrder ?? null}, display_order),
      is_sensitive_contact = coalesce(${patch.isSensitiveContact ?? null}, is_sensitive_contact),
      updated_at = now()
    where id = ${id}
    returning id, slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact
  `) as CategoryRow[]
  return rows[0] ? mapRow(rows[0]) : null
}

async function getEntryCountForCategory(categoryId: string): Promise<number> {
  const rows = (await sql`
    select count(*)::int as count
    from entries e
    join categories c on c.id = ${categoryId}
    where e.category_id = c.id or e.category = c.slug
  `) as { count: number }[]
  return rows[0]?.count ?? 0
}

export type DeleteCategoryResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' }
  | { ok: false; reason: 'has_entries'; entryCount: number }

export async function deleteCategory(
  id: string,
): Promise<DeleteCategoryResult> {
  const entryCount = await getEntryCountForCategory(id)
  if (entryCount > 0) {
    return { ok: false, reason: 'has_entries', entryCount }
  }
  const rows = (await sql`
    delete from categories where id = ${id} returning id
  `) as { id: string }[]
  if (rows.length === 0) {
    return { ok: false, reason: 'not_found' }
  }
  return { ok: true }
}
