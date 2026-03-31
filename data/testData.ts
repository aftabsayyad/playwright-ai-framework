import { StudentFormData } from '../pages/FormsPage';

// ─── User Credentials ─────────────────────────────────────────────────────────

export interface UserCredentials {
  username: string;
  password: string;
}

export const VALID_USER: UserCredentials = {
  username: process.env.TEST_USERNAME || 'testUser',
  password: process.env.TEST_PASSWORD || 'Test@1234',
};

export const INVALID_USER: UserCredentials = {
  username: 'invalidUser',
  password: 'WrongPassword123',
};

export const EMPTY_USER: UserCredentials = {
  username: '',
  password: '',
};

// ─── Form Data ────────────────────────────────────────────────────────────────

export const VALID_STUDENT: StudentFormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  gender: 'Female',
  mobile: '9876543210',
  hobbies: ['Reading', 'Music'],
  address: '123 Test Street, Automation City',
};

export const MALE_STUDENT: StudentFormData = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  gender: 'Male',
  mobile: '8765432109',
  hobbies: ['Sports'],
  address: '456 QA Avenue, Test Town',
};

// ─── Text Box Data ────────────────────────────────────────────────────────────

export const TEXT_BOX_DATA = {
  fullName: 'Automation Tester',
  email: 'automation@test.com',
  currentAddress: '100 Playwright Street',
  permanentAddress: '200 Selenium Avenue',
};

// ─── Web Table Data ───────────────────────────────────────────────────────────

export const WEB_TABLE_RECORD = {
  firstName: 'Test',
  lastName: 'Record',
  email: 'test.record@example.com',
  age: '30',
  salary: '75000',
  department: 'QA Engineering',
};

// ─── API Data ─────────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  bookList: '/BookStore/v1/Books',
  accountUser: '/Account/v1/User',
  addBooks: '/BookStore/v1/Books',
} as const;

export const SAMPLE_ISBN = '9781449325862';

// ─── Expected Messages ────────────────────────────────────────────────────────

export const MESSAGES = {
  loginError: 'Invalid username or password!',
  formSubmitted: 'Thanks for submitting the form',
  radioYes: 'Yes',
  radioImpressive: 'Impressive',
} as const;
