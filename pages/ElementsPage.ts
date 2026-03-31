import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ElementsPage — DemoQA Elements section.
 * Covers: Text Box, Check Box, Radio Button, Web Tables.
 */
export class ElementsPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────

  // Text Box
  readonly textBoxFullNameInput: Locator;
  readonly textBoxEmailInput: Locator;
  readonly textBoxCurrentAddressInput: Locator;
  readonly textBoxPermanentAddressInput: Locator;
  readonly textBoxSubmitButton: Locator;
  readonly textBoxOutput: Locator;

  // Check Box
  readonly checkBoxExpandToggle: Locator;
  readonly homeCheckBox: Locator;
  readonly checkBoxResult: Locator;

  // Radio Button
  readonly yesRadio: Locator;
  readonly impressiveRadio: Locator;
  readonly noRadio: Locator;
  readonly radioResult: Locator;

  // Web Table
  readonly webTableAddButton: Locator;
  readonly webTableSearchBox: Locator;
  readonly webTableRows: Locator;
  readonly webTableFirstNameInput: Locator;
  readonly webTableLastNameInput: Locator;
  readonly webTableEmailInput: Locator;
  readonly webTableAgeInput: Locator;
  readonly webTableSalaryInput: Locator;
  readonly webTableDepartmentInput: Locator;
  readonly webTableSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.textBoxFullNameInput         = page.locator('#userName');
    this.textBoxEmailInput            = page.locator('#userEmail');
    this.textBoxCurrentAddressInput   = page.locator('#currentAddress');
    this.textBoxPermanentAddressInput = page.locator('#permanentAddress');
    this.textBoxSubmitButton          = page.locator('#submit');
    this.textBoxOutput                = page.locator('#output');

    this.checkBoxExpandToggle = page.locator('.rct-collapse.rct-collapse-btn').first();
    this.homeCheckBox         = page.locator('.rct-checkbox').first();
    this.checkBoxResult       = page.locator('.check-box-tree-wrapper + div');

    this.yesRadio         = page.locator('label[for="yesRadio"]');
    this.impressiveRadio  = page.locator('label[for="impressiveRadio"]');
    this.noRadio          = page.locator('label[for="noRadio"]');
    this.radioResult      = page.locator('.mt-3');

    this.webTableAddButton        = page.locator('#addNewRecordButton');
    this.webTableSearchBox        = page.locator('#searchBox');
    this.webTableRows             = page.locator('.rt-tr-group');
    this.webTableFirstNameInput   = page.locator('#firstName');
    this.webTableLastNameInput    = page.locator('#lastName');
    this.webTableEmailInput       = page.locator('#userEmail');
    this.webTableAgeInput         = page.locator('#age');
    this.webTableSalaryInput      = page.locator('#salary');
    this.webTableDepartmentInput  = page.locator('#department');
    this.webTableSubmitButton     = page.locator('#submit');
  }

  // ─── BasePage implementation ──────────────────────────────────────────────

  get pageUrl(): string {
    return '/text-box';
  }

  get pageReadyLocator(): Locator {
    return this.textBoxFullNameInput;
  }

  // ─── Text Box Actions ─────────────────────────────────────────────────────

  async fillTextBox(
    fullName: string,
    email: string,
    currentAddress: string,
    permanentAddress: string
  ): Promise<void> {
    await this.fill(this.textBoxFullNameInput, fullName, 'Full Name');
    await this.fill(this.textBoxEmailInput, email, 'Email');
    await this.fill(this.textBoxCurrentAddressInput, currentAddress, 'Current Address');
    await this.fill(
      this.textBoxPermanentAddressInput,
      permanentAddress,
      'Permanent Address'
    );
    await this.click(this.textBoxSubmitButton, 'Submit');
  }

  async assertTextBoxOutput(field: string, expected: string): Promise<void> {
    const outputLocator = this.page.locator(`#output #${field}`);
    await this.assertContainsText(outputLocator, expected, `TextBox output: ${field}`);
  }

  // ─── Radio Button Actions ─────────────────────────────────────────────────

  async navigateToRadioButton(): Promise<void> {
    await this.page.goto('/radio-button');
  }

  async selectYes(): Promise<void> {
    await this.click(this.yesRadio, 'Yes radio');
  }

  async selectImpressive(): Promise<void> {
    await this.click(this.impressiveRadio, 'Impressive radio');
  }

  async assertRadioSelection(expected: string): Promise<void> {
    await this.assertContainsText(this.radioResult, expected, 'Radio result');
  }

  // ─── Web Table Actions ────────────────────────────────────────────────────

  async navigateToWebTables(): Promise<void> {
    await this.page.goto('/webtables');
  }

  async addWebTableRecord(
    firstName: string,
    lastName: string,
    email: string,
    age: string,
    salary: string,
    department: string
  ): Promise<void> {
    await this.click(this.webTableAddButton, 'Add New Record');
    await this.fill(this.webTableFirstNameInput, firstName, 'First Name');
    await this.fill(this.webTableLastNameInput, lastName, 'Last Name');
    await this.fill(this.webTableEmailInput, email, 'Email');
    await this.fill(this.webTableAgeInput, age, 'Age');
    await this.fill(this.webTableSalaryInput, salary, 'Salary');
    await this.fill(this.webTableDepartmentInput, department, 'Department');
    await this.click(this.webTableSubmitButton, 'Submit record');
  }

  async searchWebTable(term: string): Promise<void> {
    await this.fill(this.webTableSearchBox, term, 'Search box');
  }
}
