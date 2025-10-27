import { User } from '../types/User'

let users: User[] = [
  { id: 'user_1', name: 'Andrés', email: 'andres@example.com', role: 'admin', createdAt: new Date() },
  { id: 'user_2', name: 'María', email: 'maria@example.com', role: 'user', createdAt: new Date() },
  { id: 'user_3', name: 'Carlos', email: 'carlos@example.com', role: 'user', createdAt: new Date() },
]

function generateId() {
  return 'user_' + Math.random().toString(36).slice(2, 9)
}

export async function getAllUsers(): Promise<User[]> {
  return users.map((u) => ({ ...u }))
}

export async function getUserById(id: string): Promise<User | null> {
  const u = users.find((x) => x.id === id)
  return u ? { ...u } : null
}

export async function createUser(payload: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const now = new Date()
  const newUser: User = { id: generateId(), createdAt: now, ...payload }
  users.push(newUser)
  return { ...newUser }
}

export async function updateUser(user: User): Promise<User | null> {
  const idx = users.findIndex((u) => u.id === user.id)
  if (idx === -1) return null
  const updated = { ...users[idx], ...user }
  users[idx] = updated
  return { ...updated }
}

export async function deleteUser(id: string): Promise<boolean> {
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users.splice(idx, 1)
  return true
}

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

export default userService
