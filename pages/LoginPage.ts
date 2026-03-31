import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — DemoQA Books App login page.
 * URL: https://demoqa.com/login
 */
export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly newUserButton: Locator;
  readonly errorMessage: Locator;
  readonly pageHeading: Locator;
  readonly profileUserName: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput    = page.locator('#userName');
    this.passwordInput    = page.locator('#password');
    this.loginButton      = page.locator('#login');
    this.newUserButton    = page.locator('#newUser');
    this.errorMessage     = page.locator('#name');          // shows on invalid creds
    this.pageHeading      = page.locator('.main-header');
    this.profileUserName  = page.locator('#userName-value');
    this.logoutButton     = page.locator('#submit');        // on profile page
  }

  // ─── BasePage implementation ──────────────────────────────────────────────

  get pageUrl(): string {
    return '/login';
  }

  get pageReadyLocator(): Locator {
    return this.loginButton;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Username');
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password, 'Password');
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton, 'Login button');
  }

  async clickNewUser(): Promise<void> {
    await this.click(this.newUserButton, 'New User button');
  }

  /**
   * High-level login action.
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertVisible(this.usernameInput, 'Username field');
    await this.assertVisible(this.passwordInput, 'Password field');
    await this.assertVisible(this.loginButton, 'Login button');
  }

  async assertLoginError(expectedMessage: string): Promise<void> {
    await this.assertContainsText(this.errorMessage, expectedMessage, 'Error message');
  }

  async assertLoggedIn(): Promise<void> {
    // After login, DemoQA redirects to profile page
    await this.assertUrl(/\/profile/);
  }

  async getLoggedInUsername(): Promise<string> {
    return this.getText(this.profileUserName);
  }
}
