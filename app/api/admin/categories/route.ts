import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createCategory,
  getCategoriesWithCounts,
  getCategoryBySlug,
} from '@/lib/categories'
import { CATEGORY_ICON_NAMES } from '@/lib/icons'

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

// Segmentos de ruta estáticos que coexisten con /[categoria] y /admin/[categoria]
// (app/admin, app/api, app/admin/categorias). Un slug igual a uno de estos
// quedaría inalcanzable en su propia URL, porque la ruta estática siempre
// gana sobre la dinámica.
const RESERVED_SLUGS = new Set(['admin', 'api', 'categorias'])

const createSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(
      SLUG_PATTERN,
      'El slug debe ser minúsculas, sin espacios ni acentos (ej. "mi-categoria").',
    )
    .refine((value) => !RESERVED_SLUGS.has(value), {
      message: 'Ese slug está reservado por el sitio y no se puede usar.',
    }),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().default(''),
  icon: z.enum(CATEGORY_ICON_NAMES),
  accent: z.enum(['gold', 'navy', 'success', 'urgent']),
  reportLabel: z.string().trim().min(1).max(120),
  reportNoun: z.string().trim().min(1).max(120),
  displayOrder: z.number().int().optional(),
  isSensitiveContact: z.boolean().optional().default(false),
})

export async function GET() {
  const categories = await getCategoriesWithCounts()
  return NextResponse.json({ categories })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' },
      { status: 400 },
    )
  }
  const data = parsed.data

  const existing = await getCategoryBySlug(data.slug)
  if (existing) {
    return NextResponse.json(
      { error: `Ya existe una categoría con el slug "${data.slug}".` },
      { status: 409 },
    )
  }

  const category = await createCategory(data)
  return NextResponse.json({ category })
}
