import { auth, db } from '../config/firebase'
import React, { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export interface User {
  id: string
  name: string
  email: string
  role?: 'admin' | 'user'
  createdAt?: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
        setUser({
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: userData.role || 'user',
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      window.location.hash = '#/login'
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}