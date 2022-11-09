import { Book } from './books';
import { sql } from './connect';
import { User } from './users';

export type UserBook = {
  user_id: number;
  book_id: number;
};

/* export async function createBookByUser(userId: User['id'], bookId: Book['id']) {
  const [userBook] = await sql<UserBook[]>`
    INSERT INTO user_books
      (book_id, user_id)
    VALUES
      (${bookId}, ${userId})
    RETURNING *
  `;
  return userBook;
} */

export async function createBookByUserId(
  author: string,
  title: string,
  userId: User['id'],
) {
  const [userBook] = await sql<Book[]>`
    INSERT INTO books
      (author, title, user_id)
    VALUES
      (${author}, ${title}, ${userId})
    RETURNING *
  `;
  return userBook;
}
