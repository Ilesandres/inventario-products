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
  const [products] = useAtom(productsAtom)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [categories] = useAtom(categoriesAtom)
  const [, triggerReload] = useAtom(reloadAtom)
  

  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await triggerReload()
      } catch (e) {
        console.error(e)
      }
    })()
  }, [triggerReload])

  function startCreate() {
    setIsCreating(true)
    setEditing(null)
  }

  function startEdit(p: Product) {
    setEditing(p)
    setIsCreating(false)
  }

  const [, createProduct] = useAtom(createProductAtom)
  const [, updateProduct] = useAtom(updateProductAtom)
  const [, deleteProduct] = useAtom(deleteProductAtom)

  async function handleDelete(p: Product) {
    if (!confirm(`Eliminar '${p.name}'?`)) return
    try {
      await deleteProduct(p.id)
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  async function onSaveProduct(payload: Omit<Product, 'id' | 'createdAt'>) {
    try {
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
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    }
  }

  function handleCancel() {
    setIsCreating(false)
    setEditing(null)
  }

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
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button onClick={() => { setQuery(''); setCategoryFilter('') }}>Limpiar</Button>
          <Button onClick={startCreate}>Nuevo</Button>
        </div>
      </div>

      {/* Create / Edit modal form */}
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
                      <div className="truncate">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">{p.category}</td>
                  <td className="px-4 py-3 align-top">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 align-top">{p.stock}</td>
                  <td className="px-4 py-3 align-top">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                      <Button onClick={() => startEdit(p)}>Editar</Button>
                      <Button onClick={() => handleDelete(p)}>Eliminar</Button>
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
