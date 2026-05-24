import { initializeApp } from 'firebase/app'
import { getAuth,GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID

}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)


export const googleProvider = new GoogleAuthProvider()
