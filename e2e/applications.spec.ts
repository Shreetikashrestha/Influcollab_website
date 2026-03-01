import { test, expect } from '@playwright/test'

test.describe('Application Management', () => {
  test.describe('Applications Page', () => {
    test('should display applications page', async ({ page }) => {
      await page.goto('/applications')
      // Should load or redirect to login
      const content = page.locator('text=/application|login|sign in/i').first()
      await expect(content).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Influencer Applications', () => {
    test('should show influencer page', async ({ page }) => {
      await page.goto('/influencer')
      const content = page.locator('text=/influencer|login|dashboard|sign in/i').first()
      await expect(content).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Brand Applications', () => {
    test('should show brand page', async ({ page }) => {
      await page.goto('/brand')
      const content = page.locator('text=/brand|login|dashboard|sign in/i').first()
      await expect(content).toBeVisible({ timeout: 10000 })
    })
  })
})
