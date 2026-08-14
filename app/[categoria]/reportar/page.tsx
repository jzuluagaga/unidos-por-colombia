import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ReportForm } from '@/components/report-form'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getCategories, getCategoryBySlug } from '@/lib/categories'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ categoria: c.slug }))
}

export default async function ReportarPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const category = await getCategoryBySlug(categoria)
  if (!category) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader compact />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href={`/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
          Volver a {category.name}
        </Link>

        <header className="mt-6 mb-6">
          <h1 className="font-serif text-2xl font-bold text-navy text-balance sm:text-3xl">
            {category.reportLabel}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Completa el formulario para reportar {category.reportNoun}. La
            información será verificada antes de aparecer en la plataforma.
          </p>
        </header>

        <ReportForm category={category} />
      </main>

      <SiteFooter />
    </div>
  )
}
