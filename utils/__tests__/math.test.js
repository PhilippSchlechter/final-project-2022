import { add } from '../math';

test('add two numbers together', () => {
  expect(add(1, 1)).toBe(2);
  expect(add(100, 100)).toBe(200);
  expect(add(1, 1)).toBe(2);
});

// work on playwright test first
// connect ECONNREFUSED ::1:5432 (github actions)
// tests work on localhost
/**
 * @jest-environment node
 */

/* import { createBook, deleteBookById, getBookById } from '../../database/books';
import { sql } from '../../database/connect';
import {
  createUser,
  deleteUserById,
  getUserByUsername,
} from '../../database/users';

test('database test: create, read, delete a user', async () => {
  const username = 'jesttest';
  const password = 'jesttest';
  expect(await getUserByUsername(username)).toBe(undefined);
  const jestTestUser = await createUser(username, password);
  expect(jestTestUser.username).toStrictEqual('jesttest');
  expect(await deleteUserById(jestTestUser.id)).not.toBe(undefined);
  expect(await getUserByUsername(username)).toBe(undefined);
});

test('database test: create, read, delete a book', async () => {
  const title = 'jesttest';
  const author = 'jesttest';
  const id = 110;
  expect(await getBookById(id)).toBe(undefined);
  const testBook = await createBook(title, author);
  expect(testBook.title).toStrictEqual('jesttest');
  expect(testBook.author).toStrictEqual('jesttest');
  expect(await deleteBookById(testBook.id)).not.toBe(undefined);
  expect(await getBookById(id)).toBe(undefined);
  await sql.end();
});
 */
