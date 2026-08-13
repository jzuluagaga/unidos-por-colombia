import { HandHeart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }[size]

  const iconSize = { sm: 20, md: 26, lg: 38 }[size]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border-2 border-gold bg-cream ring-2 ring-gold-soft/60 ring-offset-2 ring-offset-background',
        dims,
        className,
      )}
      aria-hidden="true"
    >
      <HandHeart size={iconSize} strokeWidth={1.75} className="text-gold" />
    </span>
  )
}
