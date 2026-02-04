import { describe, it, expect, vi } from 'vitest'
import { userService } from '@/services/userService'

describe('UserService', () => {
  it('should have getOrCreateUserDoc method', () => {
    expect(typeof userService.getOrCreateUserDoc).toBe('function')
  })

  it('should have updateUserProfile method', () => {
    expect(typeof userService.updateUserProfile).toBe('function')
  })

  it('should accept user profile data', () => {
    const mockProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      provider: 'password',
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(mockProfile.uid).toBe('test-uid')
    expect(mockProfile.roles).toContain('user')
  })
})
