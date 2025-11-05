import React, { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAppContext } from '../context/AppContext'

function CategoriesPage(): React.JSX.Element {
  const { products } = useAppContext()
  const [query, setQuery] = useState('')

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach((p) => {
      const c = p.category || 'Sin categoría'
      map.set(c, (map.get(c) || 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [products])

  // Filtrar categorías basado en la búsqueda
  const filteredCategories = useMemo(() => {
    if (!query) return byCategory
    
    return byCategory.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [byCategory, query])

  const shouldShowScroll = filteredCategories.length > 7

  function clearSearch() {
    setQuery('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Categorías {`(${filteredCategories.length} de ${byCategory.length})`}
        </h2>
        <div className="flex items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar categoría..."
            className="max-w-xs"
          />
          <Button onClick={clearSearch} disabled={!query}>
            Limpiar
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center justify-between">
          <Card>
            

            <div className={`
              p-6 pt-4
              ${shouldShowScroll ? `
                max-h-[420px] /* Altura ajustada por la cabecera fija */
                overflow-y-auto 
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-800
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-600
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-500
                scrollbar-width: thin
                scrollbar-color: #4B5563 #1F2937
              ` : ''}
            `}>
              <ul className="space-y-3">
                {filteredCategories.map((c) => (
                  <li 
                    key={c.name} 
                    className="flex items-center justify-between py-2 border-b border-gray-700 gap-20"
                  >
                    <div className="flex-1 truncate">{c.name}</div>
                    <div className="flex items-baseline gap-1 text-sm text-gray-400 whitespace-nowrap">
                      <span className="inline-block w-8 text-right font-mono">{c.count}</span>
                      <span>{c.count === 1 ? 'producto' : 'productos'}</span>
                    </div>
                  </li>
                ))}
                
                {filteredCategories.length === 0 && byCategory.length === 0 && (
                  <li className="text-gray-400">No hay categorías.</li>
                )}
                
                {filteredCategories.length === 0 && byCategory.length > 0 && (
                  <li className="text-gray-400">
                    No se encontraron categorías con "{query}"
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage