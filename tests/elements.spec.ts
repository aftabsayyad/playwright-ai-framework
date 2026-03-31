/**
 * Elements Tests — DemoQA Elements Section
 * Tags: @regression @elements
 *
 * Covers:
 *  - Text Box
 *  - Radio Buttons
 *  - Web Tables (CRUD)
 */

import { test, expect } from '../fixtures/test.fixtures';
import { TEXT_BOX_DATA, WEB_TABLE_RECORD } from '../data/testData';
import { generateEmail } from '../utils/helpers';
import { Logger } from '../utils/logger';
import { allure } from 'allure-playwright';

test.describe('Elements - Text Box @regression @elements', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.navigate();
  });

  test('should display output after filling text box @smoke', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');
    await allure.story('Text Box');
    await allure.severity('normal');

    Logger.testStart('Text Box submission');

    await elementsPage.fillTextBox(
      TEXT_BOX_DATA.fullName,
      TEXT_BOX_DATA.email,
      TEXT_BOX_DATA.currentAddress,
      TEXT_BOX_DATA.permanentAddress
    );

    await elementsPage.assertTextBoxOutput('name', TEXT_BOX_DATA.fullName);
    await elementsPage.assertTextBoxOutput('email', TEXT_BOX_DATA.email);

    Logger.testEnd('Text Box submission', 'PASSED');
  });

  test('should clear and refill text box fields @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');

    // First fill
    await elementsPage.fillTextBox(
      'Initial Name',
      generateEmail(),
      'Initial Address',
      'Initial Perm Address'
    );

    // Re-navigate and fill again
    await elementsPage.navigate();
    await elementsPage.fillTextBox(
      TEXT_BOX_DATA.fullName,
      generateEmail(),
      TEXT_BOX_DATA.currentAddress,
      TEXT_BOX_DATA.permanentAddress
    );

    await elementsPage.assertTextBoxOutput('name', TEXT_BOX_DATA.fullName);
  });
});

test.describe('Elements - Radio Button @regression @elements', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.navigateToRadioButton();
  });

  test('should select Yes radio and show result @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');
    await allure.story('Radio Button');

    await elementsPage.selectYes();
    await elementsPage.assertRadioSelection('Yes');
  });

  test('should select Impressive radio and show result @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');
    await allure.story('Radio Button');

    await elementsPage.selectImpressive();
    await elementsPage.assertRadioSelection('Impressive');
  });

  test('should have No radio button disabled @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');

    const noRadioInput = elementsPage.page.locator('#noRadio');
    await expect(noRadioInput).toBeDisabled();
  });

  test('should deselect previous selection when new radio is clicked @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');

    await elementsPage.selectYes();
    await elementsPage.assertRadioSelection('Yes');

    await elementsPage.selectImpressive();
    await elementsPage.assertRadioSelection('Impressive');

    // Yes should no longer be checked
    const yesInput = elementsPage.page.locator('#yesRadio');
    await expect(yesInput).not.toBeChecked();
  });
});

test.describe('Elements - Web Tables @regression @elements', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.navigateToWebTables();
  });

  test('should load web tables page with pre-existing data @smoke', async ({
    page,
  }) => {
    await allure.suite('Elements');
    await allure.story('Web Tables');

    // Pre-existing records should be visible
    const rows = page.locator('.rt-tr-group');
    await expect(rows.first()).toBeVisible();
  });

  test('should add a new record to the web table @regression', async ({
    elementsPage,
  }) => {
    await allure.suite('Elements');
    await allure.story('Web Tables - Add Record');
    await allure.severity('critical');

    Logger.testStart('Web table - add record');

    await elementsPage.addWebTableRecord(
      WEB_TABLE_RECORD.firstName,
      WEB_TABLE_RECORD.lastName,
      generateEmail('webtable'),
      WEB_TABLE_RECORD.age,
      WEB_TABLE_RECORD.salary,
      WEB_TABLE_RECORD.department
    );

    // Search for the newly added record
    await elementsPage.searchWebTable(WEB_TABLE_RECORD.firstName);

    const firstNameCell = elementsPage.page.locator('.rt-td').filter({
      hasText: WEB_TABLE_RECORD.firstName,
    });
    await expect(firstNameCell.first()).toBeVisible();

    Logger.testEnd('Web table - add record', 'PASSED');
  });

  test('should search and filter records @regression', async ({ elementsPage }) => {
    await allure.suite('Elements');
    await allure.story('Web Tables - Search');

    // Search for a known pre-existing name
    await elementsPage.searchWebTable('Cierra');

    const visibleRows = elementsPage.page.locator(
      '.rt-tr-group:not(.-padRow)'
    );
    const count = await visibleRows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
