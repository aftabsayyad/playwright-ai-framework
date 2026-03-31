import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { FormsPage } from '../pages/FormsPage';
import { ElementsPage } from '../pages/ElementsPage';
import { Logger } from '../utils/logger';

// ─── Fixture Types ────────────────────────────────────────────────────────────

export type PageFixtures = {
  loginPage: LoginPage;
  formsPage: FormsPage;
  elementsPage: ElementsPage;
};

export type WorkerFixtures = {
  authenticatedPage: Page;
};

// ─── Extended Test ────────────────────────────────────────────────────────────

/**
 * `test` — extended Playwright test with pre-wired page objects and helpers.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/test.fixtures';
 *   test('...', async ({ loginPage }) => { ... });
 */
export const test = base.extend<PageFixtures & WorkerFixtures>({
  // ── Page Object Fixtures ──────────────────────────────────────────────────

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  formsPage: async ({ page }, use) => {
    const formsPage = new FormsPage(page);
    await use(formsPage);
  },

  elementsPage: async ({ page }, use) => {
    const elementsPage = new ElementsPage(page);
    await use(elementsPage);
  },

  // ── Authenticated Page Fixture ────────────────────────────────────────────
  // Logs in before the test and provides the authenticated page.

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    const username = process.env.TEST_USERNAME || 'testuser';
    const password = process.env.TEST_PASSWORD || 'Test@12345';

    Logger.info(`🔐 Setting up authenticated session for: ${username}`);

    try {
      await loginPage.navigate();
      await loginPage.login(username, password);
    } catch (err) {
      Logger.warn(`Auth setup failed (may be expected on demo site): ${err}`);
    }

    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
