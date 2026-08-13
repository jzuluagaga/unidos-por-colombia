import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

export const SESSION_COOKIE_NAME = 'session'
/** Ventana de expiración deslizante: 4 horas sin actividad y la sesión expira. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 4

export interface SessionPayload extends JWTPayload {
  sub: string
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET no está configurada.')
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS)
    .sign(getSecretKey())
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== 'string') return null
    return { sub: payload.sub }
  } catch {
    return null
  }
}
