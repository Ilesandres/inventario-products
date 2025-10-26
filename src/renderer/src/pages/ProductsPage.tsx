import React, { useEffect, useMemo, useState } from 'react'
import { getAllProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services'
import { Product } from '../types/Product'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function ProductsPage(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [categories, setCategories] = useState<string[]>([])
  

  // UI state for create / edit
  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<Partial<Product>>({})

  // Load products and categories
  async function loadData() {
    const [ps, cs] = await Promise.all([getAllProducts(), getCategories()])
    setProducts(ps)
    setCategories(cs)
  }

  useEffect(() => {
    loadData().catch((e) => console.error(e))
  }, [])

  function startCreate() {
    setIsCreating(true)
    setEditing(null)
    setForm({})
  }

  function startEdit(p: Product) {
    setEditing(p)
    setIsCreating(false)
    setForm({ ...p })
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Eliminar '${p.name}'?`)) return
    try {
      await deleteProduct(p.id)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  async function handleSave() {
    if (!form.name || !form.category) {
      alert('Nombre y categoría requeridos')
      return
    }
    try {
      if (isCreating) {
        await createProduct({
          name: form.name!,
          category: form.category!,
          price: form.price ?? 0,
          stock: form.stock ?? 0,
          image: form.image,
        })
      } else if (editing) {
        await updateProduct({
          id: editing.id,
          createdAt: editing.createdAt,
          name: form.name ?? editing.name,
          category: form.category ?? editing.category,
          price: form.price ?? editing.price,
          stock: form.stock ?? editing.stock,
          image: form.image ?? editing.image,
        })
      }
      setIsCreating(false)
      setEditing(null)
      setForm({})
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    }
  }

  function handleCancel() {
    setIsCreating(false)
    setEditing(null)
    setForm({})
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

      {/* Create / Edit form */}
      {(isCreating || editing) && (
        <Card>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-300">Nombre</label>
              <Input
                value={form.name ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Categoría</label>
              <Input
                value={form.category ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Precio</label>
              <Input
                type="number"
                step="0.01"
                value={form.price ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, price: parseFloat(e.target.value || '0') }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Stock</label>
              <Input
                type="number"
                value={form.stock ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, stock: parseInt(e.target.value || '0') }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Imagen (URL)</label>
              <Input
                value={form.image ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Guardar</Button>
              <Button onClick={handleCancel}>Cancelar</Button>
            </div>
          </div>
        </Card>
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
