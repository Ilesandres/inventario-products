import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import type { Product } from '../types/Product'
import {
  productsAtom,
  categoriesAtom,
  reloadAtom,
  createProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from '../store/atoms'

type User = {
  id: string
  name: string
  email?: string
  role?: string
} | null

interface AppContextValue {
  user: User
  setUser: (u: User) => void
  login: (u: User) => void
  logout: () => void
  dark: boolean
  toggleDark: () => void
  products: Product[]
  categories: string[]
  refreshProducts: () => Promise<void>
  createProduct: (payload: Omit<Product, 'id' | 'createdAt'>) => Promise<void>
  updateProduct: (p: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch {
      return false
    }
  })

  const [products] = useAtom(productsAtom)
  const [categories] = useAtom(categoriesAtom)
  const [, triggerReload] = useAtom(reloadAtom)
  const [, atomCreate] = useAtom(createProductAtom)
  const [, atomUpdate] = useAtom(updateProductAtom)
  const [, atomDelete] = useAtom(deleteProductAtom)

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {}
  }, [dark])

  const toggleDark = () => setDark((d) => !d)
  const login = (u: User) => setUser(u)
  const logout = () => setUser(null)

  const refreshProducts = async () => {
    await triggerReload()
  }

  const createProduct = async (payload: Omit<Product, 'id' | 'createdAt'>) => {
    await atomCreate(payload)
  }

  const updateProduct = async (p: Product) => {
    await atomUpdate(p)
  }

  const deleteProduct = async (id: string) => {
    await atomDelete(id)
  }

  const value: AppContextValue = {
    user,
    setUser,
    login,
    logout,
    dark,
    toggleDark,
    products,
    categories,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export default AppContext
