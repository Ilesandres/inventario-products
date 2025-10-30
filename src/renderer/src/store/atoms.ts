import { atom } from 'jotai'
import { getAllProducts, createProduct as svcCreate, updateProduct as svcUpdate, deleteProduct as svcDelete } from '../services/productService'
import type { Product } from '../types/Product'

export const productsAtom = atom<Product[]>([])
export const categoriesAtom = atom<string[]>([])

// Función helper para actualizar productos y categorías
const updateProductsAndCategories = async (set: any) => {
  try {

    const ps = await getAllProducts()

    set(productsAtom, ps)
    const cats = Array.from(new Set(ps.map((p) => p.category))).filter(Boolean)
  
    set(categoriesAtom, cats)
  } catch (error) {
    console.error(' Error en updateProductsAndCategories:', error)
    throw error
  }
}

// Reload atom - CORREGIDO
export const reloadAtom = atom(null, async (get, set) => {

  await updateProductsAndCategories(set)
})

export const createProductAtom = atom(null, async (get, set, payload: Omit<Product, 'id' | 'createdAt'>) => {

  try {
    await svcCreate(payload)
   
    await updateProductsAndCategories(set)
  } catch (error) {
    console.error(' Error en createProductAtom:', error)
    throw error
  }
})

export const updateProductAtom = atom(null, async (get, set, payload: Product) => {

  try {
    await svcUpdate(payload)
  
    await updateProductsAndCategories(set)
  } catch (error) {
    
    throw error
  }
})

export const deleteProductAtom = atom(null, async (get, set, id: string) => {
  console.log('🎯 Ejecutando deleteProductAtom...')
  try {
    await svcDelete(id)
    await updateProductsAndCategories(set)
  } catch (error) {
    
    throw error
  }
})