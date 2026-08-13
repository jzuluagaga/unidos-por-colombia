import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, ShieldCheck } from 'lucide-react'
import { EntryCard } from '@/components/entry-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { categories, categoryMap, isCategorySlug } from '@/lib/data'
import { getEntriesByCategory } from '@/lib/entries'

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }))
}

// Datos moderados en vivo: nunca servir un snapshot estático desactualizado.
export const dynamic = 'force-dynamic'

const VERIFIED_AT = '12 de agosto, 3:00 p. m.'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  if (!isCategorySlug(categoria)) notFound()

  const category = categoryMap[categoria]
  const entries = await getEntriesByCategory(categoria)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader compact />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
          Volver a categorías
        </Link>

        <div className="mt-6 border-b border-border pb-6">
          <h1 className="font-serif text-3xl font-bold text-navy text-balance sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            {category.description}
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-success">
            <ShieldCheck size={16} strokeWidth={2} />
            Información verificada al {VERIFIED_AT}
            <span className="text-muted-foreground">
              · {entries.length}{' '}
              {entries.length === 1 ? 'caso reportado' : 'casos reportados'}
            </span>
          </p>
        </div>

        {entries.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </section>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            Aún no hay información publicada en esta categoría.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href={`/${category.slug}/reportar`}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-navy shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus size={20} strokeWidth={2.5} />
            {category.reportLabel}
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
