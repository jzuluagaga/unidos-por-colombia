// Siembra (o actualiza) un usuario admin. Uso:
//   DATABASE_URL=... node scripts/seed-admin.mjs <usuario> <password>
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const [, , username, password] = process.argv

if (!username || !password) {
  console.error('Uso: node scripts/seed-admin.mjs <usuario> <password>')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable de entorno DATABASE_URL.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const passwordHash = await bcrypt.hash(password, 12)

await sql`
  insert into admins (username, password_hash)
  values (${username}, ${passwordHash})
  on conflict (username) do update set password_hash = excluded.password_hash
`

console.log(`Admin "${username}" creado/actualizado.`)
