import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isCategorySlug } from '@/lib/data'
import { createEntry } from '@/lib/entries'
import { getClientIp, isRateLimited, recordSubmission } from '@/lib/rate-limit'

const reportSchema = z.object({
  category: z.string(),
  nombre: z.string().trim().min(1).max(160),
  ubicacion: z.string().trim().max(200).optional().default(''),
  descripcion: z.string().trim().min(1).max(2000),
  telefono: z.string().trim().max(40).optional().default(''),
  photoUrl: z.string().url().max(500).optional(),
  // Honeypot: campo oculto para el ojo humano, visible para bots que
  // completan formularios de forma genérica.
  website: z.string().optional().default(''),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const data = parsed.data

  // Si el honeypot viene lleno, es un bot: respondemos éxito sin persistir
  // nada, para no revelar que fue detectado.
  if (data.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (!isCategorySlug(data.category)) {
    return NextResponse.json({ error: 'Categoría inválida.' }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados envíos. Intenta de nuevo más tarde.' },
      { status: 429 },
    )
  }

  await createEntry({
    category: data.category,
    title: data.nombre,
    subtitle: data.ubicacion,
    description: data.descripcion,
    photoUrl: data.photoUrl,
    status: 'pendiente',
    contact: data.telefono || undefined,
  })
  await recordSubmission(ip)

  return NextResponse.json({ ok: true })
}
