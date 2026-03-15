'use client'

import { useState } from 'react'
import { createCategory, deleteCategory, toggleAvailability, createMenuItem, deleteMenuItem } from '@/app/actions/menu'
import type { MenuWithItems, MenuItem } from '@/types/database.types'

interface MenuDashboardProps {
  menus: MenuWithItems[]
  tenantId: string
}

export default function MenuDashboard({ menus, tenantId }: MenuDashboardProps) {
  const [showCatForm, setShowCatForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState<string | null>(null) // menu_id

  return (
    <div className="space-y-6">
      {/* Bouton ajouter catégorie */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCatForm(!showCatForm)}
          className="btn-primary"
          style={{ backgroundColor: 'var(--color-coral)' }}
        >
          {showCatForm ? '✕ Annuler' : '+ Nouvelle catégorie'}
        </button>
      </div>

      {/* Formulaire nouvelle catégorie */}
      {showCatForm && (
        <div className="card border-2 border-orange-100">
          <h3 className="font-semibold mb-3">Nouvelle catégorie</h3>
          <form
            action={async (formData) => {
              await createCategory(formData)
              setShowCatForm(false)
            }}
            className="space-y-3"
          >
            <input
              name="name"
              required
              placeholder="Nom de la catégorie"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              name="description"
              placeholder="Description (optionnel)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm" style={{ backgroundColor: 'var(--color-coral)' }}>
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowCatForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste catégories */}
      {menus.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-gray-500">Aucune catégorie. Commencez par créer votre première catégorie.</p>
        </div>
      ) : (
        menus.map(menu => (
          <div key={menu.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{menu.name}</h3>
                {menu.description && (
                  <p className="text-sm text-gray-500">{menu.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowItemForm(showItemForm === menu.id ? null : menu.id)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                >
                  + Plat
                </button>
                <form action={async () => { await deleteCategory(menu.id) }}>
                  <button type="submit" className="text-sm text-red-500 hover:text-red-700 px-2">
                    🗑️
                  </button>
                </form>
              </div>
            </div>

            {/* Formulaire nouveau plat */}
            {showItemForm === menu.id && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-sm mb-3">Nouveau plat dans &quot;{menu.name}&quot;</h4>
                <form
                  action={async (formData) => {
                    formData.set('menu_id', menu.id)
                    await createMenuItem(formData)
                    setShowItemForm(null)
                  }}
                  className="space-y-2"
                >
                  <input name="name" required placeholder="Nom du plat" className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" />
                  <input name="description" placeholder="Description" className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" />
                  <div className="flex gap-2">
                    <input name="price" type="number" step="0.01" min="0" required placeholder="Prix (€)" className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm" />
                    <input name="photo" type="file" accept="image/*" className="text-sm text-gray-500 flex-1" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="text-sm px-4 py-1.5 rounded bg-orange-500 text-white hover:bg-orange-600">
                      Ajouter
                    </button>
                    <button type="button" onClick={() => setShowItemForm(null)} className="text-sm text-gray-500">
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des plats */}
            <div className="space-y-2">
              {(!menu.menu_items || menu.menu_items.length === 0) ? (
                <p className="text-sm text-gray-400 italic">Aucun plat dans cette catégorie</p>
              ) : (
                menu.menu_items.map((item: MenuItem) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.is_available ? 'border-gray-100 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.photo_url && (
                        <img src={item.photo_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-400">{item.description}</p>
                        )}
                        <p className="text-sm font-semibold text-orange-600 mt-0.5">{Number(item.price).toFixed(2)} €</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => toggleAvailability(item.id, !item.is_available)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.is_available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {item.is_available ? '✓ Dispo' : '✗ Indispo'}
                      </button>
                      <form action={async () => deleteMenuItem(item.id)}>
                        <button type="submit" className="text-gray-400 hover:text-red-500 text-sm">🗑️</button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
