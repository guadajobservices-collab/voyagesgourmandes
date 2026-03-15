'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import type { Profile } from '@/types/database.types'

const navItems = [
  { href: '/dashboard', label: '📊 Tableau de bord', exact: true },
  { href: '/dashboard/commandes', label: '🍽️ Commandes' },
  { href: '/dashboard/menu', label: '📋 Menu' },
  { href: '/dashboard/fidelite', label: '⭐ Fidélité' },
  { href: '/dashboard/settings/branding', label: '🎨 Branding' },
]

export default function DashboardNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-gray-900">🌴 VGE Dashboard</span>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{profile.full_name}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
