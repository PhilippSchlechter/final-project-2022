import { expect, test } from '@playwright/test';

/* end-to-end tests:
    - check various elements (links, h1's, inputs etc.)
    - register as a new test-user, create a book, delete a book, search for a user, view user profile, public and private, delete test-user at the end and return back to home
 */

test('navigation test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('h1')).toHaveText('bookshelf');
  await expect(
    page.locator(`img[alt="bookshelf-logo black and white"]`),
  ).toBeVisible();
  await page.locator('a:has-text("Login")').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(page.locator('h1')).toHaveText('Login');
  await page.locator('button', { hasText: 'Login' }).click();
  await page.locator('a:has-text("sign up here")').click();
  await expect(page).toHaveURL('http://localhost:3000/register');
  await expect(page.locator('h1')).toHaveText('Register');
  await page.locator('a:has-text("Login")').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('navigation test 2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('a:has-text("Register")').click();
  await expect(page).toHaveURL('http://localhost:3000/register');
  await page.getByLabel('username:').fill('usertest');
  await page.getByLabel('password:').fill('endtoendtest');
  await page.locator('button', { hasText: 'Register' }).click();
  await expect(page).toHaveURL('http://localhost:3000/private-profile');
  await page.getByPlaceholder('Author').fill('asd');
  await page.getByPlaceholder('Title').fill('dfg');
  await page.locator('button', { hasText: 'add' }).click();
  await page.getByTestId('options').click();
  await page.getByRole('button', { name: 'delete' }).first().click();
  await page.locator('a:has-text("Search Profiles")').click();
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.locator('h1')).toHaveText('Search Profiles');
  await page.getByTestId('user-search-bar').fill('usertest');
  await page.locator('button', { hasText: 'search' }).click();
  await expect(page).toHaveURL('http://localhost:3000/profile/usertest');
  await page.locator('a:has-text("My Bookshelf")').click();
  await page.getByRole('button', { name: 'delete profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000');
});
