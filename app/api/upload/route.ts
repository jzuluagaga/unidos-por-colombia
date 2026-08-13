import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from '@/lib/rate-limit'

// Subida pública (formulario de reporte): sin sesión, límites estrictos.
export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request)
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados envíos. Intenta de nuevo más tarde.' },
      { status: 429 },
    )
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maximumSizeInBytes: 5 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    )
  }
}
