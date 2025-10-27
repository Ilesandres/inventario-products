// Firebase initialization for renderer (Vite + React)
// Reads config from import.meta.env (VITE_ prefixed variables)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Note: VITE_ variables are injected by Vite and available via import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
}

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig)

// Core SDKs
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// Analytics may not be available in some contexts (SSR/test); guard it
let analytics: ReturnType<typeof getAnalytics> | null = null
try {
  // getAnalytics will throw if not supported, so wrap in try/catch
  analytics = getAnalytics(firebaseApp)
} catch (err) {
  // ignore: analytics not available in this environment
  analytics = null
}

export { firebaseApp, auth, db, storage, analytics }
export default firebaseApp
