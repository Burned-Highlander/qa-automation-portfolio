// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
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
    // 1. POTION SHOP UI TESTS
    // ==========================================
    {
      name: 'potion-shop-ui-chromium',
      testDir: './potion-shop-ui-tests/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://qe-at-cgi-fi.github.io/'
      },
    },
    {
      name: 'potion-shop-ui-firefox',
      testDir: './potion-shop-ui-tests/tests',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://qe-at-cgi-fi.github.io/'
      },
    },
    {
      name: 'potion-shop-ui-webkit',
      testDir: './potion-shop-ui-tests/tests',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'https://qe-at-cgi-fi.github.io/'
      },
    },

    // ==========================================
    // 2. RESTFUL BOOKER API TESTS
    // ==========================================
    {
      name: 'restful-booker-api',
      testDir: './restful-booker-api-tests/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://automationintesting.online' // <-- ADDED HERE
      },
      testMatch: '**/*.spec.js',
    },
  ],
});