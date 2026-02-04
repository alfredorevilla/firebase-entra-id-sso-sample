import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AuthState } from '@/types/auth'

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const store = useAuthStore()

  // Wait for auth state to be determined
  if (store.state === AuthState.LOADING) {
    await store.waitForAuth()
  }

  const requiresAuth = to.meta.requiresAuth as boolean | undefined
  const isAuthed = store.state === AuthState.AUTHED

  if (requiresAuth && !isAuthed) {
    next('/login')
  } else if (!requiresAuth && isAuthed && to.path === '/login') {
    next('/home')
  } else {
    next()
  }
}
