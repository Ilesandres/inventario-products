import React, { useEffect, useMemo, useState } from 'react'
import { getAllProducts } from '../services'
import CardMetric from '../components/CardMetric'
import Card from '../components/ui/Card'

// Recharts used for a simple pie chart
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

function DashboardPage(): React.JSX.Element {
  const [products, setProducts] = useState([] as any[])

  useEffect(() => {
    let mounted = true
    getAllProducts().then((ps) => {
      if (mounted) setProducts(ps)
    })
    return () => {
      mounted = false
    }
  }, [])

  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.stock <= 10).length
  const totalValue = products.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0)

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach((p) => {
      const c = p.category || 'Sin categoría'
      map.set(c, (map.get(c) || 0) + (p.stock || 0))
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [products])

  const colors = ['#ffd66b', '#7dd3fc', '#60a5fa', '#fca5a5', '#86efac']

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardMetric title="Total de productos" value={totalProducts} />
        <CardMetric title="Items con stock bajo (<=10)" value={lowStockCount} />
        <CardMetric title="Valor total inventario" value={`$${totalValue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm text-gray-400 mb-3">Stock por categoría</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={80} label>
                  {byCategory.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-400 mb-3">Últimos productos</div>
          <ul className="space-y-2">
            {products.slice(-5).reverse().map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image ?? `https://picsum.photos/seed/${p.id}/48/48`} alt="thumb" className="w-10 h-10 object-cover rounded" />
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.category} • ${p.price?.toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
