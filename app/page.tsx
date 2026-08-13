import { CategoryCard } from '@/components/category-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { categories } from '@/lib/data'
import { getEntryCountByCategory } from '@/lib/entries'

// Conteos moderados en vivo: nunca servir un snapshot estático desactualizado.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const counts = await Promise.all(
    categories.map((c) => getEntryCountByCategory(c.slug)),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-gold/50 bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
            Risaralda Pereira · Agosto 2026
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-navy text-balance sm:text-5xl">
            Ayuda solidaria, verificada y al alcance de todos
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Encuentra y comparte información confiable para apoyar a las
            familias afectadas por el terremoto. Elige una categoría para ver
            cómo ayudar o solicitar ayuda.
          </p>
        </section>

        <section
          className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2"
          aria-label="Categorías de ayuda"
        >
          {categories.map((category, i) => (
            <CategoryCard
              key={category.slug}
              category={category}
              count={counts[i]}
            />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
