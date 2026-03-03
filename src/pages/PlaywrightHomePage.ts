import { Locator, Page } from '@playwright/test';

/**
 * Page object model for the Playwright home page.
 * This file keeps only locators and static page metadata.
 */
export class PlaywrightHomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly docsHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.docsHeader = page.getByRole('heading', { name: 'Installation' });
  }

  readonly expectedTitle = /Playwright/;
}
