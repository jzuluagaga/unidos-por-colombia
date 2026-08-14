import { notFound } from 'next/navigation'
import { AdminPanel } from '@/components/admin-panel'
import { getCategories } from '@/lib/categories'
import { getAllEntriesByCategory } from '@/lib/entries'

export async function generateStaticParams() {
  const categories = await getCategories()
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
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categoria)
  if (!category) notFound()

  const entries = await getAllEntriesByCategory(categoria)

  return (
    <AdminPanel
      category={category}
      categories={categories}
      initialEntries={entries}
    />
  )
}
