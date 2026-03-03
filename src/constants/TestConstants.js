/**
 * Single source of truth for framework constants.
 * Import this class everywhere to avoid hardcoded duplicate values.
 */
class TestConstants {
  static DEFAULT_BASE_URL = 'https://playwright.dev';

  static DEFAULT_VIEWPORT_WIDTH = 1366;

  static DEFAULT_VIEWPORT_HEIGHT = 768;

  static HOME_PAGE_TITLE_REGEX = /Playwright/;

  static GET_STARTED_LINK_TEXT = 'Get started';

  static INSTALLATION_HEADING_TEXT = 'Installation';

  static ARTIFACTS_DIR = 'artifacts';

  static TEST_RESULTS_DIR = `${TestConstants.ARTIFACTS_DIR}/test-results`;

  static PLAYWRIGHT_REPORT_DIR = `${TestConstants.ARTIFACTS_DIR}/playwright-report`;

  static ALLURE_RESULTS_DIR = `${TestConstants.ARTIFACTS_DIR}/allure-results`;

  static ALLURE_REPORT_DIR = `${TestConstants.ARTIFACTS_DIR}/allure-report`;
}

module.exports = { TestConstants };
