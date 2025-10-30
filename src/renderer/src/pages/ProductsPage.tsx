import React, { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
  productsAtom,
  categoriesAtom,
  reloadAtom,
  createProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from '../store/atoms'
import { Product } from '../types/Product'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ProductForm from '../components/ProductForm'

function ProductsPage(): React.JSX.Element {
  const [products, setProducts] = useAtom(productsAtom) // Cambiado para poder forzar update
  const [categories] = useAtom(categoriesAtom)
  const [, triggerReload] = useAtom(reloadAtom)
  const [, createProduct] = useAtom(createProductAtom)
  const [, updateProduct] = useAtom(updateProductAtom)
  const [, deleteProduct] = useAtom(deleteProductAtom)
  
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)

  // Cargar productos al montar el componente
  useEffect(() => {
    console.log('🔌 ProductsPage montado, cargando productos...')
    loadProducts()
  }, [])

  // Función para cargar productos
  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('🔄 Iniciando carga de productos...')
      await triggerReload()
      console.log('✅ Carga completada. Productos en estado:', products.length)
    } catch (error) {
      console.error('❌ Error cargando productos:', error)
      alert('Error al cargar productos: ' + error)
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setIsCreating(true)
    setEditing(null)
  }

  function startEdit(p: Product) {
    setEditing(p)
    setIsCreating(false)
  }

  async function handleDelete(p: Product) {
    if (!confirm(`¿Eliminar '${p.name}'?`)) return
    try {
      console.log('🗑️ Eliminando producto:', p.id)
      await deleteProduct(p.id)
      // No necesitamos llamar loadProducts() porque el atom ya lo hace
    } catch (err: any) {
      console.error('❌ Error eliminando:', err)
      alert('Error al eliminar: ' + err.message)
    }
  }

  async function onSaveProduct(payload: Omit<Product, 'id' | 'createdAt'>) {
    try {
      console.log('💾 Guardando producto...')
      
      if (isCreating) {
        await createProduct(payload)
      } else if (editing) {
        await updateProduct({
          id: editing.id,
          createdAt: editing.createdAt,
          ...payload,
        })
      }
      
      setIsCreating(false)
      setEditing(null)
      // No necesitamos llamar loadProducts() porque el atom ya lo hace
    } catch (err: any) {
      console.error('❌ Error guardando:', err)
      alert('Error al guardar: ' + err.message)
    }
  }

  function handleCancel() {
    setIsCreating(false)
    setEditing(null)
  }

  const filtered = useMemo(() => {
    console.log('🔍 Filtrando productos. Total:', products.length)
    return products.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [products, query, categoryFilter])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Productos 
          {loading && ' (Cargando...)'}
          {!loading && ` (${products.length})`}
        </h2>
        <div className="flex items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="max-w-xs"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button onClick={() => { setQuery(''); setCategoryFilter('') }}>
            Limpiar
          </Button>
          <Button onClick={loadProducts} disabled={loading}>
             Recargar
          </Button>
          <Button onClick={startCreate} disabled={loading}>
             Nuevo
          </Button>
        </div>
      </div>

      {(isCreating || editing) && (
        <ProductForm
          initial={editing ?? undefined}
          categories={categories}
          onCancel={handleCancel}
          onSave={onSaveProduct}
        />
      )}

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
                      <div>
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">{p.category}</td>
                  <td className="px-4 py-3 align-top">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 align-top">{p.stock}</td>
                  <td className="px-4 py-3 align-top">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Button onClick={() => startEdit(p)} size="sm">
                        Editar
                      </Button>
                      <Button onClick={() => handleDelete(p)} size="sm" variant="danger">
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading && (
            <div className="p-8 text-center text-gray-400">
              Cargando productos...
            </div>
          )}
          
          {!loading && filtered.length === 0 && products.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No hay productos. ¡Crea el primero!
            </div>
          )}
          
          {!loading && filtered.length === 0 && products.length > 0 && (
            <div className="p-8 text-center text-gray-400">
              No se encontraron productos con los filtros aplicados.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ProductsPage