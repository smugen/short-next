import crypto from 'crypto';

import { expect, test } from '@playwright/test';

const PATH = '/sys/login';

test.beforeEach(async ({ page }) => {
  await page.goto(PATH);
  await expect(page).toHaveURL(PATH);
});

test('switch between sign in and sign up forms', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Sign In' })).toContainText(
    'Sign In',
  );

  await page
    .getByRole('button', { name: 'Do not have an account? Sign Up' })
    .click();
  await expect(page.getByRole('heading', { name: 'Sign Up' })).toContainText(
    'Sign Up',
  );

  await page
    .getByRole('button', { name: 'Already have an account? Sign In' })
    .click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toContainText(
    'Sign In',
  );
});

test('should preserve username email and password inputs', async ({ page }) => {
  const admin = 'admin';
  const password = 'pswd';

  await page.getByLabel('Email Address *').fill(admin);
  await page.getByLabel('Password *').fill(password);

  await page
    .getByRole('button', { name: 'Do not have an account? Sign Up' })
    .click();
  await expect(page.getByLabel('Email Address *')).toHaveValue(admin);
  await expect(page.getByLabel('Password *')).toHaveValue(password);

  await page
    .getByRole('button', { name: 'Already have an account? Sign In' })
    .click();
  await expect(page.getByLabel('Email Address *')).toHaveValue(admin);
  await expect(page.getByLabel('Password *')).toHaveValue(password);
});

test('sign up then sign in', async ({ page }) => {
  const email = `${crypto.randomUUID()}@example.com`;
  const password = 'pswd';

  await page
    .getByRole('button', { name: 'Do not have an account? Sign Up' })
    .click();
  await page.getByLabel('Email Address *').fill(email);
  await page.getByLabel('Password *').fill(password);
  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page.getByRole('heading', { name: 'Sign In' })).toContainText(
    'Sign In',
    { timeout: 10000 },
  );
  await expect(page.getByLabel('Email Address *')).toHaveValue(email);
  await expect(page.getByLabel('Password *')).toHaveValue(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL('/');
});
