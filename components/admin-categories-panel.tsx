'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminCategoryNav } from '@/components/admin-category-nav'
import { CategoryForm, type CategoryDraft } from '@/components/category-form'
import { CategoryIcon } from '@/components/category-icon'
import { Logo } from '@/components/logo'
import type { Category } from '@/lib/types'

type CategoryWithCount = Category & { entryCount: number }

export function AdminCategoriesPanel({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[]
}) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(
    initialCategories,
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryWithCount | undefined>(
    undefined,
  )
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(
    null,
  )
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(category: CategoryWithCount) {
    setEditing(category)
    setFormOpen(true)
  }

  async function handleSave(draft: CategoryDraft) {
    const payload = {
      name: draft.name,
      description: draft.description,
      icon: draft.icon,
      accent: draft.accent,
      reportLabel: draft.reportLabel,
      reportNoun: draft.reportNoun,
      isSensitiveContact: draft.isSensitiveContact,
    }

    const response = editing
      ? await fetch(`/api/admin/categories/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, slug: draft.slug }),
        })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.error ?? 'No se pudo guardar la categoría.')
    }

    const saved = data.category as Category
    setCategories((prev) =>
      editing
        ? prev.map((c) =>
            c.id === saved.id ? { ...saved, entryCount: c.entryCount } : c,
          )
        : [...prev, { ...saved, entryCount: 0 }],
    )
    setFormOpen(false)
    setEditing(undefined)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const response = await fetch(
        `/api/admin/categories/${deleteTarget.id}`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo eliminar la categoría.')
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'No se pudo eliminar la categoría.',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 bg-navy text-navy-foreground">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo
              size="sm"
              variant="dark"
              className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5"
            />
            <div className="leading-tight">
              <p className="font-serif text-base font-bold uppercase tracking-tight sm:text-lg">
                Panel de administración
              </p>
              <p className="text-xs text-navy-foreground/70">
                Unidos por Colombia
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:bg-navy-foreground/10"
          >
            <LogOut size={16} strokeWidth={2.25} />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Link>
        </div>
      </header>

      <AdminCategoryNav categories={categories} activeSlug={null} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
              Categorías
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length}{' '}
              {categories.length === 1 ? 'categoría' : 'categorías'} en total
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus size={18} strokeWidth={2.5} />
            Nueva categoría
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-navy/15 bg-card shadow-sm">
          {categories.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Aún no hay categorías creadas.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/40"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-navy">
                    <CategoryIcon
                      name={c.icon}
                      size={22}
                      strokeWidth={1.75}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">
                      {c.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      /{c.slug}
                      {c.isSensitiveContact && (
                        <span className="ml-2 rounded-full bg-urgent/10 px-2 py-0.5 text-xs font-semibold text-urgent">
                          Contacto oculto
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {c.entryCount} {c.entryCount === 1 ? 'entrada' : 'entradas'}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      aria-label={`Editar ${c.name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
                    >
                      <Pencil size={15} strokeWidth={2} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(c)
                      }}
                      aria-label={`Eliminar ${c.name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-urgent/30 px-3 py-2 text-sm font-semibold text-urgent transition-colors hover:bg-urgent/10"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {formOpen && (
        <CategoryForm
          category={editing}
          onCancel={() => {
            setFormOpen(false)
            setEditing(undefined)
          }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-urgent/10 text-urgent">
              <Trash2 size={24} strokeWidth={2} />
            </span>
            <h2
              id="delete-category-title"
              className="mt-4 font-serif text-xl font-bold text-navy"
            >
              Eliminar categoría
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              ¿Seguro que deseas eliminar{' '}
              <span className="font-semibold text-navy">
                {deleteTarget.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg border border-urgent/30 bg-urgent/10 px-3 py-2 text-sm font-medium text-urgent">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-secondary disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-urgent px-6 py-2.5 text-sm font-bold text-urgent-foreground shadow-sm transition-all hover:brightness-105 disabled:opacity-60"
              >
                {deleting ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
