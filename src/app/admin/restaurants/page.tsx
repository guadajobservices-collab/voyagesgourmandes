import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminRestaurantsPage() {
  const supabase = await createClient()

  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Link
          href="/admin/restaurants/new"
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm font-medium transition"
        >
          + Nouveau restaurant
        </Link>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Restaurant</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Statut</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {tenants?.map(tenant => (
              <tr key={tenant.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-sm">{tenant.name}</p>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/${tenant.slug}`}
                    target="_blank"
                    className="text-sm text-teal-400 hover:text-teal-300"
                  >
                    /{tenant.slug}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{tenant.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tenant.status === 'active'
                      ? 'bg-green-900 text-green-300'
                      : tenant.status === 'inactive'
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(tenant.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!tenants || tenants.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            Aucun restaurant enregistré.
          </div>
        )}
      </div>
    </div>
  )
}
