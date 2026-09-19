/**
 * Firebase client configuration.
 *
 * These values are frontend-safe (public) config — they identify your app to
 * the Firebase service. NEVER put service-account / private Admin SDK keys here.
 *
 * Add values via a local .env file (see .env.example):
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=...
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_STORAGE_BUCKET=...
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *   VITE_FIREBASE_APP_ID=...
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

let _app = null
let _auth = null
let _db = null
let _storage = null

/** Lazily initialises Firebase (only called when configured). */
export async function initFirebase() {
  if (_app) return _app
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. See src/config/firebase.js and .env.example.')
  }
  const { initializeApp } = await import('firebase/app')
  _app = initializeApp(firebaseConfig)
  return _app
}

export async function getAuth() {
  if (_auth) return _auth
  const app = await initFirebase()
  const { getAuth: ga } = await import('firebase/auth')
  _auth = ga(app)
  return _auth
}

export async function getFirestore() {
  if (_db) return _db
  const app = await initFirebase()
  const { getFirestore: gf } = await import('firebase/firestore')
  _db = gf(app)
  return _db
}

export async function getStorage() {
  if (_storage) return _storage
  const app = await initFirebase()
  const { getStorage: gs } = await import('firebase/storage')
  _storage = gs(app)
  return _storage
}