import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  OAuthProvider,
  signInWithPopup,
  type AuthError,
} from 'firebase/auth'
import { auth } from '@/firebase'

export class AuthService {
  async registerWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (err) {
      const error = err as AuthError
      return { user: null, error: error.message }
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (err) {
      const error = err as AuthError
      return { user: null, error: error.message }
    }
  }

  async loginWithMicrosoft() {
    try {
      const provider = new OAuthProvider('microsoft.com')
      provider.addScope('User.Read')
      provider.setCustomParameters({
        tenant: (import.meta.env.VITE_MICROSOFT_TENANT_ID as string) || 'common',
      })

      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (err) {
      const error = err as AuthError
      return { user: null, error: error.message }
    }
  }

  async logout() {
    try {
      await signOut(auth)
      return { error: null }
    } catch (err) {
      const error = err as AuthError
      return { error: error.message }
    }
  }
}

export const authService = new AuthService()
