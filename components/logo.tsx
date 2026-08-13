import Image from 'next/image'
import { cn } from '@/lib/utils'

const SOURCES = {
  // Isotipo + wordmark "corporación gégona" (texto negro) — para fondos claros.
  full: '/images/gegona-logo.png',
  // Solo isotipo, sin wordmark — para fondos oscuros donde el texto negro
  // del logo completo no se leería (header del panel admin, footer).
  dark: '/images/gegona-logo-dark.png',
}

export function Logo({
  size = 'md',
  variant = 'full',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'dark'
  className?: string
}) {
  const dims = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }[size]

  return (
    <span className={cn('relative inline-block shrink-0', dims, className)}>
      <Image
        src={SOURCES[variant]}
        alt="Corporación Gégona"
        fill
        sizes="128px"
        className="object-contain"
      />
    </span>
  )
}
