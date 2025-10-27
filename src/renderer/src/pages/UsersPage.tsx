import React, { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { User } from '../types/User'
import { getAllUsers, createUser, updateUser, deleteUser } from '../services'

function UsersPage(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  const [query, setQuery] = useState('')

  const [editing, setEditing] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  async function load() {
    const us = await getAllUsers()
    setUsers(us)
  }

  useEffect(() => {
    load().catch((e) => console.error(e))
  }, [])

  const filtered = useMemo(() => {
    return users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  }, [users, query])

  function startCreate() {
    setIsCreating(true)
    setEditing(null)
  }

  function startEdit(u: User) {
    setEditing(u)
    setIsCreating(false)
  }

  async function handleDelete(u: User) {
    if (!confirm(`Eliminar usuario ${u.name}?`)) return
    try {
      await deleteUser(u.id)
      await load()
    } catch (err) {
      console.error(err)
      alert('Error al eliminar')
    }
  }

  async function onSave(payload: Omit<User, 'id' | 'createdAt'>) {
    try {
      if (isCreating) {
        await createUser(payload)
      } else if (editing) {
        await updateUser({ id: editing.id, createdAt: editing.createdAt, ...payload })
      }
      setIsCreating(false)
      setEditing(null)
      await load()
    } catch (err) {
      console.error(err)
      alert('Error al guardar')
    }
  }

  function handleCancel() {
    setIsCreating(false)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <div className="flex items-center space-x-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." className="max-w-xs" />
          <Button onClick={() => { setQuery('') }}>Limpiar</Button>
          <Button onClick={startCreate}>Nuevo</Button>
        </div>
      </div>

      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={handleCancel}></div>
          <div className="bg-gray-800 p-6 rounded shadow-lg z-10 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{isCreating ? 'Crear usuario' : 'Editar usuario'}</h3>
            <UserForm initial={editing ?? undefined} onCancel={handleCancel} onSave={onSave} />
          </div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-300">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Creado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-3 align-top">{u.name}</td>
                  <td className="px-4 py-3 align-top">{u.email}</td>
                  <td className="px-4 py-3 align-top">{u.role}</td>
                  <td className="px-4 py-3 align-top">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Button onClick={() => startEdit(u)}>Editar</Button>
                      <Button onClick={() => handleDelete(u)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-4 text-gray-400">No se encontraron usuarios.</div>}
        </div>
      </Card>
    </div>
  )
}

function UserForm({ initial, onCancel, onSave }: { initial?: User; onCancel: () => void; onSave: (p: Omit<User, 'id' | 'createdAt'>) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [role, setRole] = useState<User['role']>(initial?.role ?? 'user')

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      alert('Nombre y email son obligatorios')
      return
    }
    await onSave({ name: name.trim(), email: email.trim(), role })
  }

  return (
    <div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nombre</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value as User['role'])} className="bg-gray-700 px-3 py-2 rounded text-sm w-full">
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={onCancel} className="mr-2">Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </div>
    </div>
  )
}

export default UsersPage
