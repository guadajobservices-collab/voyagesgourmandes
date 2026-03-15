import { notFound } from 'next/navigation'
import { getTenantBySlug } from '@/lib/tenant'
import { getMenuByTenantId } from '@/lib/menu'
import MenuSection from '@/components/catalog/MenuSection'
import CartButton from '@/components/cart/CartButton'
import RestaurantHeader from '@/components/catalog/RestaurantHeader'
import CartProvider from '@/components/cart/CartProvider'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params
  const ctx = await getTenantBySlug(slug)

  if (!ctx) notFound()

  const menus = await getMenuByTenantId(ctx.tenant.id)

  return (
    <CartProvider tenantId={ctx.tenant.id} slug={slug}>
      <div className="min-h-screen bg-gray-50">
        {/* Header restaurant */}
        <RestaurantHeader tenant={ctx.tenant} config={ctx.config} />

        {/* Menu */}
        <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
          {menus.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🌴</div>
              <p className="text-gray-500">Le menu arrive bientôt...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {menus.map(menu => (
                <MenuSection key={menu.id} menu={menu} />
              ))}
            </div>
          )}
        </main>

        {/* Floating cart button */}
        <CartButton slug={slug} />
      </div>
    </CartProvider>
  )
}
