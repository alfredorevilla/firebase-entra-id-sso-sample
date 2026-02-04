import { describe, it, expect } from 'vitest'
import router from '@/router'

describe('Router', () => {
  it('should have routes defined', () => {
    expect(router.getRoutes().length).toBeGreaterThan(0)
  })

  it('should have login route', () => {
    const routes = router.getRoutes()
    const loginRoute = routes.find(r => r.path === '/login')
    expect(loginRoute).toBeDefined()
  })

  it('should have home route with requiresAuth meta', () => {
    const routes = router.getRoutes()
    const homeRoute = routes.find(r => r.path === '/home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.meta?.requiresAuth).toBe(true)
  })

  it('should have profile route with requiresAuth meta', () => {
    const routes = router.getRoutes()
    const profileRoute = routes.find(r => r.path === '/profile')
    expect(profileRoute).toBeDefined()
    expect(profileRoute?.meta?.requiresAuth).toBe(true)
  })

  it('should have status route', () => {
    const routes = router.getRoutes()
    const statusRoute = routes.find(r => r.path === '/status')
    expect(statusRoute).toBeDefined()
  })
})
