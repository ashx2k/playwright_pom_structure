import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

/**
 * Home page methods are intentionally separated from locators.
 * This keeps behavior in one place and makes the POM easier to maintain.
 */
export class PlaywrightHomePageMethods {
  constructor(private readonly homePage: PlaywrightHomePage) {}

  /** Navigate to the base URL. */
  async goToHomePage(): Promise<void> {
    await this.homePage.page.goto('/');
  }

  /** Validate the home page title. */
  async verifyTitle(): Promise<void> {
    await expect(this.homePage.page).toHaveTitle(this.homePage.expectedTitle);
  }

  /** Click the Get started link and verify documentation page loaded. */
  async goToDocsFromGetStarted(): Promise<void> {
    await this.homePage.getStartedLink.click();
    await expect(this.homePage.docsHeader).toBeVisible();
  }
}
