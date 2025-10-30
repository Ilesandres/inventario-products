import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { User } from '../types/User'
import { signOut } from 'firebase/auth'

export async function registerUser(name: string, email: string, password: string, role: 'admin' | 'user' = 'user') {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await updateProfile(user, { displayName: name })

  const newUser: User = {
    id: user.uid,
    name,
    email,
    role,
    createdAt: new Date()
  }

  await setDoc(doc(db, 'users', user.uid), {
    ...newUser,
    createdAt: serverTimestamp()
  })

  return newUser
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  const docRef = doc(db, 'users', user.uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as User
  } else {
    console.warn('Usuario no encontrado en Firestore')
    return null
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}