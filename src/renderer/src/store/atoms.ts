import { atom } from 'jotai'
import { getAllProducts, createProduct as svcCreate, updateProduct as svcUpdate, deleteProduct as svcDelete } from '../services/productService'
import type { Product } from '../types/Product'

export const productsAtom = atom<Product[]>([])
export const categoriesAtom = atom<string[]>([])

// Función helper para actualizar productos y categorías
const updateProductsAndCategories = async (set: any) => {
  try {
    console.log('🔄 Actualizando productos y categorías...')
    const ps = await getAllProducts()
    console.log('📦 Productos obtenidos:', ps.length)
    set(productsAtom, ps)
    const cats = Array.from(new Set(ps.map((p) => p.category))).filter(Boolean)
    console.log('🏷️ Categorías encontradas:', cats)
    set(categoriesAtom, cats)
  } catch (error) {
    console.error('❌ Error en updateProductsAndCategories:', error)
    throw error
  }
}

// Reload atom - CORREGIDO
export const reloadAtom = atom(null, async (get, set) => {
  console.log('🎯 Ejecutando reloadAtom...')
  await updateProductsAndCategories(set)
})

export const createProductAtom = atom(null, async (get, set, payload: Omit<Product, 'id' | 'createdAt'>) => {
  console.log('🎯 Ejecutando createProductAtom...')
  try {
    await svcCreate(payload)
    console.log('✅ Producto creado, actualizando lista...')
    await updateProductsAndCategories(set)
  } catch (error) {
    console.error('❌ Error en createProductAtom:', error)
    throw error
  }
})

export const updateProductAtom = atom(null, async (get, set, payload: Product) => {
  console.log('🎯 Ejecutando updateProductAtom...')
  try {
    await svcUpdate(payload)
    console.log('✅ Producto actualizado, actualizando lista...')
    await updateProductsAndCategories(set)
  } catch (error) {
    console.error('❌ Error en updateProductAtom:', error)
    throw error
  }
})

export const deleteProductAtom = atom(null, async (get, set, id: string) => {
  console.log('🎯 Ejecutando deleteProductAtom...')
  try {
    await svcDelete(id)
    console.log('✅ Producto eliminado, actualizando lista...')
    await updateProductsAndCategories(set)
  } catch (error) {
    console.error('❌ Error en deleteProductAtom:', error)
    throw error
  }
})