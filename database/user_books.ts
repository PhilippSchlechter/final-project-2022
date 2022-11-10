import { Book } from './books';
import { sql } from './connect';
import { User } from './users';

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
