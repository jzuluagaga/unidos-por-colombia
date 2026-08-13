'use client'

import { useState, type FormEvent } from 'react'
import type { Category } from '@/lib/types'

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/40'
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy'

// Número fijo del admin: el formulario público no guarda nada en la base de
// datos, solo arma el mensaje y manda al reportante a WhatsApp. El admin
// revisa ahí y decide manualmente qué entra al sitio (panel de administración).
const WHATSAPP_NUMBER = '573507919323'

interface ReportFields {
  nombre: string
  ubicacion: string
  descripcion: string
  telefono: string
}

function buildWhatsAppUrl(category: Category, report: ReportFields) {
  const lines = [
    `Nuevo reporte — ${category.name}`,
    '',
    `Título: ${report.nombre}`,
    `Ubicación: ${report.ubicacion || '(no indicada)'}`,
    `Descripción: ${report.descripcion}`,
    `Teléfono: ${report.telefono || '(no indicado)'}`,
  ]
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

export function ReportForm({ category }: { category: Category }) {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    // Honeypot: si el campo oculto viene lleno, es un bot. No pasa nada
    // visible — simplemente no lo mandamos a ningún lado.
    if (String(form.get('website') ?? '').trim().length > 0) {
      return
    }

    setSubmitting(true)
    const report: ReportFields = {
      nombre: String(form.get('nombre') ?? ''),
      ubicacion: String(form.get('ubicacion') ?? ''),
      descripcion: String(form.get('descripcion') ?? ''),
      telefono: String(form.get('telefono') ?? ''),
    }

    // No se guarda nada en la base de datos: el admin revisa el mensaje de
    // WhatsApp y decide manualmente qué publicar desde el panel.
    window.location.href = buildWhatsAppUrl(category, report)
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
      </div>

      {/* Honeypot anti-spam: invisible para personas, visible para bots que
          completan formularios de forma genérica. */}
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

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 w-full rounded-full bg-gold px-6 py-3.5 text-base font-bold text-navy shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70"
      >
        {submitting ? 'Abriendo WhatsApp…' : 'Enviar reporte por WhatsApp'}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Tu reporte se envía por WhatsApp a nuestro equipo, que revisa y
        publica manualmente la información confiable.
      </p>
    </form>
  )
}
