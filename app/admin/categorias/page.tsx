import { AdminCategoriesPanel } from '@/components/admin-categories-panel'
import { getCategoriesWithCounts } from '@/lib/categories'

// El panel admin siempre debe ver el estado más reciente.
export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts()
  return <AdminCategoriesPanel initialCategories={categories} />
}
