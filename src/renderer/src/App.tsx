import Layout from './components/Layout'
import ProductsPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import CategoriesPage from './pages/CategoriesPage'
import SettingsPage from './pages/SettingsPage'
import { ROUTES, getRouteFromHash } from './routes/appRoutes'
import React, { useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'

function App(): React.JSX.Element {
  const [route, setRoute] = useState<string>(getRouteFromHash(window.location.hash))

  useEffect(() => {
    function onHash() {
      setRoute(getRouteFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let Page: React.ReactNode = null
  if (route.startsWith(ROUTES.DASHBOARD)) Page = <DashboardPage />
  else if (route.startsWith(ROUTES.USERS)) Page = <UsersPage />
  else if (route.startsWith(ROUTES.CATEGORIES)) Page = <CategoriesPage />
  else if (route.startsWith(ROUTES.SETTINGS)) Page = <SettingsPage />
  else Page = <ProductsPage />

  return (
    <AppProvider>
      <Layout>
        {Page}
      </Layout>
    </AppProvider>
  )
}

export default App
