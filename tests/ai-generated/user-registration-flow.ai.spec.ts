/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AI-GENERATED TEST (Refined)
 *
 * This test was initially scaffolded by aiTestGenerator.ts using a plain-English
 * feature description, then reviewed and refined by a human SDET.
 *
 * Original AI prompt:
 *   featureName: "User Registration Flow"
 *   description: "New user can navigate to registration and see the form"
 *   actions: ["navigate to login page", "click new user button", "verify registration form"]
 *   assertions: ["verify url contains /register", "verify submit button is visible"]
 *   tags: ["smoke", "ai-generated"]
 *
 * AI Confidence Score: 85%
 * Generated: 2024-06-01T00:00:00.000Z
 * Refined by: SDET Engineer
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../../fixtures/test.fixtures';
import { Logger } from '../../utils/logger';
import { allure } from 'allure-playwright';

test.describe('User Registration Flow @smoke @ai-generated', () => {

  test.beforeEach(async ({ loginPage }) => {
    Logger.testStart('User Registration Flow');
    await loginPage.navigate();
  });

  test.afterEach(async ({}, testInfo) => {
    const status = testInfo.status === 'passed' ? 'PASSED' : 'FAILED';
    Logger.testEnd('User Registration Flow', status);
  });

  // ── AI-Scaffolded + Human-Refined ────────────────────────────────────────

  test('new user can navigate to the registration page @smoke', async ({
    loginPage,
    page,
  }) => {
    await allure.suite('AI Generated');
    await allure.story('Registration Navigation');
    await allure.description(
      'AI-generated test: verifies navigation from login → registration page.'
    );
    await allure.label('ai_generated', 'true');
    await allure.label('confidence_score', '85');

    // AI Action: navigate to login page (handled in beforeEach)
    Logger.step('Verify login page loaded');
    await loginPage.assertLoginPageLoaded();

    // AI Action: click new user button
    Logger.step('Click New User button');
    await loginPage.clickNewUser();

    // AI Assertion: verify url contains /register
    Logger.step('Assert URL contains /register');
    await expect(page).toHaveURL(/\/register/);

    // AI Assertion: verify register form elements are present
    Logger.step('Assert registration form is visible');
    const firstNameField = page.locator('#firstname');
    const lastNameField  = page.locator('#lastname');
    const usernameField  = page.locator('#userName');
    const passwordField  = page.locator('#password');
    const registerButton = page.locator('#register');

    await expect(firstNameField).toBeVisible();
    await expect(lastNameField).toBeVisible();
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(registerButton).toBeVisible();

    Logger.info('✅ Registration form verified by AI-generated test');
  });

  test('registration page should have correct heading @smoke', async ({ page, loginPage }) => {
    await allure.suite('AI Generated');
    await allure.label('ai_generated', 'true');

    await loginPage.clickNewUser();
    await expect(page).toHaveURL(/\/register/);

    const heading = page.locator('.main-header');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Register');
  });

  test('back to login link should return user to login page @smoke', async ({
    page,
    loginPage,
  }) => {
    await allure.suite('AI Generated');
    await allure.label('ai_generated', 'true');

    await loginPage.clickNewUser();
    await expect(page).toHaveURL(/\/register/);

    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#login')).toBeVisible();
  });
});
