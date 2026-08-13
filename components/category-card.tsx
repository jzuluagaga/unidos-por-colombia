import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { CornerAccents } from '@/components/corner-accents'
import type { AccentColor, Category } from '@/lib/types'
import { cn } from '@/lib/utils'

const accentIcon: Record<AccentColor, string> = {
  gold: 'text-gold bg-cream',
  navy: 'text-navy bg-secondary',
  success: 'text-success bg-success/10',
  urgent: 'text-urgent bg-urgent/10',
}

export function CategoryCard({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-navy/15 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-7"
    >
      <CornerAccents className="opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            'inline-flex h-14 w-14 items-center justify-center rounded-xl',
            accentIcon[category.accent],
          )}
        >
          <CategoryIcon
            name={category.icon}
            size={28}
            strokeWidth={1.75}
            fill="none"
          />
        </span>
        {typeof count === 'number' && (
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {count} {count === 1 ? 'registro' : 'registros'}
          </span>
        )}
      </div>

      <div className="mt-6">
        <h2 className="font-serif text-xl font-bold text-navy text-balance sm:text-2xl">
          {category.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold">
        Ver información
        <ArrowRight
          size={16}
          strokeWidth={2.25}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  )
}
