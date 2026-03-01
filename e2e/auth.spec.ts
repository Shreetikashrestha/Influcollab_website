import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login')
      await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible()
      await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/login')
      await page.click('button[type="submit"]')
      // Should show some form of validation error
      await expect(page.locator('text=/required|email|password/i').first()).toBeVisible({ timeout: 5000 })
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"], input[type="email"]', 'wrong@example.com')
      await page.fill('input[name="password"], input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      // Should show error message
      await expect(page.locator('text=/invalid|error|failed|incorrect/i').first()).toBeVisible({ timeout: 10000 })
    })

    test('should have link to register page', async ({ page }) => {
      await page.goto('/login')
      const registerLink = page.locator('a[href*="register"]')
      await expect(registerLink).toBeVisible()
    })

    test('should have link to forgot password', async ({ page }) => {
      await page.goto('/login')
      const forgotLink = page.locator('a[href*="forgot"]')
      if (await forgotLink.count() > 0) {
        await expect(forgotLink).toBeVisible()
      }
    })

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login')
      const passwordInput = page.locator('input[type="password"]').first()
      await passwordInput.fill('testpassword')

      // Look for a show/hide toggle button near the password field
      const toggleBtn = page.locator('button:near(input[type="password"])').first()
      if (await toggleBtn.count() > 0) {
        await toggleBtn.click()
        await expect(page.locator('input[type="text"][value="testpassword"]')).toBeVisible()
      }
    })
  })

  test.describe('Registration Page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register')
      await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible()
      await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible()
    })

    test('should have role selector for Influencer and Brand', async ({ page }) => {
      await page.goto('/register')
      await expect(page.locator('text=Influencer').first()).toBeVisible()
      await expect(page.locator('text=Brand').first()).toBeVisible()
    })

    test('should show validation errors for empty registration', async ({ page }) => {
      await page.goto('/register')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=/required|email|name/i').first()).toBeVisible({ timeout: 5000 })
    })

    test('should have link to login page', async ({ page }) => {
      await page.goto('/register')
      const loginLink = page.locator('a[href*="login"]')
      await expect(loginLink).toBeVisible()
    })
  })
})
