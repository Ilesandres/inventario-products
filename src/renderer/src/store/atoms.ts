import { atom } from 'jotai'
import { getAllProducts, createProduct as svcCreate, updateProduct as svcUpdate, deleteProduct as svcDelete } from '../services'
import type { Product } from '../types/Product'

export const productsAtom = atom<Product[]>([])
export const categoriesAtom = atom<string[]>([])

// Reload atom - write-only: calling set(reloadAtom, undefined) will refresh products & categories
export const reloadAtom = atom(null, async (_get, set) => {
  const ps = await getAllProducts()
  set(productsAtom, ps)
  const cats = Array.from(new Set(ps.map((p) => p.category)))
  set(categoriesAtom, cats)
})

export const createProductAtom = atom(null, async (_get, set, payload: Omit<Product, 'id' | 'createdAt'>) => {
  await svcCreate(payload)
  // refresh by fetching latest products
  const ps = await getAllProducts()
  set(productsAtom, ps)
  const cats = Array.from(new Set(ps.map((p) => p.category)))
  set(categoriesAtom, cats)
})

export const updateProductAtom = atom(null, async (_get, set, payload: Product) => {
  await svcUpdate(payload)
  const ps = await getAllProducts()
  set(productsAtom, ps)
  const cats = Array.from(new Set(ps.map((p) => p.category)))
  set(categoriesAtom, cats)
})

export const deleteProductAtom = atom(null, async (_get, set, id: string) => {
  await svcDelete(id)
  const ps = await getAllProducts()
  set(productsAtom, ps)
  const cats = Array.from(new Set(ps.map((p) => p.category)))
  set(categoriesAtom, cats)
})
