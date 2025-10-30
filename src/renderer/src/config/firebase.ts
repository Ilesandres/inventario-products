// Firebase initialization for renderer (Vite + React)
// Reads config from import.meta.env (VITE_ prefixed variables)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)


let analytics: ReturnType<typeof getAnalytics> | null = null
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp)
      console.log('Firebase Analytics habilitado')
    } else {
      console.log('Firebase Analytics no soportado en este entorno')
    }
  })
  .catch(() => {
    analytics = null
  })



export { firebaseApp, auth, db, storage, analytics }
export default firebaseApp
