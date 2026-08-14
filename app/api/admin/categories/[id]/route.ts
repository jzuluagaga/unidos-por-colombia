import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteCategory, updateCategory } from '@/lib/categories'
import { CATEGORY_ICON_NAMES } from '@/lib/icons'

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional(),
  icon: z.enum(CATEGORY_ICON_NAMES).optional(),
  accent: z.enum(['gold', 'navy', 'success', 'urgent']).optional(),
  reportLabel: z.string().trim().min(1).max(120).optional(),
  reportNoun: z.string().trim().min(1).max(120).optional(),
  displayOrder: z.number().int().optional(),
  isSensitiveContact: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json().catch(() => null)

  if (body && typeof body === 'object' && 'slug' in body) {
    return NextResponse.json(
      {
        error:
          'El slug no se puede editar una vez creada la categoría (rompería enlaces ya compartidos).',
      },
      { status: 400 },
    )
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' },
      { status: 400 },
    )
  }

  const category = await updateCategory(id, parsed.data)
  if (!category) {
    return NextResponse.json({ error: 'No encontrada.' }, { status: 404 })
  }
  return NextResponse.json({ category })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await deleteCategory(id)

  if (!result.ok) {
    if (result.reason === 'not_found') {
      return NextResponse.json({ error: 'No encontrada.' }, { status: 404 })
    }
    return NextResponse.json(
      {
        error: `Esta categoría tiene ${result.entryCount} ${result.entryCount === 1 ? 'entrada' : 'entradas'}. Muévelas o elimínalas antes de borrar la categoría.`,
      },
      { status: 409 },
    )
  }

  return NextResponse.json({ ok: true })
}
