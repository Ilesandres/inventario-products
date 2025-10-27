import React from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAppContext } from '../context/AppContext'

function SettingsPage(): React.JSX.Element {
  const { dark, toggleDark, user, login, logout } = useAppContext()

  function handleFakeLogin() {
    // simulate a login
    login({ id: 'user_1', name: 'Andrés', email: 'andres@example.com', role: 'admin' })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ajustes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-sm text-gray-400 mb-3">Tema</div>
          <div className="flex items-center justify-between">
            <div>Modo oscuro</div>
            <Button onClick={toggleDark}>{dark ? 'Desactivar' : 'Activar'}</Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-400 mb-3">Cuenta</div>
          <div className="space-y-2">
            {user ? (
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className="mt-3">
                  <Button onClick={logout}>Cerrar sesión</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-gray-300">No hay usuario autenticado (mock).</div>
                <div className="mt-3">
                  <Button onClick={handleFakeLogin}>Iniciar sesión (mock)</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
