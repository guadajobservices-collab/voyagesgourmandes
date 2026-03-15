import MenuItemCard from './MenuItemCard'
import type { MenuWithItems } from '@/types/database.types'

export default function MenuSection({ menu }: { menu: MenuWithItems }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{menu.name}</h2>
        {menu.description && (
          <p className="text-sm text-gray-500 mt-0.5">{menu.description}</p>
        )}
      </div>
      <div className="space-y-3">
        {menu.menu_items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
