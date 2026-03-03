import { test } from '@playwright/test';
import { PlaywrightHomePage } from '../src/pages/PlaywrightHomePage';
import { PlaywrightHomePageMethods } from '../src/methods/PlaywrightHomePageMethods';

test.describe('Playwright home page', () => {
  test('should navigate using maintainable POM layers', async ({ page }) => {
    // Create page + methods separately to keep responsibilities clear.
    const homePage = new PlaywrightHomePage(page);
    const homePageMethods = new PlaywrightHomePageMethods(homePage);

    await homePageMethods.goToHomePage();
    await homePageMethods.verifyTitle();
    await homePageMethods.goToDocsFromGetStarted();
  });
});
