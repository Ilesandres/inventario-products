import React, { useEffect, useRef, useState } from 'react'
import { FiArchive, FiTag, FiUsers, FiSettings, FiMenu, FiChevronDown, FiUser, FiLogOut, FiBarChart2 } from 'react-icons/fi'
import ROUTES from '../routes/appRoutes'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { user, logout } = useContext(AuthContext)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node
      if (profileOpen) {
        if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
          setProfileOpen(false)
        }
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [profileOpen])

  const asideWidth = collapsed ? 'w-20' : 'w-64'

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className={`${asideWidth} fixed left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-700 p-4 transition-all duration-200 z-20 overflow-hidden flex flex-col`}> 
        <div className={`mb-6 px-2 transition-opacity duration-200 ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <h1 className="text-xl font-bold">Inventario</h1>
          <p className="text-sm text-gray-400">Panel de administración</p>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href={ROUTES.PRODUCTS} title="Productos">
                <FiArchive className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Productos</span>
              </a>
            </li>
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href={ROUTES.CATEGORIES} title="Categorías">
                <FiTag className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Categorías</span>
              </a>
            </li>
            {user?.role === 'admin' && (
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href={ROUTES.USERS} title="Usuarios">
                <FiUsers className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Usuarios</span>
              </a>
            </li>
            )}
            {user?.role === 'admin' && (
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href={ROUTES.DASHBOARD} title="Dashboard">
                <FiBarChart2 className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Dashboard</span>
              </a>
            </li>
            )}
            <li>
              <a className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`} href={ROUTES.SETTINGS} title="Ajustes">
                <FiSettings className={`text-gray-300 ${collapsed ? 'text-2xl' : 'text-xl'}`} />
                <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Ajustes</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <header
          className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-10 transition-all duration-200"
          style={{ left: collapsed ? '5rem' : '16rem' }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-expanded={!collapsed}
              className="p-2 rounded-md hover:bg-gray-800"
              title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <FiMenu className="text-gray-100 text-xl" />
            </button>
          </div>

          <div className="flex items-center space-x-3 relative">
            <div className="text-sm text-gray-300">{user?.name || 'Usuario'}</div>
            <button
              ref={buttonRef}
              onClick={() => setProfileOpen((s) => !s)}
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm relative focus:outline-none ring-0"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              title="Perfil"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              <FiChevronDown className="ml-1 text-gray-300 text-xs z-10" />
            </button>

            {profileOpen && (
              <div ref={menuRef} className="absolute right-0 top-full mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-40">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                  <FiUser /> Perfil
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                  <FiSettings /> Ajustes
                </button>
                <div className="border-t border-gray-700" />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => {
                    logout()
                    setProfileOpen(false)
                  }}
                >
                  <FiLogOut /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 mt-16 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default Layout