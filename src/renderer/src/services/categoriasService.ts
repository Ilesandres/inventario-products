import { getAllProducts } from './productService'
import { Product } from '../types/Product'

export async function getCategories(): Promise<string[]> {
  // Read products from the product service to keep source-of-truth there
  const products: Product[] = await getAllProducts()
  const s = new Set<string>()
  products.forEach((p) => s.add(p.category))
  return Array.from(s)
}

const categoriasService = {
  getCategories,
}

export default categoriasService
