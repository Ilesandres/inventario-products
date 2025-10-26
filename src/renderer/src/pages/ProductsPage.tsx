import React, { useEffect, useMemo, useState } from 'react'
import { getAllProducts } from '../services/productService'
import { Product } from '../types/Product'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function ProductsPage(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    let mounted = true
    getAllProducts().then((data) => {
      if (mounted) setProducts(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const categories = useMemo(() => {
    const s = new Set<string>()
    products.forEach((p) => s.add(p.category))
    return Array.from(s)
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [products, query, categoryFilter])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Productos</h2>
        <div className="flex items-center space-x-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button onClick={() => { setQuery(''); setCategoryFilter('') }}>Limpiar</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-300">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Creado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center">
                      <img
                        src={p.image ?? `https://picsum.photos/seed/${p.id}/48/48`}
                        alt={p.name}
                        className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0"
                      />
                      <div className="truncate">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">{p.category}</td>
                  <td className="px-4 py-3 align-top">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 align-top">{p.stock}</td>
                  <td className="px-4 py-3 align-top">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Button>Editar</Button>
                      <Button>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-4 text-gray-400">No se encontraron productos.</div>}
        </div>
      </Card>
    </div>
  )
}

export default ProductsPage
