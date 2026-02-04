/**
 * Domain-to-provider mapping for SSO registration
 * Maps email domains to their associated SSO providers
 * Extension point: Can be moved to Firestore for dynamic configuration in production
 */

export type SSOProvider = 'microsoft.com' | 'google.com' | 'none'

export const domainProviderMap: Record<string, SSOProvider> = {
  // Microsoft-associated domains
  'microsoft.com': 'microsoft.com',
  'contoso.onmicrosoft.com': 'microsoft.com',
  'contoso.com': 'microsoft.com',
  // Google-associated domains (example)
  'gmail.com': 'google.com',
  'googlemail.com': 'google.com',
}

/**
 * Detect the SSO provider based on email domain
 * @param email - User's email address
 * @returns The suggested SSO provider, or 'none' if not found
 */
export function detectProviderFromEmail(email: string): SSOProvider {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return 'none'

  return domainProviderMap[domain] || 'none'
}

/**
 * Check if an email domain suggests corporate/enterprise SSO
 * @param email - User's email address
 * @returns true if domain suggests enterprise SSO
 */
export function isEnterpriseEmail(email: string): boolean {
  return detectProviderFromEmail(email) !== 'none'
}

/**
 * Get human-readable provider name
 * @param provider - The SSO provider
 * @returns Display name for the provider
 */
export function getProviderDisplayName(provider: SSOProvider): string {
  const displayNames: Record<SSOProvider, string> = {
    'microsoft.com': 'Microsoft',
    'google.com': 'Google',
    'none': 'Email/Password',
  }
  return displayNames[provider]
}
