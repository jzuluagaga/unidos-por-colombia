import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { FOUNDATION_WHATSAPP_NUMBER } from '@/lib/constants'
import type { Entry } from '@/lib/types'

/** "310 555 0000" -> "573105550000". Los admins escriben el contacto como
 * texto libre (sin indicativo); asumimos Colombia (+57) si no lo trae ya. */
function buildWhatsAppUrl(contact: string) {
  const digits = contact.replace(/\D/g, '')
  const withCountryCode =
    digits.startsWith('57') && digits.length > 10 ? digits : `57${digits}`
  return `https://wa.me/${withCountryCode}`
}

/** Para categorías sensibles: el visitante escribe a la fundación (no al
 * contacto real, que queda oculto), con un mensaje prellenado del caso. */
function buildFoundationWhatsAppUrl(entry: Entry) {
  const message = `Tengo información sobre el caso: ${entry.title} (ID ${entry.id})`
  return `https://wa.me/${FOUNDATION_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function EntryCard({
  entry,
  isSensitiveContact,
}: {
  entry: Entry
  /** category.isSensitiveContact — el contacto no se expone públicamente,
   * se protege al reportante/familia detrás del WhatsApp de la fundación. */
  isSensitiveContact: boolean
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-navy/15 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary">
        <Image
          src={entry.photo || '/placeholder.svg'}
          alt={entry.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute right-3 top-3">
          <StatusBadge status={entry.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-serif text-lg font-bold leading-snug text-navy text-balance">
          {entry.title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground">
          {entry.subtitle}
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {entry.description}
        </p>

        {entry.contact && !isSensitiveContact && (
          <a
            href={buildWhatsAppUrl(entry.contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 pt-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105"
          >
            <MessageCircle size={16} strokeWidth={2} />
            {entry.contact}
          </a>
        )}

        {entry.contact && isSensitiveContact && (
          <a
            href={buildFoundationWhatsAppUrl(entry)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-full bg-navy px-4 py-2 pt-2 text-sm font-semibold text-navy-foreground transition-colors hover:brightness-110"
          >
            <MessageCircle size={16} strokeWidth={2} />
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </article>
  )
}
