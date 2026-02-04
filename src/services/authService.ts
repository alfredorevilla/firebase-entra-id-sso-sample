import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  OAuthProvider,
  signInWithPopup,
  linkWithCredential,
  type AuthError,
  type OAuthCredential,
  isSignInWithEmailLink,
  getRedirectResult,
} from 'firebase/auth'
import { auth } from '@/firebase'
import type { PendingCredential } from '@/types/auth'

const PENDING_CREDENTIAL_KEY = 'firebase_pending_credential'

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
      const credential = result.user.metadata || null
      return { user: result.user, error: null, credential }
    } catch (err) {
      const error = err as AuthError

      // Handle account already exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = (error as any).customData?.email
        if (email) {
          this.savePendingCredential({
            provider: 'microsoft.com',
            email: email,
          }, null)
        }
      }

      return { user: null, error: error.message, credential: null }
    }
  }

  private savePendingCredential(metadata: PendingCredential, credential: OAuthCredential | null) {
    try {
      const credentialJson = JSON.stringify({
        ...metadata,
        credentialData: credential ? {
          providerId: credential.providerId,
          signInMethod: credential.signInMethod,
          accessToken: (credential as any).accessToken,
          idToken: (credential as any).idToken,
        } : null,
      })
      sessionStorage.setItem(PENDING_CREDENTIAL_KEY, credentialJson)
    } catch (err) {
      console.error('Failed to save pending credential:', err)
    }
  }

  getPendingCredential(): { metadata: PendingCredential; credential: OAuthCredential } | null {
    try {
      const stored = sessionStorage.getItem(PENDING_CREDENTIAL_KEY)
      if (!stored) return null

      const parsed = JSON.parse(stored)
      // Note: In production, credential reconstruction would need Firebase SDK support
      return { metadata: parsed, credential: parsed.credential }
    } catch (err) {
      console.error('Failed to restore pending credential:', err)
      return null
    }
  }

  clearPendingCredential() {
    sessionStorage.removeItem(PENDING_CREDENTIAL_KEY)
  }

  async logout() {
    try {
      this.clearPendingCredential()
      await signOut(auth)
      return { error: null }
    } catch (err) {
      const error = err as AuthError
      return { error: error.message }
    }
  }
}

export const authService = new AuthService()
