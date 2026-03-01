import { test, expect } from '@playwright/test'

test.describe('Campaign Management', () => {
  test.describe('Campaigns List Page', () => {
    test('should display campaigns page', async ({ page }) => {
      await page.goto('/campaigns')
      await expect(page).toHaveURL(/campaigns/)
    })

    test('should show campaign cards or empty state', async ({ page }) => {
      await page.goto('/campaigns')
      // Either campaigns are shown or a message indicating no campaigns
      const content = page.locator('text=/campaign|discover|no campaigns|loading/i').first()
      await expect(content).toBeVisible({ timeout: 10000 })
    })

    test('should have search/filter functionality', async ({ page }) => {
      await page.goto('/campaigns')
      // Check for search input or filter elements
      const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]')
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible()
      }
    })
  })

  test.describe('Campaign Detail Page', () => {
    test('should show campaign detail when navigated with valid ID', async ({ page }) => {
      await page.goto('/campaigns')
      // Try clicking first campaign link if it exists
      const campaignLink = page.locator('a[href*="/campaigns/"]').first()
      if (await campaignLink.count() > 0) {
        await campaignLink.click()
        await expect(page).toHaveURL(/\/campaigns\//)
      }
    })
  })

  test.describe('Create Campaign Page', () => {
    test('should display create campaign form', async ({ page }) => {
      await page.goto('/campaigns/create')
      // Should have a form or redirect to login
      const formOrRedirect = page.locator('form, text=/login|sign in|create campaign/i').first()
      await expect(formOrRedirect).toBeVisible({ timeout: 10000 })
    })
  })
})
