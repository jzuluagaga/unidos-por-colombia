import {
  BedDouble,
  BriefcaseBusiness,
  ClipboardCheck,
  Gift,
  PawPrint,
  UserSearch,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  ClipboardCheck,
  BriefcaseBusiness,
  Gift,
  BedDouble,
  PawPrint,
  UserSearch,
}

export function CategoryIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = iconMap[name] ?? ClipboardCheck
  return <Icon {...props} />
}
