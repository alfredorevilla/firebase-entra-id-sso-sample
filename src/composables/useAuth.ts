import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { AuthState } from '@/types/auth'

export const useAuth = () => {
  const store = useAuthStore()

  const isLoading = computed(() => store.state === AuthState.LOADING)
  const isAuthed = computed(() => store.state === AuthState.AUTHED)
  const isUnauthed = computed(() => store.state === AuthState.UNAUTHED)

  const register = async (email: string, password: string) => {
    const result = await authService.registerWithEmail(email, password)
    if (result.error) {
      store.setError(result.error)
    }
    return result
  }

  const login = async (email: string, password: string) => {
    const result = await authService.loginWithEmail(email, password)
    if (result.error) {
      store.setError(result.error)
    }
    return result
  }

  const loginWithMicrosoft = async () => {
    const result = await authService.loginWithMicrosoft()
    if (result.error) {
      store.setError(result.error)
    }
    return result
  }

  const logout = async () => {
    const result = await authService.logout()
    if (!result.error) {
      store.reset()
    }
    return result
  }

  return {
    auth: {
      state: computed(() => store.state),
      user: computed(() => store.user),
      userProfile: computed(() => store.userProfile),
      isLoading,
      isAuthed,
      isUnauthed,
      error: computed(() => store.error),
    },
    register,
    login,
    loginWithMicrosoft,
    logout,
  }
}
