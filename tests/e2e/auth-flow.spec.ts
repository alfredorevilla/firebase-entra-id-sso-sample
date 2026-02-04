import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')

    await emailInput.fill('invalid-email')
    await passwordInput.fill('password123')

    const submitButton = page.locator('button[type="submit"]')
    expect(submitButton).toBeDisabled() // HTML5 validation
  })

  test('should have register form on register page', async ({ page }) => {
    await page.goto('/register')

    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')

    expect(emailInput).toBeVisible()
    expect(passwordInput).toBeVisible()
    expect(submitButton).toBeVisible()
  })

  test('should have login link on register page', async ({ page }) => {
    await page.goto('/register')

    const loginLink = page.locator('a:has-text("login")')
    expect(loginLink).toBeVisible()
  })

  test('login button should be enabled with valid input', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')

    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')

    expect(submitButton).toBeEnabled()
  })
})
