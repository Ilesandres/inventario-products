import Versions from './components/Versions'
import Layout from './components/Layout'
import ProductsPage from './pages/ProductsPage'

function App(): React.JSX.Element {
  return (
    <Layout>
      <ProductsPage />
    </Layout>
  )
}

export default App
