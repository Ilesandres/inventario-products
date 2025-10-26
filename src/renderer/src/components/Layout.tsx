import React, { useState } from 'react'
import { FiArchive, FiTag, FiUsers, FiSettings, FiMenu } from 'react-icons/fi'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false)

  const asideWidth = collapsed ? 'w-20' : 'w-64'
  const mainMargin = collapsed ? 'ml-20' : 'ml-4'

  return (
     <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar (fixed) */}
      <aside className={`${asideWidth} fixed left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-700 p-4 transition-all duration-200 z-20 overflow-hidden flex flex-col`}> 
        <div className={`mb-6 px-2 transition-opacity duration-200 ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <h1 className="text-xl font-bold">Inventario</h1>
          <p className="text-sm text-gray-400">Panel de administración</p>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href="#" title="Productos">
                <FiArchive className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Productos</span>
              </a>
            </li>
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href="#" title="Categorías">
                <FiTag className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Categorías</span>
              </a>
            </li>
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href="#" title="Usuarios">
                <FiUsers className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Usuarios</span>
              </a>
            </li>
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href="#" title="Ajustes">
                <FiSettings className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Ajustes</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-10 transition-all duration-200" style={{ left: collapsed ? '5rem' : '16rem' }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-expanded={!collapsed}
              className="p-2 rounded-md hover:bg-gray-800"
              title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <FiMenu className="text-gray-100 text-xl" />
            </button>
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
        <main className="flex-1 p-6 mt-16 overflow-auto"> 
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout