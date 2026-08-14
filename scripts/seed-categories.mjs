// Siembra las 6 categorías originales (antes hardcodeadas en lib/data.ts) como
// filas reales en la tabla `categories`, y hace el backfill de
// entries.category_id a partir de entries.category (texto) para las entradas
// existentes. Requiere que db/schema.sql ya se haya ejecutado. Uso:
//   DATABASE_URL=... node scripts/seed-categories.mjs
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable de entorno DATABASE_URL.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

// Mismos slugs, textos e íconos que hoy en lib/data.ts — no se cambian para
// no romper URLs ni enlaces ya compartidos.
const CATEGORIES = [
  {
    slug: 'necesidades',
    name: 'Necesidades actuales',
    description:
      'Insumos y recursos que las comunidades afectadas necesitan con mayor urgencia en este momento.',
    icon: 'ClipboardCheck',
    accentColor: 'gold',
    reportLabel: 'Reportar una necesidad',
    reportNoun: 'necesidad',
    displayOrder: 0,
    isSensitiveContact: false,
  },
  {
    slug: 'servicios',
    name: 'Servicios profesionales gratuitos',
    description:
      'Profesionales que ofrecen su tiempo y conocimiento de forma gratuita a las familias damnificadas.',
    icon: 'BriefcaseBusiness',
    accentColor: 'navy',
    reportLabel: 'Ofrecer un servicio',
    reportNoun: 'servicio',
    displayOrder: 1,
    isSensitiveContact: false,
  },
  {
    slug: 'acopio',
    name: 'Centros de acopio',
    description:
      'Puntos habilitados para recibir donaciones de alimentos, ropa, agua y elementos de aseo.',
    icon: 'Gift',
    accentColor: 'gold',
    reportLabel: 'Reportar un centro de acopio',
    reportNoun: 'centro de acopio',
    displayOrder: 2,
    isSensitiveContact: false,
  },
  {
    slug: 'hospedaje',
    name: 'Hospedaje solidario',
    description:
      'Familias y personas que abren las puertas de su hogar para alojar temporalmente a los afectados.',
    icon: 'BedDouble',
    accentColor: 'success',
    reportLabel: 'Ofrecer hospedaje',
    reportNoun: 'hospedaje',
    displayOrder: 3,
    isSensitiveContact: false,
  },
  {
    slug: 'peluditos',
    name: 'Ayuda a peluditos',
    description:
      'Mascotas rescatadas, perdidas o que necesitan hogar temporal, alimento y atención veterinaria.',
    icon: 'PawPrint',
    accentColor: 'gold',
    reportLabel: 'Reportar un peludito',
    reportNoun: 'peludito',
    displayOrder: 4,
    isSensitiveContact: false,
  },
  {
    slug: 'desaparecidos',
    name: 'Desaparecidos',
    description:
      'Personas cuyo paradero se desconoce tras el terremoto. Ayúdanos a difundir para reunir familias.',
    icon: 'UserSearch',
    accentColor: 'urgent',
    reportLabel: 'Reportar persona desaparecida',
    reportNoun: 'persona desaparecida',
    displayOrder: 5,
    isSensitiveContact: true,
  },
]

console.log('Sembrando categorías…')
for (const c of CATEGORIES) {
  // on conflict solo reconcilia is_sensitive_contact (el resto de campos
  // puede haber sido editado ya desde el admin una vez exista esa UI, así
  // que no los pisamos en un re-run de este script).
  const rows = await sql`
    insert into categories
      (slug, name, description, icon, accent_color, report_label, report_noun, display_order, is_sensitive_contact)
    values
      (${c.slug}, ${c.name}, ${c.description}, ${c.icon}, ${c.accentColor}, ${c.reportLabel}, ${c.reportNoun}, ${c.displayOrder}, ${c.isSensitiveContact})
    on conflict (slug) do update set is_sensitive_contact = excluded.is_sensitive_contact
    returning id, (xmax = 0) as inserted
  `
  console.log(
    rows[0]?.inserted
      ? `  + "${c.slug}" creada.`
      : `  · "${c.slug}" ya existía — is_sensitive_contact reconciliado a ${c.isSensitiveContact}.`,
  )
}

console.log('Backfill de entries.category_id desde entries.category…')
const backfilled = await sql`
  update entries e
  set category_id = c.id
  from categories c
  where e.category = c.slug and e.category_id is null
  returning e.id
`
console.log(`  ${backfilled.length} entrada(s) actualizada(s).`)

const orphans = await sql`
  select distinct category from entries where category_id is null
`
if (orphans.length > 0) {
  console.warn(
    `\n⚠ Hay entradas con un valor de "category" que no coincide con ningún slug de categoría: ${orphans
      .map((r) => r.category)
      .join(', ')}`,
  )
  console.warn(
    '  Revísalas antes de considerar la migración completa (no se tocó entries.category, solo faltó el backfill de category_id).',
  )
} else {
  console.log('\n✓ Todas las entradas tienen category_id asignado. Migración limpia.')
}
