// playwright.config.js (in the root qa-automation-portfolio folder)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './', // Start looking from the root directory
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // ==========================================
    // 1. POTION SHOP UI TESTS (Cross-Browser)
    // ==========================================
    {
      name: 'potion-shop-ui-chromium',
      testDir: './potion-shop-ui-tests/tests', // Points specifically to UI tests
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'potion-shop-ui-firefox',
      testDir: './potion-shop-ui-tests/tests',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'potion-shop-ui-webkit',
      testDir: './potion-shop-ui-tests/tests',
      use: { ...devices['Desktop Safari'] },
    },

    // ==========================================
    // 2. RESTFUL BOOKER API TESTS (Optimized)
    // ==========================================
    {
      name: 'restful-booker-api',
      testDir: './restful-booker-api-tests/tests', // Points specifically to API tests
      use: { ...devices['Desktop Chrome'] }, // API tests only need 1 browser, saving CI/CD time
      testMatch: '**/*.spec.js',
    },
  ],
});