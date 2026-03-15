import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">🔧 VGE Admin</span>
            <nav className="flex items-center gap-1">
              <Link href="/admin" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                Dashboard
              </Link>
              <Link href="/admin/restaurants" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                Restaurants
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-gray-400 hover:text-white">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
