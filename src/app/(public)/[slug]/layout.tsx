import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTenantBySlug } from '@/lib/tenant'
import TenantThemeProvider from '@/components/TenantThemeProvider'

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TenantLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)

  if (!ctx) return { title: 'Restaurant introuvable' }

  return {
    title: {
      template: `%s | ${ctx.tenant.name}`,
      default: ctx.tenant.name,
    },
    description: ctx.config?.meta_description ?? ctx.tenant.description ?? undefined,
    manifest: `/${slug}/manifest.json`,
    appleWebApp: {
      title: ctx.tenant.name,
      capable: true,
    },
    other: {
      'theme-color': ctx.config?.primary_color ?? '#FF6B35',
    },
  }
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)

  if (!ctx) notFound()

  return (
    <TenantThemeProvider config={ctx.config}>
      {children}
    </TenantThemeProvider>
  )
}
