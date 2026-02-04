import { test, expect } from '@playwright/test'

test.describe('Basic Navigation', () => {
  test('should load login page on root path', async ({ page }) => {
    await page.goto('/')
    // Should redirect to login since not authenticated
    expect(page.url()).toContain('/login')
  })

  test('should have login form elements', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')

    expect(emailInput).toBeVisible()
    expect(passwordInput).toBeVisible()
    expect(submitButton).toBeVisible()
  })

  test('should have register link on login page', async ({ page }) => {
    await page.goto('/login')

    const registerLink = page.locator('a:has-text("register")')
    expect(registerLink).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')

    const registerLink = page.locator('a[href="/register"]')
    await registerLink.click()

    expect(page.url()).toContain('/register')
  })

  test('should have Microsoft login button', async ({ page }) => {
    await page.goto('/login')

    const microsoftButton = page.locator('button:has-text("Microsoft")')
    expect(microsoftButton).toBeVisible()
  })

  test('status page should be accessible', async ({ page }) => {
    await page.goto('/status')

    expect(page.url()).toContain('/status')
    expect(page.locator('text=Firebase Status')).toBeVisible()
  })
})
