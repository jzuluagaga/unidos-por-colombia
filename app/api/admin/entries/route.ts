import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isCategorySlug } from '@/lib/data'
import { createEntry } from '@/lib/entries'
import { ENTRY_STATUSES } from '@/lib/types'

const createSchema = z.object({
  category: z.string(),
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().max(200).optional().default(''),
  description: z.string().trim().min(1).max(2000),
  photoUrl: z.string().url().max(500).optional(),
  status: z.enum(ENTRY_STATUSES),
  contact: z.string().trim().max(120).optional().default(''),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const data = parsed.data
  if (!isCategorySlug(data.category)) {
    return NextResponse.json({ error: 'Categoría inválida.' }, { status: 400 })
  }

  const entry = await createEntry({
    category: data.category,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    photoUrl: data.photoUrl,
    status: data.status,
    contact: data.contact || undefined,
  })
  return NextResponse.json({ entry })
}
