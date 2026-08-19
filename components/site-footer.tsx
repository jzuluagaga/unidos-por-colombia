import Link from 'next/link'
import { Globe, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/logo'

const ADMIN_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL ?? 'soporte@corporaciongegona.com'
const WHATSAPP_NUMBER = '573054454690'

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold hover:text-gold-soft"
            >
              <MessageCircle size={18} strokeWidth={2} />
              WhatsApp: +57 305 445 4690
            </a>
            <a
              href={`mailto:${ADMIN_CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-navy-foreground/70 hover:text-gold-soft"
            >
              <Mail size={18} strokeWidth={2} />
              {ADMIN_CONTACT_EMAIL}
            </a>
            <a
              href="https://corporaciongegona.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-navy-foreground/70 hover:text-gold-soft"
            >
              <Globe size={18} strokeWidth={2} />
              corporaciongegona.com
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

        {/* Sello de alianza institucional. */}
        <div className="flex items-center gap-3 border-t border-navy-foreground/15 pt-6 text-sm text-navy-foreground/70">
          <Logo
            size="sm"
            variant="dark"
            className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5"
          />
          <a
            href="https://corporaciongegona.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-soft hover:underline"
          >
            Corporación Gégona
          </a>
        </div>
      </div>
    </footer>
  )
}
