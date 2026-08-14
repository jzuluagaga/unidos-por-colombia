/**
 * Lista fija de íconos que el admin puede elegir para una categoría.
 * Nombres de componentes de lucide-react — se guarda solo el string en la
 * base de datos y se resuelve el componente en components/category-icon.tsx.
 * Incluye los 6 íconos ya usados por las categorías originales (no quitar
 * sin migrar esas filas primero).
 */
export const CATEGORY_ICON_NAMES = [
  'ClipboardCheck',
  'BriefcaseBusiness',
  'Gift',
  'BedDouble',
  'PawPrint',
  'UserSearch',
  'Heart',
  'Home',
  'Package',
  'Users',
  'Search',
  'Phone',
  'Shield',
  'ShieldCheck',
  'MapPin',
  'ClipboardList',
  'Droplet',
  'Utensils',
  'Stethoscope',
  'Tent',
  'Baby',
  'Backpack',
] as const

export type CategoryIconName = (typeof CATEGORY_ICON_NAMES)[number]

export function isCategoryIconName(value: string): value is CategoryIconName {
  return (CATEGORY_ICON_NAMES as readonly string[]).includes(value)
}
