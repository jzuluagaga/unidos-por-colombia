import Link from 'next/link'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

const tabClass = (active: boolean) =>
  cn(
    'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors',
    active
      ? 'border-gold text-navy'
      : 'border-transparent text-muted-foreground hover:text-navy',
  )

export function AdminCategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[]
  /** null cuando la pestaña activa es "Categorías" (gestión de categorías). */
  activeSlug: string | null
}) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/${c.slug}`}
            className={tabClass(c.slug === activeSlug)}
          >
            {c.name}
          </Link>
        ))}
        <Link href="/admin/categorias" className={tabClass(activeSlug === null)}>
          Categorías
        </Link>
      </div>
    </nav>
  )
}
