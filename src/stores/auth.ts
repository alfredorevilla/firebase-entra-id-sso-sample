import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthState, type UserProfile } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>(AuthState.LOADING)
  const user = ref<FirebaseUser | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const error = ref<string | null>(null)

  const authPromise = new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      state.value = firebaseUser ? AuthState.AUTHED : AuthState.UNAUTHED
      error.value = null
      resolve()
    }, (err) => {
      error.value = err.message
      state.value = AuthState.UNAUTHED
      resolve()
    })
  })

  const waitForAuth = () => authPromise

  const setUserProfile = (profile: UserProfile | null) => {
    userProfile.value = profile
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const reset = () => {
    user.value = null
    userProfile.value = null
    state.value = AuthState.UNAUTHED
    error.value = null
  }

  return {
    state,
    user,
    userProfile,
    error,
    waitForAuth,
    setUserProfile,
    setError,
    reset,
  }
})
