/**
 * API Validation Tests — DemoQA BookStore API
 * Tags: @api @regression
 *
 * Uses Playwright's built-in request context — no browser needed.
 */

import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, SAMPLE_ISBN } from '../../data/testData';
import { Logger } from '../../utils/logger';
import { assertApiStatus } from '../../utils/helpers';
import { allure } from 'allure-playwright';

const BASE_URL = process.env.BASE_URL ?? 'https://demoqa.com';

interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

interface BookListResponse {
  books: Book[];
}

test.describe('BookStore API Validation @api @regression', () => {

  test('GET /Books — should return 200 with a list of books @api @smoke', async ({ request }) => {
    await allure.suite('API');
    await allure.story('Book List');
    await allure.severity('critical');

    Logger.testStart('GET /Books');
    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    assertApiStatus(response.status(), 200, 'GET /Books');

    const body: BookListResponse = await response.json();
    expect(body).toHaveProperty('books');
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
    Logger.info(`📚 Books returned: ${body.books.length}`);
    Logger.testEnd('GET /Books', 'PASSED');
  });

  test('GET /Books — response should contain required book fields @api', async ({ request }) => {
    await allure.suite('API');
    await allure.story('Book Schema Validation');

    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    const body: BookListResponse = await response.json();
    const firstBook = body.books[0];

    const requiredFields: (keyof Book)[] = ['isbn', 'title', 'author', 'publisher', 'pages', 'description', 'website'];
    for (const field of requiredFields) {
      expect(firstBook, `Book should have field: ${field}`).toHaveProperty(field);
    }
    Logger.info(`✅ Schema validated for book: "${firstBook.title}"`);
  });

  test('GET /Books — response Content-Type should be application/json @api', async ({ request }) => {
    await allure.suite('API');
    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('GET /Books — each book should have a positive page count @api', async ({ request }) => {
    await allure.suite('API');
    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    const body: BookListResponse = await response.json();
    for (const book of body.books) {
      expect(book.pages).toBeGreaterThan(0);
    }
  });

  test('GET /Books — response time should be under 3 seconds @api', async ({ request }) => {
    await allure.suite('API');
    await allure.story('Performance');

    const start = Date.now();
    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    const elapsed = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(3000);
    Logger.info(`⏱ Response time: ${elapsed}ms`);
  });

  test('POST /User — should return 400 for invalid payload @api', async ({ request }) => {
    await allure.suite('API');
    await allure.story('Error Handling');

    const response = await request.post(`${BASE_URL}${API_ENDPOINTS.accountUser}`, {
      data: { userName: '', password: 'weak' },
    });
    expect([400, 406]).toContain(response.status());
    Logger.info(`✅ Invalid registration returns ${response.status()} as expected`);
  });

  test('GET /Books — can find a book by ISBN @api', async ({ request }) => {
    await allure.suite('API');
    await allure.story('Search by ISBN');

    const response = await request.get(`${BASE_URL}${API_ENDPOINTS.bookList}`);
    const body: BookListResponse = await response.json();
    const found = body.books.find((b) => b.isbn === SAMPLE_ISBN);
    expect(found).toBeDefined();
    Logger.info(`📖 Found book: ${found?.title}`);
  });
});
