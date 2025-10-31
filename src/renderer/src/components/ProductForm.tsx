import React, { useEffect, useState } from 'react'
import { Product } from '../types/Product'
import { uploadImage } from '../services/productService'
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
  const [preview, setPreview] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(initial?.image ?? null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (file) {
      console.log('Procesando archivo:', file.name)
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          console.log('Preview creado con FileReader')
          setPreview(result)
        }
        reader.onerror = (error) => {
          console.error('Error leyendo archivo:', error)
          setPreview(null)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error creating preview:', error)
        setPreview(null)
      }
    } else {
      setPreview(null)
    }
  }, [file])

  // Mantener imagen existente cuando no hay archivo nuevo
  useEffect(() => {
    if (initial?.image && !file) {
      setExistingImage(initial.image)
    }
  }, [initial?.image, file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    console.log('Archivo seleccionado:', selectedFile?.name)
    
    if (selectedFile) {
      // Validaciones
      if (!selectedFile.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido')
        e.target.value = ''
        return
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB permitido.')
        e.target.value = '' 
        return
      }
      
      setFile(selectedFile)
      // Limpiar imagen existente cuando se selecciona nueva
      setExistingImage(null)
    } else {
      setFile(null)
    }
  }

  const clearImage = () => {
    console.log('Limpiando imagen')
    setFile(null)
    setPreview(null)
    setExistingImage(initial?.image ?? null)
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  async function handleSubmit() {
    if (!name || !category) {
      alert('Nombre y categoría son requeridos')
      return
    }

    setLoading(true)

    try {
      let imageUrl = existingImage || ''

      // Subir nueva imagen si se seleccionó un archivo
      if (file) {
        console.log('Subiendo imagen a Storage...')
        imageUrl = await uploadImage(file)
        console.log('Imagen subida:', imageUrl)
      }

      const payload: Omit<Product, 'id' | 'createdAt'> = {
        name,
        category,
        price: typeof price === 'number' ? price : Number(price || 0),
        stock: typeof stock === 'number' ? stock : Number(stock || 0),
        image: imageUrl || undefined,
      }

      console.log('Guardando producto...')
      await onSave(payload)
      onCancel()
      
    } catch (error: any) {
      console.error('Error guardando producto:', error)
      alert('Error al guardar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  
  const displayImage = preview || existingImage

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-3xl px-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {initial?.id ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Nombre *</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del producto"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">Categoría *</label>
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  list="categories-list"
                  placeholder="Selecciona o escribe una categoría"
                  disabled={loading}
                />
                <datalist id="categories-list">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Precio</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={price ?? ''} 
                    onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Stock</label>
                  <Input 
                    type="number" 
                    min="0"
                    value={stock ?? ''} 
                    onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value || '0'))}
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Imagen</label>
                
                {/* Vista previa de imagen */}
                {displayImage ? (
                  <div className="relative mb-3">
                    <img 
                      src={displayImage} 
                      alt="Vista previa" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                      title="Eliminar imagen"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400 mb-3">
                    Sin imagen
                  </div>
                )}
                
                {/* Input de archivo */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                  disabled={loading}
                />
                
                <div className="text-xs text-gray-400 mt-1">
                  Formatos: JPG, PNG, GIF, WEBP. Máx: 5MB
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (initial?.id ? 'Actualizar' : 'Crear')} Producto
                </Button>
                <Button 
                  onClick={onCancel} 
                  variant="outline"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProductForm