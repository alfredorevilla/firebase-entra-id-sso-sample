import { describe, it, expect } from 'vitest'
import { authService } from '@/services/authService'

describe('Account Linking', () => {
  it('should have getPendingCredential method', () => {
    expect(typeof authService.getPendingCredential).toBe('function')
  })

  it('should have clearPendingCredential method', () => {
    expect(typeof authService.clearPendingCredential).toBe('function')
  })

  it('should return null for non-existent pending credential', () => {
    authService.clearPendingCredential()
    const credential = authService.getPendingCredential()
    expect(credential).toBeNull()
  })

  it('should handle microsoft OAuth provider', async () => {
    const result = await authService.loginWithMicrosoft()
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('error')
  })
})
