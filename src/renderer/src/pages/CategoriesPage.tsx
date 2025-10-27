import React, { useMemo } from 'react'
import Card from '../components/ui/Card'
import { useAppContext } from '../context/AppContext'

function CategoriesPage(): React.JSX.Element {
  const { products } = useAppContext()

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach((p) => {
      const c = p.category || 'Sin categoría'
      map.set(c, (map.get(c) || 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [products])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm text-gray-400 mb-3">Lista de categorías</div>
          <ul className="space-y-2">
            {byCategory.map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <div>{c.name}</div>
                <div className="text-sm text-gray-400">{c.count} productos</div>
              </li>
            ))}
            {byCategory.length === 0 && <li className="text-gray-400">No hay categorías.</li>}
          </ul>
        </Card>

        <Card>
          <div className="text-sm text-gray-400 mb-3">Acciones</div>
          <div className="space-y-2">
            <div className="text-gray-300">Por ahora las categorías se obtienen desde los productos (mock).</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CategoriesPage
