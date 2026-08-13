'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, LogIn } from 'lucide-react'
import { Logo } from '@/components/logo'
import { TricolorBar } from '@/components/tricolor-bar'

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/40'
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: String(form.get('usuario') ?? ''),
          password: String(form.get('password') ?? ''),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo iniciar sesión.')
      }

      router.push('/admin/necesidades')
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo iniciar sesión.',
      )
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TricolorBar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border-2 border-gold/70 bg-card p-8 shadow-md">
            <div className="flex flex-col items-center text-center">
              <Logo size="lg" />
              <h1 className="mt-4 font-serif text-2xl font-bold uppercase tracking-tight text-navy">
                Unidos por Colombia
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Acceso al panel de administración
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
              <div>
                <label htmlFor="usuario" className={labelClass}>
                  Usuario
                </label>
                <input
                  id="usuario"
                  name="usuario"
                  required
                  autoComplete="username"
                  className={fieldClass}
                  placeholder="administrador"
                />
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={fieldClass}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-urgent/30 bg-urgent/10 px-3.5 py-2.5 text-sm font-medium text-urgent">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-navy-foreground shadow-sm transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70"
              >
                <LogIn size={18} strokeWidth={2.25} />
                {loading ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
          >
            <ArrowLeft size={16} strokeWidth={2.25} />
            Volver al sitio público
          </Link>
        </div>
      </main>
    </div>
  )
}
