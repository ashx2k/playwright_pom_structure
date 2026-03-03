const { defineConfig, devices } = require('@playwright/test');
const { TestConstants } = require('./src/constants/TestConstants');

// Centralized viewport config so local and CI runs stay consistent.
const viewportWidth = Number(process.env.VIEWPORT_WIDTH ?? TestConstants.DEFAULT_VIEWPORT_WIDTH);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT ?? TestConstants.DEFAULT_VIEWPORT_HEIGHT);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: TestConstants.TEST_RESULTS_DIR,
  reporter: [
    ['html', { open: 'never', outputFolder: TestConstants.PLAYWRIGHT_REPORT_DIR }],
    ['list'],
    ['allure-playwright', { outputFolder: TestConstants.ALLURE_RESULTS_DIR }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? TestConstants.DEFAULT_BASE_URL,
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
