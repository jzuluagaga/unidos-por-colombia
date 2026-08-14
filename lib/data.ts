import type { AccentColor, EntryStatus } from './types'

/* -------------------------------------------------------------------------- */
/*  Estados                                                                    */
/* -------------------------------------------------------------------------- */
/*  Las categorías ahora viven en la tabla `categories` — ver lib/categories.ts */

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
/*  que solo necesitan la configuración estática de estados.                   */
/* -------------------------------------------------------------------------- */
