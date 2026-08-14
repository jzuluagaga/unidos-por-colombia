import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import type { Entry } from '@/lib/types'

const ADMIN_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL ?? 'contacto@unidosporcolombia.org'

export function EntryCard({
  entry,
  isSensitiveContact,
}: {
  entry: Entry
  /** category.isSensitiveContact — el contacto no se expone públicamente,
   * se protege al reportante/familia detrás de un correo de administración. */
  isSensitiveContact: boolean
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-navy/15 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
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
          <p className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-navy">
            <Phone size={16} strokeWidth={2} className="text-gold" />
            {entry.contact}
          </p>
        )}

        {entry.contact && isSensitiveContact && (
          <a
            href={`mailto:${ADMIN_CONTACT_EMAIL}?subject=${encodeURIComponent(
              `Información sobre: ${entry.title}`,
            )}&body=${encodeURIComponent(
              `Tengo información relacionada con el caso "${entry.title}" (ID ${entry.id}).\n\n`,
            )}`}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-2 pt-2 text-sm font-semibold text-navy-foreground transition-colors hover:brightness-110"
          >
            <Mail size={16} strokeWidth={2} />
            Contactar
          </a>
        )}
      </div>
    </article>
  )
}
