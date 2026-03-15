import { notFound } from 'next/navigation'
import { getTenantBySlug } from '@/lib/tenant'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)
  if (!ctx) notFound()

  const pickupSlots = Array.isArray(ctx.config?.pickup_slots)
    ? (ctx.config.pickup_slots as string[])
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="text-white px-4 py-4 flex items-center gap-3"
        style={{ backgroundColor: 'var(--tenant-primary)' }}
      >
        <a href={`/${slug}`} className="text-white/80 hover:text-white text-xl">←</a>
        <h1 className="font-bold text-lg">Votre commande</h1>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <CheckoutForm slug={slug} tenantId={ctx.tenant.id} pickupSlots={pickupSlots} />
      </div>
    </div>
  )
}
