import { NextResponse } from 'next/server'
import { getTenantBySlug } from '@/lib/tenant'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)

  if (!ctx) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const primaryColor = ctx.config?.primary_color ?? '#FF6B35'
  const manifest = {
    name: ctx.tenant.name,
    short_name: ctx.tenant.name.slice(0, 12),
    description: ctx.tenant.description ?? `Commander chez ${ctx.tenant.name}`,
    start_url: `/${slug}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: primaryColor,
    orientation: 'portrait-primary',
    lang: 'fr',
    icons: [
      {
        src: ctx.config?.logo_url ?? '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: ctx.config?.logo_url ?? '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['food', 'shopping'],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
