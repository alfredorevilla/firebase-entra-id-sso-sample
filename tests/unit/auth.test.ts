import { describe, it, expect, vi } from 'vitest'
import { AuthState } from '@/types/auth'
import { authService } from '@/services/authService'

describe('AuthService', () => {
  it('should have loginWithEmail method', () => {
    expect(typeof authService.loginWithEmail).toBe('function')
  })

  it('should have registerWithEmail method', () => {
    expect(typeof authService.registerWithEmail).toBe('function')
  })

  it('should have loginWithMicrosoft method', () => {
    expect(typeof authService.loginWithMicrosoft).toBe('function')
  })

  it('should have logout method', () => {
    expect(typeof authService.logout).toBe('function')
  })
})

describe('AuthState', () => {
  it('should have LOADING state', () => {
    expect(AuthState.LOADING).toBe('LOADING')
  })

  it('should have AUTHED state', () => {
    expect(AuthState.AUTHED).toBe('AUTHED')
  })

  it('should have UNAUTHED state', () => {
    expect(AuthState.UNAUTHED).toBe('UNAUTHED')
  })
})
