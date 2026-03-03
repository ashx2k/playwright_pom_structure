# Playwright POM Framework (Simple, Maintainable, Expandable)

This project is a **clean Playwright Page Object Model (POM) template** designed for both:
- **Local execution** (developer-friendly)
- **GitHub CI/CD execution** (reporting + publishing + notification)

It separates page locators from page actions, keeps reports/artifacts organized, supports configurable viewport, and publishes Allure reports to GitHub Pages.

---

## 1) Architecture Overview

### Goals
- Keep test code easy to read and maintain.
- Keep reusable methods in separate files.
- Keep config centralized.
- Keep logs/reports/media in isolated folders.
- Make CI/CD report publishing automatic.

### Core POM Pattern Used
- `src/pages/*` → **Page classes** (locators + static page info only).
- `src/methods/*` → **Method classes** (actions + assertions).
- `tests/*` → **Test scenarios** that orchestrate methods.

This split is expandable because when UI changes, you mostly update page locators/methods, while tests remain readable and stable.

---

## 2) Complete Folder Structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright-ci.yml                # CI pipeline: run tests, build/publish Allure, email URL
├── scripts/
│   └── cleanup-old-reports.sh               # Deletes gh-pages reports older than 30 days
├── src/
│   ├── pages/
│   │   └── PlaywrightHomePage.ts            # Locators only
│   └── methods/
│       └── PlaywrightHomePageMethods.ts     # Actions + assertions only
├── tests/
│   └── playwright-home.spec.ts              # Test flow using page + methods
├── artifacts/                                # Generated at runtime (not committed)
│   ├── test-results/                        # Playwright result data + logs/traces
│   ├── playwright-report/                   # Playwright HTML report
│   ├── allure-results/                      # Allure raw result files
│   └── allure-report/                       # Generated Allure HTML report
├── .env.example                              # Runtime variables (base URL + viewport)
├── .gitignore
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## 3) How POM Is Implemented

### `src/pages/PlaywrightHomePage.ts`
Contains:
- `Page` reference
- Locators (`getStartedLink`, `docsHeader`)
- Static metadata (`expectedTitle`)

No behavior should be added here.

### `src/methods/PlaywrightHomePageMethods.ts`
Contains:
- Navigation method (`goToHomePage`)
- Validation method (`verifyTitle`)
- User action flow (`goToDocsFromGetStarted`)

All interactions and assertions are isolated here for reuse.

### `tests/playwright-home.spec.ts`
Contains only scenario-level flow:
- Instantiate page object
- Instantiate method object
- Call reusable methods

This keeps tests short and business-focused.

---

## 4) Configuration Handling (Viewport + Base URL)

`playwright.config.ts` reads environment values:
- `BASE_URL`
- `VIEWPORT_WIDTH`
- `VIEWPORT_HEIGHT`

It applies them in `use.viewport` and again in project-level Chromium config so viewport is consistent for both local and CI runs.

### Example
```bash
BASE_URL=https://playwright.dev VIEWPORT_WIDTH=1440 VIEWPORT_HEIGHT=900 npm test
```

---

## 5) Logs, Media, and Report Handling

All runtime outputs are kept under `artifacts/` for cleaner code management:
- `artifacts/test-results/` → traces/logs/test metadata
- `artifacts/playwright-report/` → Playwright HTML report
- `artifacts/allure-results/` → raw Allure data
- `artifacts/allure-report/` → generated Allure site

Additionally, failure media handling is configured:
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'on-first-retry'`

In GitHub Actions, these are uploaded as artifacts for debugging.

---

## 6) Allure Reporting

Allure is enabled through:
- `allure-playwright` reporter in `playwright.config.ts`
- `allure-commandline` for report generation

Useful commands:
```bash
npm run test:ci
npm run report:allure:generate
npm run report:allure:open
```

---

## 7) CI/CD Flow (GitHub Actions)

Workflow file: `.github/workflows/playwright-ci.yml`

### What it does
1. Install dependencies and browser.
2. Run Playwright tests with Allure reporter.
3. Generate Allure HTML report.
4. Upload reports + videos + traces + screenshots as run artifacts.
5. Copy generated Allure report into `gh-pages/reports/<date-run>/`.
6. Delete reports older than **30 days**.
7. Rebuild report index page.
8. Push changes to `gh-pages` branch.
9. Build the public report URL.
10. Send the public URL by email.

---

## 8) Automatic GitHub Pages Publishing

Published report URL format:
```text
https://<github-owner>.github.io/<repo-name>/reports/<yyyy-mm-dd>-run-<run-number>/index.html
```

The workflow writes this URL to `REPORT_URL` and uses it in email content.

---

## 9) Email Notification Setup

The workflow sends email using SMTP and `dawidd6/action-send-mail`.

Configure these GitHub Secrets:
- `SMTP_SERVER`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `REPORT_EMAIL_TO_SELECTED` (single user email or comma-separated selected recipients)
- `REPORT_EMAIL_FROM`

Once configured, every non-PR workflow run emails the public Allure report URL to recipients.

---

## 10) Report Retention / Deletion Mechanism (30 Days)

Script: `scripts/cleanup-old-reports.sh`

It removes folders in `gh-pages/reports` older than 30 days:
```bash
./scripts/cleanup-old-reports.sh gh-pages/reports 30
```

This keeps hosted reports manageable and prevents unbounded growth.

---

## 11) Expandability Guide

To scale this framework:
- Add new page classes under `src/pages/`.
- Add matching method classes under `src/methods/`.
- Keep tests as thin orchestration layers.
- Add tags/projects in Playwright config for different browsers/environments.
- Introduce fixtures for auth/session/bootstrap.
- Add environment-specific workflows (staging/prod smoke).

Because responsibilities are separated, you can expand without rewriting existing tests heavily.

---

## 12) Local Setup

1. Install dependencies:
```bash
npm install
```

2. Install browser:
```bash
npx playwright install chromium
```

3. Run tests:
```bash
npm test
```

4. Generate/open Allure report:
```bash
npm run report:allure:generate
npm run report:allure:open
```

---

## 13) Environment Variables

See `.env.example`:
- `BASE_URL`
- `VIEWPORT_WIDTH`
- `VIEWPORT_HEIGHT`

Copy `.env.example` to `.env` and customize as needed.


---

## 14) Optional Slack Integration (Commented Out by Default)

The workflow includes a **commented-out Slack notification step** that can post the generated GitHub Pages report URL.

To enable it:
1. Uncomment the Slack step in `.github/workflows/playwright-ci.yml`.
2. Add repository secret: `SLACK_WEBHOOK_URL`.
3. Commit and run the pipeline again.

This is intentionally kept disabled as requested.
