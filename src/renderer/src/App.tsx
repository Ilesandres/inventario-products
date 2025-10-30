// src/App.tsx
import React, { useEffect, useState } from 'react'
import Layout from './components/Layout'
import ProductsPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import CategoriesPage from './pages/CategoriesPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { ROUTES, getRouteFromHash } from './routes/appRoutes'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App(): React.JSX.Element {
  const [route, setRoute] = useState<string>(getRouteFromHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(getRouteFromHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let Page: React.ReactNode = null

  switch (true) {
    case route.startsWith(ROUTES.LOGIN):
      Page = <LoginPage />
      break
    case route.startsWith(ROUTES.REGISTER):
      Page = <RegisterPage />
      break
    case route.startsWith(ROUTES.DASHBOARD):
      Page = (
        <ProtectedRoute requiredRole="admin">
          <DashboardPage />
        </ProtectedRoute>
      )
      break
    case route.startsWith(ROUTES.USERS):
      Page = (
        <ProtectedRoute requiredRole="admin">
          <UsersPage />
        </ProtectedRoute>
      )
      break
    case route.startsWith(ROUTES.CATEGORIES):
      Page = (
        <ProtectedRoute>
          <CategoriesPage />
        </ProtectedRoute>
      )
      break
    case route.startsWith(ROUTES.SETTINGS):
      Page = (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      )
      break
    default:
      Page = (
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      )
  }

  return (
    <AuthProvider>
      <AppProvider>
        {route.startsWith(ROUTES.LOGIN) || route.startsWith(ROUTES.REGISTER) ? (
          // No mostramos el layout para login/register
          Page
        ) : (
          <Layout>{Page}</Layout>
        )}
      </AppProvider>
    </AuthProvider>
  )
}

export default App
