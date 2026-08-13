'use client'

import { upload } from '@vercel/blob/client'
import Image from 'next/image'
import { useEffect, useState, type FormEvent } from 'react'
import { ImagePlus, Upload, X } from 'lucide-react'
import { adminStatusOptions, statusMeta } from '@/lib/data'
import type { CategorySlug, Entry, EntryStatus } from '@/lib/types'

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/40'
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy'

export type EntryDraft = {
  title: string
  subtitle: string
  description: string
  contact: string
  status: EntryStatus
  photo: string
}

export function AdminEntryForm({
  category,
  entry,
  onCancel,
  onSave,
}: {
  category: CategorySlug
  /** When provided, the form edits an existing entry. */
  entry?: Entry
  onCancel: () => void
  onSave: (draft: EntryDraft) => Promise<void>
}) {
  const [photoPreview, setPhotoPreview] = useState<string>(entry?.photo ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<EntryStatus>(entry?.status ?? 'pendiente')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cerrar con la tecla Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPhotoPreview(URL.createObjectURL(selected))
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const form = new FormData(e.currentTarget)

    try {
      let photoUrl = entry?.photo ?? ''
      if (file) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
        })
        photoUrl = blob.url
      }

      await onSave({
        title: String(form.get('title') ?? '').trim(),
        subtitle: String(form.get('subtitle') ?? '').trim(),
        description: String(form.get('description') ?? '').trim(),
        contact: String(form.get('contact') ?? '').trim(),
        status,
        photo: photoUrl,
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar la entrada.',
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
      aria-labelledby="entry-form-title"
      onClick={onCancel}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="entry-form-title"
            className="font-serif text-xl font-bold text-navy"
          >
            {entry ? 'Editar entrada' : 'Nueva entrada'}
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
            <span className={labelClass}>Foto</span>
            <label
              htmlFor="admin-foto"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-secondary/50 px-4 py-4 text-center text-sm text-muted-foreground transition-colors hover:border-gold hover:bg-cream/50"
            >
              {photoPreview ? (
                <span className="relative h-36 w-full max-w-xs overflow-hidden rounded-md">
                  <Image
                    src={photoPreview || '/placeholder.svg'}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </span>
              ) : (
                <ImagePlus size={26} strokeWidth={1.75} className="text-gold" />
              )}
              <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
                <Upload size={15} strokeWidth={2} />
                {photoPreview ? 'Reemplazar foto' : 'Subir foto'}
              </span>
              <input
                id="admin-foto"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFile}
              />
            </label>
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              Título
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={entry?.title}
              className={fieldClass}
              placeholder="Título de la entrada"
            />
          </div>

          <div>
            <label htmlFor="subtitle" className={labelClass}>
              Ubicación / contexto
            </label>
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={entry?.subtitle}
              className={fieldClass}
              placeholder="Ciudad, barrio o detalle"
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={entry?.description}
              className={`${fieldClass} resize-y`}
              placeholder="Descripción de la entrada"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className={labelClass}>
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as EntryStatus)}
                className={fieldClass}
              >
                {adminStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {statusMeta[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="contact" className={labelClass}>
                Teléfono de contacto
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                inputMode="tel"
                defaultValue={entry?.contact}
                className={fieldClass}
                placeholder="Ej. 310 555 0000"
              />
            </div>
          </div>

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
                : entry
                  ? 'Guardar cambios'
                  : 'Crear entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
