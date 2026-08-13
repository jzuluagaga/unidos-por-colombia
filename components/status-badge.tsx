import { statusMeta } from '@/lib/data'
import type { EntryStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const colorClasses: Record<string, string> = {
  urgent: 'bg-urgent text-urgent-foreground',
  success: 'bg-success text-success-foreground',
  navy: 'bg-navy text-navy-foreground',
  gold: 'bg-gold text-navy',
  muted: 'bg-secondary text-muted-foreground',
}

export function StatusBadge({
  status,
  className,
}: {
  status: EntryStatus
  className?: string
}) {
  const meta = statusMeta[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
        colorClasses[meta.color] ?? colorClasses.muted,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
