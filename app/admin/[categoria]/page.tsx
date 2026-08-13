import { notFound } from 'next/navigation'
import { AdminPanel } from '@/components/admin-panel'
import { categories, categoryMap, isCategorySlug } from '@/lib/data'
import { getAllEntriesByCategory } from '@/lib/entries'

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }))
}

// El panel admin siempre debe ver el estado más reciente.
export const dynamic = 'force-dynamic'

export default async function AdminCategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  if (!isCategorySlug(categoria)) notFound()

  const category = categoryMap[categoria]
  const entries = await getAllEntriesByCategory(categoria)

  return (
    <AdminPanel
      category={category}
      categories={categories}
      initialEntries={entries}
    />
  )
}
