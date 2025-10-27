import React, { useEffect, useState } from 'react'
import { Product } from '../types/Product'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

type Props = {
  initial?: Partial<Product>
  categories: string[]
  onCancel: () => void
  onSave: (payload: Omit<Product, 'id' | 'createdAt'>) => Promise<void> | void
}

function ProductForm({ initial, categories, onCancel, onSave }: Props): React.JSX.Element {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [price, setPrice] = useState<number | ''>(initial?.price ?? '')
  const [stock, setStock] = useState<number | ''>(initial?.stock ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null)

  useEffect(() => {
    let url: string | undefined
    if (file) {
      url = URL.createObjectURL(file)
      setPreview(url)
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [file])

  async function handleSubmit() {
    if (!name || !category) {
      alert('Nombre y categoría son requeridos')
      return
    }

    const payload: Omit<Product, 'id' | 'createdAt'> = {
      name,
      category,
      price: typeof price === 'number' ? price : Number(price || 0),
      stock: typeof stock === 'number' ? stock : Number(stock || 0),
      image: preview ?? undefined,
    }

    await onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-3xl px-4">
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="mb-2 text-sm text-gray-300">Nombre</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />

              <div className="mt-3 mb-2 text-sm text-gray-300">Categoría</div>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} list="categories-list" />
                <datalist id="categories-list">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-2 text-sm text-gray-300">Precio</div>
                  <Input type="number" step="0.01" value={price ?? ''} onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                </div>
                <div>
                  <div className="mb-2 text-sm text-gray-300">Stock</div>
                  <Input type="number" value={stock ?? ''} onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value || '0'))} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-gray-300">Imagen</div>
              {preview && <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded mb-2" />}
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-300" />
              <div className="mt-3">
                <Button onClick={handleSubmit} className="mr-2">Guardar</Button>
                <Button onClick={onCancel}>Cancelar</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProductForm
