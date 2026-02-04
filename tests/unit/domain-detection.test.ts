import { describe, it, expect } from 'vitest'
import {
  detectProviderFromEmail,
  isEnterpriseEmail,
  getProviderDisplayName,
  domainProviderMap,
} from '@/config/domainMap'

describe('Domain Detection', () => {
  it('should detect Microsoft for contoso.onmicrosoft.com', () => {
    const provider = detectProviderFromEmail('user@contoso.onmicrosoft.com')
    expect(provider).toBe('microsoft.com')
  })

  it('should detect Microsoft for contoso.com', () => {
    const provider = detectProviderFromEmail('user@contoso.com')
    expect(provider).toBe('microsoft.com')
  })

  it('should detect Google for gmail.com', () => {
    const provider = detectProviderFromEmail('user@gmail.com')
    expect(provider).toBe('google.com')
  })

  it('should return none for unknown domain', () => {
    const provider = detectProviderFromEmail('user@example.com')
    expect(provider).toBe('none')
  })

  it('should be case insensitive', () => {
    const provider = detectProviderFromEmail('user@CONTOSO.COM')
    expect(provider).toBe('microsoft.com')
  })

  it('should identify enterprise emails', () => {
    expect(isEnterpriseEmail('user@contoso.onmicrosoft.com')).toBe(true)
    expect(isEnterpriseEmail('user@gmail.com')).toBe(true)
    expect(isEnterpriseEmail('user@example.com')).toBe(false)
  })

  it('should get display names for providers', () => {
    expect(getProviderDisplayName('microsoft.com')).toBe('Microsoft')
    expect(getProviderDisplayName('google.com')).toBe('Google')
    expect(getProviderDisplayName('none')).toBe('Email/Password')
  })

  it('should have domain map configured', () => {
    expect(domainProviderMap['contoso.onmicrosoft.com']).toBe('microsoft.com')
    expect(domainProviderMap['gmail.com']).toBe('google.com')
  })
})
