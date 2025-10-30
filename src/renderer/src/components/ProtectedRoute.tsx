import React from 'react'
import { useAuth } from '../context/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!user) {
    return <div>No estás autenticado. Por favor inicia sesión.</div>
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>No tienes permisos para acceder a esta sección.</div>
  }

  return <>{children}</>
}

export default ProtectedRoute
