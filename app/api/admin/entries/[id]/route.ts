import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteEntry, updateEntry } from '@/lib/entries'
import { ENTRY_STATUSES } from '@/lib/types'

const updateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  subtitle: z.string().trim().max(200).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  photoUrl: z.string().url().max(500).optional(),
  status: z.enum(ENTRY_STATUSES).optional(),
  contact: z.string().trim().max(120).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }

  const entry = await updateEntry(id, parsed.data)
  if (!entry) {
    return NextResponse.json({ error: 'No encontrada.' }, { status: 404 })
  }
  return NextResponse.json({ entry })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const deleted = await deleteEntry(id)
  if (!deleted) {
    return NextResponse.json({ error: 'No encontrada.' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
