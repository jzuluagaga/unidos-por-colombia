import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/logo'
import { TricolorBar } from '@/components/tricolor-bar'

export function SiteHeader({
  compact = false,
}: {
  /** Compact variant for inner pages (smaller logo, single row). */
  compact?: boolean
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
      <TricolorBar />
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 sm:gap-4">
          <Logo size={compact ? 'sm' : 'md'} />
          <span className="flex flex-col">
            <span className="font-serif text-lg font-bold uppercase leading-none tracking-tight text-navy sm:text-2xl">
              Unidos por Colombia
            </span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-success sm:text-sm">
              <ShieldCheck size={16} strokeWidth={2} />
              Información verificada y actualizada
            </span>
          </span>
        </Link>
      </div>
      <div className="h-px w-full bg-border" />
    </header>
  )
}
