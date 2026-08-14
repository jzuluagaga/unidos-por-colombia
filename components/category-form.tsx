'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { CATEGORY_ICON_NAMES, type CategoryIconName } from '@/lib/icons'
import type { AccentColor, Category } from '@/lib/types'
import { cn, slugify } from '@/lib/utils'

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/40'
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy'

const ACCENT_OPTIONS: { value: AccentColor; label: string; swatch: string }[] = [
  { value: 'gold', label: 'Dorado', swatch: 'bg-gold' },
  { value: 'navy', label: 'Azul marino', swatch: 'bg-navy' },
  { value: 'success', label: 'Verde', swatch: 'bg-success' },
  { value: 'urgent', label: 'Rojo urgente', swatch: 'bg-urgent' },
]

export type CategoryDraft = {
  name: string
  slug: string
  description: string
  icon: string
  accent: AccentColor
  reportLabel: string
  reportNoun: string
  isSensitiveContact: boolean
}

export function CategoryForm({
  category,
  onCancel,
  onSave,
}: {
  /** Cuando se provee, el formulario edita una categoría existente (slug fijo). */
  category?: Category
  onCancel: () => void
  onSave: (draft: CategoryDraft) => Promise<void>
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState(category?.description ?? '')
  const [icon, setIcon] = useState<CategoryIconName>(
    (category?.icon as CategoryIconName) ?? CATEGORY_ICON_NAMES[0],
  )
  const [accent, setAccent] = useState<AccentColor>(category?.accent ?? 'gold')
  const [reportLabel, setReportLabel] = useState(category?.reportLabel ?? '')
  const [reportNoun, setReportNoun] = useState(category?.reportNoun ?? '')
  const [isSensitiveContact, setIsSensitiveContact] = useState(
    category?.isSensitiveContact ?? false,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  function handleNameChange(value: string) {
    setName(value)
    if (!category && !slugTouched) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    setSlug(slugify(value))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!slug) {
      setError('El slug no puede quedar vacío.')
      return
    }

    setSubmitting(true)
    try {
      await onSave({
        name: name.trim(),
        slug,
        description: description.trim(),
        icon,
        accent,
        reportLabel: reportLabel.trim(),
        reportNoun: reportNoun.trim(),
        isSensitiveContact,
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar la categoría.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
      onClick={onCancel}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="category-form-title"
            className="font-serif text-xl font-bold text-navy"
          >
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="cat-name" className={labelClass}>
              Nombre
            </label>
            <input
              id="cat-name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={fieldClass}
              placeholder="Ej. Centros de acopio"
            />
          </div>

          <div>
            <label htmlFor="cat-slug" className={labelClass}>
              Slug (URL)
            </label>
            <input
              id="cat-slug"
              required
              value={slug}
              disabled={Boolean(category)}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={cn(
                fieldClass,
                category && 'cursor-not-allowed bg-secondary/60 text-muted-foreground',
              )}
              placeholder="centros-de-acopio"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {category
                ? 'El slug no se puede cambiar una vez creada la categoría.'
                : `Se usará en la URL: /${slug || 'slug-de-la-categoria'}`}
            </p>
          </div>

          <div>
            <label htmlFor="cat-description" className={labelClass}>
              Descripción
            </label>
            <textarea
              id="cat-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${fieldClass} resize-y`}
              placeholder="Descripción que aparece en la parte superior de la categoría"
            />
          </div>

          <div>
            <span className={labelClass}>Ícono</span>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {CATEGORY_ICON_NAMES.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  aria-label={iconName}
                  aria-pressed={icon === iconName}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                    icon === iconName
                      ? 'border-gold bg-cream text-navy'
                      : 'border-input text-muted-foreground hover:border-gold/60 hover:text-navy',
                  )}
                >
                  <CategoryIcon name={iconName} size={18} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={labelClass}>Color de acento</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ACCENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAccent(option.value)}
                  aria-pressed={accent === option.value}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                    accent === option.value
                      ? 'border-gold bg-cream text-navy'
                      : 'border-input text-muted-foreground hover:border-gold/60 hover:text-navy',
                  )}
                >
                  <span
                    className={cn('h-4 w-4 shrink-0 rounded-full', option.swatch)}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cat-report-label" className={labelClass}>
                Texto del botón
              </label>
              <input
                id="cat-report-label"
                required
                value={reportLabel}
                onChange={(e) => setReportLabel(e.target.value)}
                className={fieldClass}
                placeholder="Ej. Reportar un centro de acopio"
              />
            </div>
            <div>
              <label htmlFor="cat-report-noun" className={labelClass}>
                Sustantivo del reporte
              </label>
              <input
                id="cat-report-noun"
                required
                value={reportNoun}
                onChange={(e) => setReportNoun(e.target.value)}
                className={fieldClass}
                placeholder="Ej. centro de acopio"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-input bg-secondary/40 px-3.5 py-3 text-sm">
            <input
              type="checkbox"
              checked={isSensitiveContact}
              onChange={(e) => setIsSensitiveContact(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
            />
            <span>
              <span className="font-semibold text-navy">
                Ocultar el contacto en público
              </span>
              <span className="block text-muted-foreground">
                El teléfono no se muestra en las tarjetas; se redirige a un
                correo de administración (categorías sensibles, ej.
                Desaparecidos).
              </span>
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-urgent/30 bg-urgent/10 px-3.5 py-2.5 text-sm font-medium text-urgent">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-secondary disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-navy shadow-sm transition-all hover:brightness-105 disabled:opacity-60"
            >
              {submitting
                ? 'Guardando…'
                : category
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
