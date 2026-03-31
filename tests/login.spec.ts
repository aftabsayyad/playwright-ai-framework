/**
 * Login Tests — DemoQA Books App
 * Tags: @smoke @regression @auth
 *
 * Covers:
 *  - Page load validation
 *  - Field-level interaction
 *  - Error messages on bad credentials
 *  - Successful login flow (requires valid account)
 */

import { test, expect } from '../fixtures/test.fixtures';
import { VALID_USER, INVALID_USER, MESSAGES } from '../data/testData';
import { Logger } from '../utils/logger';
import { allure } from 'allure-playwright';

test.describe('Login Page @smoke @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // ─── Page Load ─────────────────────────────────────────────────────────────

  test('should load the login page correctly @smoke', async ({ loginPage }) => {
    await allure.suite('Authentication');
    await allure.story('Page Load');
    await allure.severity('critical');

    Logger.testStart('Login page load');

    await loginPage.assertLoginPageLoaded();
    await loginPage.assertUrl(/\/login/);

    Logger.testEnd('Login page load', 'PASSED');
  });

  test('should display username and password fields @smoke', async ({ loginPage }) => {
    await allure.suite('Authentication');

    await loginPage.assertVisible(loginPage.usernameInput, 'Username input');
    await loginPage.assertVisible(loginPage.passwordInput, 'Password input');
    await loginPage.assertVisible(loginPage.loginButton, 'Login button');
    await loginPage.assertVisible(loginPage.newUserButton, 'New User button');
  });

  // ─── Field Interactions ────────────────────────────────────────────────────

  test('should allow typing in username and password fields', async ({ loginPage }) => {
    await allure.suite('Authentication');
    await allure.story('Field Interaction');

    await loginPage.enterUsername(VALID_USER.username);
    await loginPage.enterPassword(VALID_USER.password);

    await expect(loginPage.usernameInput).toHaveValue(VALID_USER.username);
    await expect(loginPage.passwordInput).toHaveValue(VALID_USER.password);
  });

  test('should keep password input masked', async ({ loginPage }) => {
    await loginPage.enterPassword('secret123');
    const inputType = await loginPage.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  test('should show error on invalid credentials @regression', async ({
    loginPage,
    page,
  }) => {
    await allure.suite('Authentication');
    await allure.story('Error Handling');
    await allure.severity('critical');

    Logger.testStart('Invalid login');

    await loginPage.login(INVALID_USER.username, INVALID_USER.password);

    // DemoQA shows error text
    await loginPage.assertLoginError(MESSAGES.loginError);

    Logger.testEnd('Invalid login', 'PASSED');
  });

  test('should show error when submitting empty form @regression', async ({
    loginPage,
  }) => {
    await allure.suite('Authentication');

    await loginPage.clickLogin();

    // Username field should be in invalid state
    const validationState = await loginPage.usernameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(validationState).toBe(false);
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test('should navigate to registration page when New User is clicked @regression', async ({
    loginPage,
  }) => {
    await allure.suite('Authentication');
    await allure.story('Navigation');

    await loginPage.clickNewUser();
    await loginPage.assertUrl(/\/register/);
  });

  // ─── Successful Login (requires pre-created DemoQA account) ────────────────

  test.skip('should login successfully with valid credentials', async ({
    loginPage,
  }) => {
    // Skipped by default — requires a real DemoQA account.
    // To enable: set TEST_USERNAME and TEST_PASSWORD env vars.
    await allure.suite('Authentication');
    await allure.story('Successful Login');
    await allure.severity('blocker');

    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await loginPage.assertLoggedIn();

    const username = await loginPage.getLoggedInUsername();
    expect(username).toBe(VALID_USER.username);
  });
});
