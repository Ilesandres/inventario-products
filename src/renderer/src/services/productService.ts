import { Product } from '../types/Product'

let products: Product[] = [
  {
    id: 'prod_1',
    name: 'Camiseta básica',
    category: 'Ropa',
    stock: 42,
    price: 12.99,
    image: '',
    createdAt: new Date(),
  },
  {
    id: 'prod_2',
    name: 'Auriculares inalámbricos',
    category: 'Electrónica',
    stock: 18,
    price: 59.99,
    image: '',
    createdAt: new Date(),
  },
  {
    id: 'prod_3',
    name: 'Mochila urbana',
    category: 'Accesorios',
    stock: 9,
    price: 34.5,
    image: '',
    createdAt: new Date(),
  },
]

function generateId() {
  return 'prod_' + Math.random().toString(36).slice(2, 9)
}

export async function getAllProducts(): Promise<Product[]> {
  return products.map((p) => ({ ...p }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = products.find((x) => x.id === id)
  return p ? { ...p } : null
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt'>,
): Promise<Product> {
  const now = new Date()
  const newProduct: Product = {
    id: generateId(),
    createdAt: now,
    ...product,
  }
  products.push(newProduct)
  return { ...newProduct }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  const idx = products.findIndex((p) => p.id === product.id)
  if (idx === -1) return null
  const updated: Product = {
    ...products[idx],
    ...product,
  }
  products[idx] = updated
  return { ...updated }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return false
  products.splice(idx, 1)
  return true
}

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

export default productService
