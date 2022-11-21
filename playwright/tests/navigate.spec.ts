import { expect, test } from '@playwright/test';

test('navigation test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('h1')).toHaveText('bookshelf');
  await expect(
    page.locator(`img[alt="bookshelf-logo black and white"]`),
  ).toBeVisible();
});
