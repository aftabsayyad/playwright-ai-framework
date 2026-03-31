import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth?: string;
  subjects?: string[];
  hobbies?: Array<'Sports' | 'Reading' | 'Music'>;
  address?: string;
  state?: string;
  city?: string;
}

/**
 * FormsPage — DemoQA Practice Form.
 * URL: https://demoqa.com/automation-practice-form
 */
export class FormsPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;
  readonly otherRadio: Locator;
  readonly mobileInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsInput: Locator;
  readonly sportsCheckbox: Locator;
  readonly readingCheckbox: Locator;
  readonly musicCheckbox: Locator;
  readonly addressInput: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly submitButton: Locator;
  readonly submissionModal: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseButton: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput    = page.locator('#firstName');
    this.lastNameInput     = page.locator('#lastName');
    this.emailInput        = page.locator('#userEmail');
    this.maleRadio         = page.locator('label[for="gender-radio-1"]');
    this.femaleRadio       = page.locator('label[for="gender-radio-2"]');
    this.otherRadio        = page.locator('label[for="gender-radio-3"]');
    this.mobileInput       = page.locator('#userNumber');
    this.dateOfBirthInput  = page.locator('#dateOfBirthInput');
    this.subjectsInput     = page.locator('#subjectsInput');
    this.sportsCheckbox    = page.locator('label[for="hobbies-checkbox-1"]');
    this.readingCheckbox   = page.locator('label[for="hobbies-checkbox-2"]');
    this.musicCheckbox     = page.locator('label[for="hobbies-checkbox-3"]');
    this.addressInput      = page.locator('#currentAddress');
    this.stateDropdown     = page.locator('#state');
    this.cityDropdown      = page.locator('#city');
    this.submitButton      = page.locator('#submit');
    this.submissionModal   = page.locator('.modal-content');
    this.modalTitle        = page.locator('#example-modal-sizes-title-lg');
    this.modalCloseButton  = page.locator('#closeLargeModal');
    this.tableRows         = page.locator('.table-responsive tbody tr');
  }

  // ─── BasePage implementation ──────────────────────────────────────────────

  get pageUrl(): string {
    return '/automation-practice-form';
  }

  get pageReadyLocator(): Locator {
    return this.firstNameInput;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  private getGenderLocator(gender: StudentFormData['gender']): Locator {
    const map = {
      Male: this.maleRadio,
      Female: this.femaleRadio,
      Other: this.otherRadio,
    };
    return map[gender];
  }

  async fillStudentForm(data: StudentFormData): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName, 'First Name');
    await this.fill(this.lastNameInput, data.lastName, 'Last Name');
    await this.fill(this.emailInput, data.email, 'Email');
    await this.click(this.getGenderLocator(data.gender), `Gender: ${data.gender}`);
    await this.fill(this.mobileInput, data.mobile, 'Mobile');

    if (data.address) {
      await this.fill(this.addressInput, data.address, 'Address');
    }

    if (data.hobbies) {
      for (const hobby of data.hobbies) {
        await this.selectHobby(hobby);
      }
    }
  }

  async selectHobby(hobby: 'Sports' | 'Reading' | 'Music'): Promise<void> {
    const map = {
      Sports: this.sportsCheckbox,
      Reading: this.readingCheckbox,
      Music: this.musicCheckbox,
    };
    await this.click(map[hobby], `Hobby: ${hobby}`);
  }

  async submitForm(): Promise<void> {
    await this.click(this.submitButton, 'Submit button');
  }

  async closeModal(): Promise<void> {
    await this.click(this.modalCloseButton, 'Modal close button');
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertFormLoaded(): Promise<void> {
    await this.assertVisible(this.firstNameInput, 'First Name');
    await this.assertVisible(this.lastNameInput, 'Last Name');
    await this.assertVisible(this.submitButton, 'Submit button');
  }

  async assertModalVisible(): Promise<void> {
    await this.assertVisible(this.submissionModal, 'Submission modal');
    await this.assertContainsText(
      this.modalTitle,
      'Thanks for submitting the form',
      'Modal title'
    );
  }

  async getSubmittedValueByLabel(label: string): Promise<string> {
    const rows = await this.tableRows.all();
    for (const row of rows) {
      const cells = row.locator('td');
      const labelText = await cells.nth(0).textContent();
      if (labelText?.trim() === label) {
        return (await cells.nth(1).textContent())?.trim() ?? '';
      }
    }
    return '';
  }
}
