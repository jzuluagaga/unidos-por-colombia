'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminEntryForm, type EntryDraft } from '@/components/admin-entry-form'
import { Logo } from '@/components/logo'
import { StatusBadge } from '@/components/status-badge'
import type { Category, Entry } from '@/lib/types'
import { cn } from '@/lib/utils'

type Filter = 'todos' | 'pendiente' | 'publicado' | 'rechazado'

const filters: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'publicado', label: 'Publicados' },
  { value: 'rechazado', label: 'Rechazados' },
]

export function AdminPanel({
  category,
  categories,
  initialEntries,
}: {
  category: Category
  categories: Category[]
  initialEntries: Entry[]
}) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [filter, setFilter] = useState<Filter>('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Entry | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (filter === 'todos') return entries
    if (filter === 'pendiente')
      return entries.filter((e) => e.status === 'pendiente')
    if (filter === 'rechazado')
      return entries.filter((e) => e.status === 'rechazado')
    return entries.filter((e) => e.status === 'publicado')
  }, [entries, filter])

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(entry: Entry) {
    setEditing(entry)
    setFormOpen(true)
  }

  async function handleSave(draft: EntryDraft) {
    const payload = {
      title: draft.title,
      subtitle: draft.subtitle,
      description: draft.description,
      photoUrl: draft.photo || undefined,
      status: draft.status,
      contact: draft.contact,
    }

    const response = editing
      ? await fetch(`/api/admin/entries/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, category: category.slug }),
        })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.error ?? 'No se pudo guardar la entrada.')
    }

    const saved = data.entry as Entry
    setEntries((prev) =>
      editing
        ? prev.map((e) => (e.id === saved.id ? saved : e))
        : [saved, ...prev],
    )
    setFormOpen(false)
    setEditing(undefined)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const response = await fetch(`/api/admin/entries/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo eliminar la entrada.')
      }
      setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'No se pudo eliminar la entrada.',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra superior del panel */}
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

      {/* Navegación de categorías */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/admin/${c.slug}`}
              className={cn(
                'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors',
                c.slug === category.slug
                  ? 'border-gold text-navy'
                  : 'border-transparent text-muted-foreground hover:text-navy',
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {entries.length}{' '}
              {entries.length === 1 ? 'entrada' : 'entradas'} en total
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus size={18} strokeWidth={2.5} />
            Agregar nueva entrada
          </button>
        </div>

        {/* Filtro por estado */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                filter === f.value
                  ? 'bg-navy text-navy-foreground'
                  : 'border border-navy/20 text-navy hover:bg-secondary',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de entradas */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-navy/15 bg-card shadow-sm">
          {visible.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No hay entradas que coincidan con el filtro seleccionado.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={entry.photo || '/placeholder.svg'}
                      alt={entry.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">
                      {entry.title}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {entry.subtitle}
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(entry)}
                      aria-label={`Editar ${entry.title}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
                    >
                      <Pencil size={15} strokeWidth={2} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(entry)
                      }}
                      aria-label={`Eliminar ${entry.title}`}
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
        <AdminEntryForm
          category={category.slug}
          entry={editing}
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
          aria-labelledby="delete-title"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-urgent/10 text-urgent">
              <Trash2 size={24} strokeWidth={2} />
            </span>
            <h2 id="delete-title" className="mt-4 font-serif text-xl font-bold text-navy">
              Eliminar entrada
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              ¿Seguro que deseas eliminar{' '}
              <span className="font-semibold text-navy">
                {deleteTarget.title}
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
