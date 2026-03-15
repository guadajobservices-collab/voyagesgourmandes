import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { TENANT_HEADER, TENANT_SLUG_HEADER } from '@/types/tenant'

// Routes qui ne nécessitent pas de résolution tenant
const PUBLIC_PATHS = [
  '/favicon.ico',
  '/_next',
  '/api/auth',
  '/api/webhooks',
  '/connexion',
  '/inscription',
  '/admin',
]

// Routes dashboard qui nécessitent une auth mais pas de tenant dans l'URL
const DASHBOARD_PATHS = ['/dashboard']
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorer les assets statiques
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Mettre à jour la session Supabase (refresh token)
  const { response } = await updateSession(request)

  // Routes admin — pas de résolution tenant
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    return response
  }

  // Routes dashboard — pas de résolution tenant via URL
  if (DASHBOARD_PATHS.some(p => pathname.startsWith(p))) {
    return response
  }

  // Routes auth — pas de résolution tenant
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return response
  }

  // Routes publiques restaurant — résoudre le tenant depuis le slug
  // Pattern: /[slug] ou /[slug]/...
  const slugMatch = pathname.match(/^\/([^/]+)/)
  if (slugMatch) {
    const potentialSlug = slugMatch[1]

    // Ignorer les routes réservées
    const reservedSlugs = ['connexion', 'inscription', 'dashboard', 'admin', 'api']
    if (reservedSlugs.includes(potentialSlug)) {
      return response
    }

    // Résoudre le tenant via l'API Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    try {
      const tenantResponse = await fetch(
        `${supabaseUrl}/rest/v1/tenants?slug=eq.${potentialSlug}&status=eq.active&select=id,slug&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          next: { revalidate: 60 }, // Cache 60s
        }
      )

      if (tenantResponse.ok) {
        const tenants = await tenantResponse.json() as Array<{ id: string; slug: string }>
        if (tenants.length > 0) {
          const tenant = tenants[0]
          // Injecter le tenant dans les headers
          const requestWithTenant = new NextRequest(request.url, {
            headers: new Headers(request.headers),
          })
          response.headers.set(TENANT_HEADER, tenant.id)
          response.headers.set(TENANT_SLUG_HEADER, tenant.slug)
          requestWithTenant.headers.set(TENANT_HEADER, tenant.id)
          requestWithTenant.headers.set(TENANT_SLUG_HEADER, tenant.slug)

          // Retourner avec les headers modifiés
          const newResponse = NextResponse.next({
            request: requestWithTenant,
          })
          newResponse.headers.set(TENANT_HEADER, tenant.id)
          newResponse.headers.set(TENANT_SLUG_HEADER, tenant.slug)

          // Copier les cookies de session
          response.cookies.getAll().forEach(cookie => {
            newResponse.cookies.set(cookie.name, cookie.value)
          })

          return newResponse
        }
      }

      // Tenant non trouvé → 404
      return NextResponse.rewrite(new URL('/not-found', request.url))
    } catch {
      // En cas d'erreur réseau, laisser passer (mode dégradé)
      return response
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
