import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { waitForNetworkIdle, takeScreenshot } from '../utils/helpers';

/**
 * BasePage — all Page Objects extend this class.
 *
 * Provides:
 *  - Unified navigation
 *  - Smart element interactions with logging
 *  - Assertion helpers
 *  - Screenshot capture
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Abstract ──────────────────────────────────────────────────────────────

  /** Each page must declare its own path for navigation. */
  abstract get pageUrl(): string;

  /** Each page must expose a stable element to confirm it is loaded. */
  abstract get pageReadyLocator(): Locator;

  // ─── Navigation ───────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    Logger.step(`Navigating to: ${this.pageUrl}`);
    await this.page.goto(this.pageUrl);
    await this.waitForPageReady();
  }

  async waitForPageReady(timeout = 15_000): Promise<void> {
    await this.pageReadyLocator.waitFor({ state: 'visible', timeout });
    Logger.debug(`Page ready: ${this.pageUrl}`);
  }

  async reload(): Promise<void> {
    Logger.step('Reloading page');
    await this.page.reload();
    await this.waitForPageReady();
  }

  async goBack(): Promise<void> {
    Logger.step('Navigating back');
    await this.page.goBack();
  }

  // ─── Interaction Wrappers ─────────────────────────────────────────────────

  protected async click(locator: Locator, label: string): Promise<void> {
    Logger.step(`Clicking: ${label}`);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  protected async fill(locator: Locator, value: string, label: string): Promise<void> {
    Logger.step(`Filling "${label}" with: ${value}`);
    await locator.scrollIntoViewIfNeeded();
    await locator.clear();
    await locator.fill(value);
  }

  protected async selectOption(
    locator: Locator,
    value: string,
    label: string
  ): Promise<void> {
    Logger.step(`Selecting option "${value}" in: ${label}`);
    await locator.selectOption(value);
  }

  protected async check(locator: Locator, label: string): Promise<void> {
    Logger.step(`Checking: ${label}`);
    await locator.check();
  }

  protected async hover(locator: Locator, label: string): Promise<void> {
    Logger.step(`Hovering: ${label}`);
    await locator.hover();
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  protected async getValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertPageTitle(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
    Logger.info(`✅ Page title matches: "${expected}"`);
  }

  async assertUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
    Logger.info(`✅ URL matches: ${pattern}`);
  }

  async assertVisible(locator: Locator, label: string): Promise<void> {
    await expect(locator, `Expected "${label}" to be visible`).toBeVisible();
    Logger.info(`✅ Visible: ${label}`);
  }

  async assertHidden(locator: Locator, label: string): Promise<void> {
    await expect(locator, `Expected "${label}" to be hidden`).toBeHidden();
    Logger.info(`✅ Hidden: ${label}`);
  }

  async assertText(locator: Locator, expected: string, label: string): Promise<void> {
    await expect(locator, `Expected "${label}" to have text`).toHaveText(expected);
    Logger.info(`✅ Text matches on "${label}": "${expected}"`);
  }

  async assertContainsText(
    locator: Locator,
    partial: string,
    label: string
  ): Promise<void> {
    await expect(locator, `Expected "${label}" to contain text`).toContainText(partial);
    Logger.info(`✅ Contains text on "${label}": "${partial}"`);
  }

  async assertEnabled(locator: Locator, label: string): Promise<void> {
    await expect(locator, `Expected "${label}" to be enabled`).toBeEnabled();
    Logger.info(`✅ Enabled: ${label}`);
  }

  async assertDisabled(locator: Locator, label: string): Promise<void> {
    await expect(locator, `Expected "${label}" to be disabled`).toBeDisabled();
    Logger.info(`✅ Disabled: ${label}`);
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    await waitForNetworkIdle(this.page, timeout);
  }

  async screenshot(name: string): Promise<Buffer> {
    return takeScreenshot(this.page, name);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /** Dismiss any alert/confirm dialogs automatically. */
  async acceptDialog(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
  }
}
