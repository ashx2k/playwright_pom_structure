const { TestConstants } = require('../constants/TestConstants');

/**
 * Page object model for the Playwright home page.
 * This file keeps only locators and static page metadata.
 */
class PlaywrightHomePage {
  constructor(page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: TestConstants.GET_STARTED_LINK_TEXT });
    this.docsHeader = page.getByRole('heading', { name: TestConstants.INSTALLATION_HEADING_TEXT });
    this.expectedTitle = TestConstants.HOME_PAGE_TITLE_REGEX;
  }
}

module.exports = { PlaywrightHomePage };
