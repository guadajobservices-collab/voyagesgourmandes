import { createTenant } from '@/app/actions/admin'

export default function NewRestaurantPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Nouveau restaurant</h1>

      <form action={createTenant} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nom du restaurant *</label>
          <input
            name="name"
            required
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            placeholder="Chez Jean-Claude"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Slug (URL) *</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">vge.gp/</span>
            <input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className="flex-1 rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              placeholder="chez-jean-claude"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Lettres minuscules, chiffres et tirets uniquement</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email restaurateur *</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            placeholder="contact@restaurant.gp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
          <input
            name="phone"
            type="tel"
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            placeholder="+590 690 00 00 00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Cuisine antillaise traditionnelle..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 font-semibold text-sm transition"
        >
          Créer le restaurant
        </button>
      </form>
    </div>
  )
}
