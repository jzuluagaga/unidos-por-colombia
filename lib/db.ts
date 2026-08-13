import { neon } from '@neondatabase/serverless'

type Sql = ReturnType<typeof neon>

let client: Sql | undefined

function getClient(): Sql {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurada.')
    }
    client = neon(process.env.DATABASE_URL)
  }
  return client
}

// Envoltorio perezoso: neon() lanza de inmediato si DATABASE_URL falta, y
// Next evalúa este módulo al recolectar metadata de las rutas en build time
// (sin las env vars de runtime todavía disponibles). Solo se conecta de
// verdad la primera vez que se ejecuta una consulta.
export const sql: Sql = ((...args: Parameters<Sql>) =>
  getClient()(...args)) as Sql
