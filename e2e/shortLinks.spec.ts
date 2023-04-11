import crypto from 'crypto';

import { expect, test } from '@playwright/test';

const fullLink =
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head';

const LOGIN_PATH = '/sys/login';
const PATH = '/';

test.beforeEach(async ({ page }) => {
  await page.goto(LOGIN_PATH);
  await expect(page).toHaveURL(LOGIN_PATH);

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

  await expect(page).toHaveURL(PATH);
});

test('should add a new short link and record view count', async ({
  page,
  context,
}) => {
  await page.getByRole('button', { name: 'add' }).click();

  await page.getByLabel('Full Link').fill(fullLink);
  await page.getByRole('button', { name: 'Add' }).click();

  const origin = await page.evaluate(() => window.location.origin);
  const openInNew = page
    .getByRole('listitem')
    .filter({ hasText: fullLink })
    .getByRole('link', { name: 'Open in new' });
  await expect(openInNew).toHaveText(new RegExp(`^${origin}/`));

  const pagePromise = context.waitForEvent('page');
  await openInNew.click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(fullLink);

  await page.getByRole('button', { name: 'refresh' }).click();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
});

test('should remove a short link', async ({ page }) => {
  await page.getByRole('button', { name: 'add' }).click();
  await page.getByLabel('Full Link').fill(fullLink);
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'delete' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText(fullLink)).toHaveCount(0);
});
