import Layout from './components/Layout'
import ProductsPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage'
import React, { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '#/products')

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash || '#/products')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let Page: React.ReactNode = null
  if (route.startsWith('#/dashboard')) Page = <DashboardPage />
  else Page = <ProductsPage />

  return (
    <Layout>
      {Page}
    </Layout>
  )
}

export default App
