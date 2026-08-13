import Link from 'next/link'
import { Phone, ShieldCheck } from 'lucide-react'
import { TricolorBar } from '@/components/tricolor-bar'

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground">
      <TricolorBar />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-xl font-bold uppercase tracking-tight">
            Unidos por Colombia
          </p>
          <p className="mt-1 max-w-sm text-sm text-navy-foreground/70">
            Plataforma solidaria de información verificada tras el terremoto de
            Chocó y Pereira.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <a
            href="tel:018000112000"
            className="inline-flex items-center gap-2 font-semibold hover:text-gold-soft"
          >
            <Phone size={18} strokeWidth={2} />
            Línea de ayuda: 01 8000 11 2000
          </a>
          <span className="inline-flex items-center gap-2 text-navy-foreground/70">
            <ShieldCheck size={18} strokeWidth={2} className="text-gold" />
            Contenido revisado antes de su publicación
          </span>
          <Link
            href="/admin"
            className="text-navy-foreground/60 underline-offset-4 hover:text-gold-soft hover:underline"
          >
            Acceso administradores
          </Link>
        </div>
      </div>
    </footer>
  )
}
