import type { AccentColor, Category, CategorySlug, EntryStatus } from './types'

/* -------------------------------------------------------------------------- */
/*  Categorías                                                                 */
/* -------------------------------------------------------------------------- */

export const categories: Category[] = [
  {
    slug: 'necesidades',
    name: 'Necesidades actuales',
    description:
      'Insumos y recursos que las comunidades afectadas necesitan con mayor urgencia en este momento.',
    icon: 'ClipboardCheck',
    accent: 'gold',
    reportLabel: 'Reportar una necesidad',
    reportNoun: 'necesidad',
  },
  {
    slug: 'servicios',
    name: 'Servicios profesionales gratuitos',
    description:
      'Profesionales que ofrecen su tiempo y conocimiento de forma gratuita a las familias damnificadas.',
    icon: 'BriefcaseBusiness',
    accent: 'navy',
    reportLabel: 'Ofrecer un servicio',
    reportNoun: 'servicio',
  },
  {
    slug: 'acopio',
    name: 'Centros de acopio',
    description:
      'Puntos habilitados para recibir donaciones de alimentos, ropa, agua y elementos de aseo.',
    icon: 'Gift',
    accent: 'gold',
    reportLabel: 'Reportar un centro de acopio',
    reportNoun: 'centro de acopio',
  },
  {
    slug: 'hospedaje',
    name: 'Hospedaje solidario',
    description:
      'Familias y personas que abren las puertas de su hogar para alojar temporalmente a los afectados.',
    icon: 'BedDouble',
    accent: 'success',
    reportLabel: 'Ofrecer hospedaje',
    reportNoun: 'hospedaje',
  },
  {
    slug: 'peluditos',
    name: 'Ayuda a peluditos',
    description:
      'Mascotas rescatadas, perdidas o que necesitan hogar temporal, alimento y atención veterinaria.',
    icon: 'PawPrint',
    accent: 'gold',
    reportLabel: 'Reportar un peludito',
    reportNoun: 'peludito',
  },
  {
    slug: 'desaparecidos',
    name: 'Desaparecidos',
    description:
      'Personas cuyo paradero se desconoce tras el terremoto. Ayúdanos a difundir para reunir familias.',
    icon: 'UserSearch',
    accent: 'urgent',
    reportLabel: 'Reportar persona desaparecida',
    reportNoun: 'persona desaparecida',
  },
]

export const categoryMap: Record<CategorySlug, Category> = categories.reduce(
  (acc, cat) => {
    acc[cat.slug] = cat
    return acc
  },
  {} as Record<CategorySlug, Category>,
)

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((c) => c.slug === value)
}

/* -------------------------------------------------------------------------- */
/*  Estados                                                                    */
/* -------------------------------------------------------------------------- */

export interface StatusMeta {
  label: string
  /** Tailwind accent color token used by <StatusBadge>. */
  color: AccentColor | 'muted'
}

export const statusMeta: Record<EntryStatus, StatusMeta> = {
  urgente: { label: 'URGENTE', color: 'urgent' },
  pendiente: { label: 'PENDIENTE', color: 'muted' },
  buscando: { label: 'BUSCANDO', color: 'success' },
  difundir: { label: 'DIFUNDIR', color: 'navy' },
  publicado: { label: 'PUBLICADO', color: 'success' },
  rechazado: { label: 'RECHAZADO', color: 'urgent' },
}

export const adminStatusOptions: EntryStatus[] = [
  'pendiente',
  'publicado',
  'urgente',
  'buscando',
  'difundir',
  'rechazado',
]

/* -------------------------------------------------------------------------- */
/*  Los datos de entradas (Entry) viven en la base de datos — ver lib/entries.ts */
/*  (getEntriesByCategory, getAllEntriesByCategory, etc.), no aquí, porque      */
/*  este archivo también se importa desde componentes cliente ('use client')   */
/*  que solo necesitan la configuración estática de categorías/estados.        */
/* -------------------------------------------------------------------------- */
