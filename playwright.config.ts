import { defineConfig, devices } from '@playwright/test';

// Centralized viewport config so local and CI runs stay consistent.
const viewportWidth = Number(process.env.VIEWPORT_WIDTH ?? 1366);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT ?? 768);

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'artifacts/test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'artifacts/playwright-report' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'artifacts/allure-results' }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: {
      width: viewportWidth,
      height: viewportHeight
    }
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: viewportWidth, height: viewportHeight }
      }
    }
  ]
});
