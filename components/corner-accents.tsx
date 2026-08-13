import { cn } from '@/lib/utils'

/**
 * Subtle gold corner brackets used as a decorative frame.
 * Purely decorative — hidden from assistive tech.
 */
export function CornerAccents({ className }: { className?: string }) {
  const corner = 'pointer-events-none absolute h-5 w-5 border-gold/60'
  return (
    <span aria-hidden="true" className={cn('absolute inset-0', className)}>
      <span className={cn(corner, 'left-2 top-2 border-l-2 border-t-2')} />
      <span className={cn(corner, 'right-2 top-2 border-r-2 border-t-2')} />
      <span className={cn(corner, 'bottom-2 left-2 border-b-2 border-l-2')} />
      <span className={cn(corner, 'bottom-2 right-2 border-b-2 border-r-2')} />
    </span>
  )
}
