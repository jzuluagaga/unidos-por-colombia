import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword } from '@/lib/auth'
import { sql } from '@/lib/db'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from '@/lib/session'

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }

  const rows = (await sql`
    select username, password_hash from admins where username = ${parsed.data.username}
  `) as { username: string; password_hash: string }[]
  const admin = rows[0]

  const valid = admin
    ? await verifyPassword(parsed.data.password, admin.password_hash)
    : false
  if (!admin || !valid) {
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos.' },
      { status: 401 },
    )
  }

  const token = await signSession({ sub: admin.username })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
