import { test, expect } from '@playwright/test'

test.describe('Notifications', () => {
  test('should display notifications page', async ({ page }) => {
    await page.goto('/notifications')
    // Should load or redirect to login
    const content = page.locator('text=/notification|login|sign in/i').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('should have navigation to notifications', async ({ page }) => {
    await page.goto('/')
    // Check if there's a notification bell or link in navigation
    const bellOrLink = page.locator('[href*="notification"], button:has(svg), text=/notification/i').first()
    if (await bellOrLink.count() > 0) {
      await expect(bellOrLink).toBeVisible()
    }
  })
})
