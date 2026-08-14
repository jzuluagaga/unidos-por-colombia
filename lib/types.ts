/** Slug de categoría (p.ej. 'necesidades'). Las categorías viven en la tabla
 * `categories` y se gestionan desde /admin/categorias, así que ya no es un
 * union type fijo — se valida en tiempo de ejecución contra la base de datos
 * (ver lib/categories.ts), no en tiempo de compilación. */
export type CategorySlug = string

export type AccentColor = 'gold' | 'navy' | 'success' | 'urgent'

export interface Category {
  id: string
  slug: CategorySlug
  /** Short name shown in the landing grid. */
  name: string
  /** Longer description shown at the top of the category view. */
  description: string
  /** lucide-react icon name (rendered via the icon map). */
  icon: string
  /** Accent color used for the icon and highlights. */
  accent: AccentColor
  /** Label for the "report" call to action, e.g. "Reportar persona desaparecida". */
  reportLabel: string
  /** Noun used in the report form heading, e.g. "persona desaparecida". */
  reportNoun: string
  /** Controla el orden en el grid del home y en la navegación admin. */
  displayOrder: number
  /** Si es true, el contacto de sus entradas se oculta en el sitio público
   * (ver components/entry-card.tsx). Pensado para categorías como "Desaparecidos". */
  isSensitiveContact: boolean
}

export const ENTRY_STATUSES = [
  'urgente',
  'pendiente',
  'buscando',
  'difundir',
  'publicado',
  'rechazado',
] as const

export type EntryStatus = (typeof ENTRY_STATUSES)[number]

export interface Entry {
  id: string
  category: CategorySlug
  title: string
  /** Secondary line: location / context. */
  subtitle: string
  description: string
  photo: string
  status: EntryStatus
  /** Optional contact line (phone or reference). */
  contact?: string
  /** ISO timestamp of last update. */
  updatedAt: string
}
