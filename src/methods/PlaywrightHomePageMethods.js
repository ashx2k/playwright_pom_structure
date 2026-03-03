const { expect } = require('@playwright/test');

/**
 * Home page methods are intentionally separated from locators.
 * This keeps behavior in one place and makes the POM easier to maintain.
 */
class PlaywrightHomePageMethods {
  constructor(homePage) {
    this.homePage = homePage;
  }

  /** Navigate to the base URL. */
  async goToHomePage() {
    await this.homePage.page.goto('/');
  }

  /** Validate the home page title. */
  async verifyTitle() {
    await expect(this.homePage.page).toHaveTitle(this.homePage.expectedTitle);
  }

  /** Click the Get started link and verify documentation page loaded. */
  async goToDocsFromGetStarted() {
    await this.homePage.getStartedLink.click();
    await expect(this.homePage.docsHeader).toBeVisible();
  }
}

module.exports = { PlaywrightHomePageMethods };
