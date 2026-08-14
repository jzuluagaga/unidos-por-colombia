import {
  Baby,
  Backpack,
  BedDouble,
  BriefcaseBusiness,
  ClipboardCheck,
  ClipboardList,
  Droplet,
  Gift,
  Heart,
  Home,
  MapPin,
  Package,
  PawPrint,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  Stethoscope,
  Tent,
  Users,
  UserSearch,
  Utensils,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { CategoryIconName } from '@/lib/icons'

// Debe cubrir cada nombre en CATEGORY_ICON_NAMES (lib/icons.ts).
const iconMap: Record<CategoryIconName, ComponentType<LucideProps>> = {
  ClipboardCheck,
  BriefcaseBusiness,
  Gift,
  BedDouble,
  PawPrint,
  UserSearch,
  Heart,
  Home,
  Package,
  Users,
  Search,
  Phone,
  Shield,
  ShieldCheck,
  MapPin,
  ClipboardList,
  Droplet,
  Utensils,
  Stethoscope,
  Tent,
  Baby,
  Backpack,
}

export function CategoryIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = (iconMap as Record<string, ComponentType<LucideProps>>)[name] ?? ClipboardCheck
  return <Icon {...props} />
}
