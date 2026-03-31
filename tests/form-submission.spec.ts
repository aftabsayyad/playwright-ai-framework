/**
 * Form Submission Tests — DemoQA Practice Form
 * Tags: @regression @forms
 *
 * Covers:
 *  - Page load
 *  - Required field validation
 *  - Full form fill + submission
 *  - Modal confirmation
 *  - Submitted data verification
 */

import { test, expect } from '../fixtures/test.fixtures';
import { VALID_STUDENT, MALE_STUDENT, MESSAGES } from '../data/testData';
import { Logger } from '../utils/logger';
import { generateEmail } from '../utils/helpers';
import { allure } from 'allure-playwright';

test.describe('Practice Form Submission @regression @forms', () => {
  test.beforeEach(async ({ formsPage }) => {
    await formsPage.navigate();
  });

  // ─── Page Load ─────────────────────────────────────────────────────────────

  test('should load the practice form correctly @smoke', async ({ formsPage }) => {
    await allure.suite('Forms');
    await allure.story('Page Load');

    await formsPage.assertFormLoaded();
    await formsPage.assertUrl(/automation-practice-form/);
  });

  // ─── Required Field Validation ─────────────────────────────────────────────

  test('should enforce required fields on submit @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Validation');
    await allure.severity('normal');

    // Try submitting empty form
    await formsPage.submitForm();

    // Required fields (firstName, lastName, mobile, gender) should be invalid
    const firstNameValid = await formsPage.firstNameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(firstNameValid).toBe(false);
  });

  // ─── Full Form Submission ──────────────────────────────────────────────────

  test('should successfully submit form with valid female student data @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Form Submission');
    await allure.severity('critical');

    Logger.testStart('Form submission - Female student');

    const studentData = {
      ...VALID_STUDENT,
      email: generateEmail('jane'),
    };

    await formsPage.fillStudentForm(studentData);
    await formsPage.submitForm();
    await formsPage.assertModalVisible();

    // Verify submitted data in modal table
    const submittedName = await formsPage.getSubmittedValueByLabel('Student Name');
    expect(submittedName).toContain(studentData.firstName);
    expect(submittedName).toContain(studentData.lastName);

    const submittedGender = await formsPage.getSubmittedValueByLabel('Gender');
    expect(submittedGender).toBe('Female');

    Logger.testEnd('Form submission - Female student', 'PASSED');
  });

  test('should successfully submit form with valid male student data @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Form Submission');

    Logger.testStart('Form submission - Male student');

    const studentData = {
      ...MALE_STUDENT,
      email: generateEmail('john'),
    };

    await formsPage.fillStudentForm(studentData);
    await formsPage.submitForm();
    await formsPage.assertModalVisible();

    const submittedGender = await formsPage.getSubmittedValueByLabel('Gender');
    expect(submittedGender).toBe('Male');

    Logger.testEnd('Form submission - Male student', 'PASSED');
  });

  // ─── Modal Interaction ─────────────────────────────────────────────────────

  test('should close submission modal correctly @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Modal');

    await formsPage.fillStudentForm(VALID_STUDENT);
    await formsPage.submitForm();
    await formsPage.assertModalVisible();
    await formsPage.closeModal();
    await formsPage.assertHidden(formsPage.submissionModal, 'Modal');
  });

  // ─── Hobbies Interaction ───────────────────────────────────────────────────

  test('should allow selecting multiple hobbies @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Checkboxes');

    await formsPage.selectHobby('Sports');
    await formsPage.selectHobby('Reading');
    await formsPage.selectHobby('Music');

    // All three checkboxes should be checked
    await expect(formsPage.page.locator('#hobbies-checkbox-1')).toBeChecked();
    await expect(formsPage.page.locator('#hobbies-checkbox-2')).toBeChecked();
    await expect(formsPage.page.locator('#hobbies-checkbox-3')).toBeChecked();
  });

  // ─── Submitted Data Verification ──────────────────────────────────────────

  test('should display correct student name in confirmation modal @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');
    await allure.story('Data Verification');
    await allure.severity('critical');

    const firstName = 'Automation';
    const lastName = 'Tester';

    await formsPage.fillStudentForm({
      firstName,
      lastName,
      email: generateEmail(),
      gender: 'Other',
      mobile: '1234567890',
    });

    await formsPage.submitForm();
    await formsPage.assertModalVisible();

    const name = await formsPage.getSubmittedValueByLabel('Student Name');
    expect(name).toBe(`${firstName} ${lastName}`);
  });

  test('should display correct mobile in confirmation modal @regression', async ({
    formsPage,
  }) => {
    await allure.suite('Forms');

    const mobile = '9988776655';

    await formsPage.fillStudentForm({
      ...VALID_STUDENT,
      mobile,
      email: generateEmail(),
    });

    await formsPage.submitForm();
    await formsPage.assertModalVisible();

    const submittedMobile = await formsPage.getSubmittedValueByLabel('Mobile');
    expect(submittedMobile).toBe(mobile);
  });
});
