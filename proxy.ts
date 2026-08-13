import { NextResponse, type NextRequest } from 'next/server'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySession,
} from '@/lib/session'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

const PUBLIC_PATHS = new Set([
  '/admin', // página de login
  '/api/admin/login',
  '/api/admin/logout',
])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApi = pathname.startsWith('/api/')

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    if (isApi) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL('/admin', request.url))
    response.cookies.delete(SESSION_COOKIE_NAME)
    return response
  }

  // Ventana deslizante: cada request autenticado renueva la expiración 4h más.
  const renewedToken = await signSession({ sub: session.sub })
  const response = NextResponse.next()
  response.cookies.set(SESSION_COOKIE_NAME, renewedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
