import Image from 'next/image'
import type { Tenant, TenantConfig } from '@/types/database.types'

interface RestaurantHeaderProps {
  tenant: Tenant
  config: TenantConfig | null
}

export default function RestaurantHeader({ tenant, config }: RestaurantHeaderProps) {
  const primaryColor = config?.primary_color ?? '#FF6B35'

  return (
    <header
      className="relative text-white"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Hero image */}
      {config?.hero_image_url && (
        <div className="absolute inset-0">
          <Image
            src={config.hero_image_url}
            alt={tenant.name}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4">
          {config?.logo_url ? (
            <Image
              src={config.logo_url}
              alt={`Logo ${tenant.name}`}
              width={64}
              height={64}
              className="rounded-xl bg-white/20 object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
              🌴
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            {tenant.description && (
              <p className="text-sm opacity-80 mt-0.5">{tenant.description}</p>
            )}
          </div>
        </div>

        {tenant.phone && (
          <a
            href={`tel:${tenant.phone}`}
            className="mt-3 inline-flex items-center gap-1 text-sm opacity-75 hover:opacity-100 transition"
          >
            📞 {tenant.phone}
          </a>
        )}
      </div>
    </header>
  )
}
