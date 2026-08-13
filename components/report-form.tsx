'use client'

import { upload } from '@vercel/blob/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { CircleCheckBig, ImagePlus, Upload } from 'lucide-react'
import type { Category } from '@/lib/types'

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/40'
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy'

export function ReportForm({ category }: { category: Category }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) {
      setPreview(null)
      setFile(null)
      return
    }
    setPreview(URL.createObjectURL(selected))
    setFile(selected)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    try {
      let photoUrl: string | undefined
      if (file) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        })
        photoUrl = blob.url
      }

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category.slug,
          nombre: String(form.get('nombre') ?? ''),
          ubicacion: String(form.get('ubicacion') ?? ''),
          descripcion: String(form.get('descripcion') ?? ''),
          telefono: String(form.get('telefono') ?? ''),
          photoUrl,
          website: String(form.get('website') ?? ''),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo enviar el reporte.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo enviar el reporte.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-success/40 bg-success/10 p-8 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground">
          <CircleCheckBig size={30} strokeWidth={2} />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-navy">
          ¡Reporte enviado!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground/80">
          Tu reporte fue enviado y está en revisión antes de publicarse. Nuestro
          equipo verifica cada caso para mantener la información confiable.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${category.slug}`}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-navy-foreground transition-colors hover:brightness-110"
          >
            Volver a {category.name}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-navy/20 px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy/15 bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="nombre" className={labelClass}>
            Nombre o título
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className={fieldClass}
            placeholder="Ej. Agua potable, Carlos Mosquera, Centro de acopio…"
          />
        </div>

        <div>
          <label htmlFor="ubicacion" className={labelClass}>
            Ubicación
          </label>
          <input
            id="ubicacion"
            name="ubicacion"
            required
            className={fieldClass}
            placeholder="Ciudad, barrio o punto de referencia"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className={labelClass}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Cuéntanos los detalles importantes de tu reporte"
          />
        </div>

        <div>
          <label htmlFor="telefono" className={labelClass}>
            Teléfono de contacto
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            className={fieldClass}
            placeholder="Ej. 310 555 0000"
          />
        </div>

        <div>
          <span className={labelClass}>Foto (opcional)</span>
          <label
            htmlFor="foto"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-secondary/50 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-gold hover:bg-cream/50"
          >
            {preview ? (
              <span className="relative h-40 w-full max-w-xs overflow-hidden rounded-md">
                <Image
                  src={preview || '/placeholder.svg'}
                  alt="Vista previa de la foto"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </span>
            ) : (
              <ImagePlus size={28} strokeWidth={1.75} className="text-gold" />
            )}
            <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
              <Upload size={15} strokeWidth={2} />
              {preview ? 'Cambiar foto' : 'Subir una foto'}
            </span>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
            />
          </label>
        </div>
      </div>

      {/* Honeypot anti-spam: invisible para personas, visible para bots que
          completan formularios de forma genérica. La validación real es en
          el servidor; este campo nunca debe mostrarse ni recibir foco. */}
      <div
        className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Página web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-urgent/30 bg-urgent/10 px-4 py-2.5 text-sm font-medium text-urgent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 w-full rounded-full bg-gold px-6 py-3.5 text-base font-bold text-navy shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70"
      >
        {submitting ? 'Enviando…' : 'Enviar reporte'}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Tu reporte será revisado por nuestro equipo antes de publicarse.
      </p>
    </form>
  )
}
