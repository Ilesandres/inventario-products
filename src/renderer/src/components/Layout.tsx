import React from 'react'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props): React.JSX.Element {
  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <div className="mb-6 px-2">
          <h1 className="text-xl font-bold">Inventario</h1>
          <p className="text-sm text-gray-400">Panel de administración</p>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a className="block px-3 py-2 rounded hover:bg-gray-700" href="#">
                Productos
              </a>
            </li>
            <li>
              <a className="block px-3 py-2 rounded hover:bg-gray-700" href="#">
                Categorías
              </a>
            </li>
            <li>
              <a className="block px-3 py-2 rounded hover:bg-gray-700" href="#">
                Usuarios
              </a>
            </li>
            <li>
              <a className="block px-3 py-2 rounded hover:bg-gray-700" href="#">
                Ajustes
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-800">☰</button>
            <div className="relative">
              <input
                className="bg-gray-800 text-sm placeholder-gray-400 rounded px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar productos..."
                aria-label="Buscar"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-300">Andrés</div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default Layout
