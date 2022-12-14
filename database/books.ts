import { sql } from './connect';

export type Book = {
  id: number;
  author: string;
  title: string;
  userId: number;
  comment: string | undefined;
};

export type User = {
  userId: number;
};

// Get all books
export async function getBooks() {
  const books = await sql<Book[]>`
    SELECT * FROM books
  `;
  return books;
}
// Get a single book by userId
export async function getBooksByUserId(userId: number) {
  const books = await sql<Book[]>`
    SELECT
      *
    FROM
      books
    WHERE
      user_id = ${userId}
  `;
  return books;
}

export async function getBookCommentByUserId(userId: number) {
  const books = await sql<Book[]>`
    SELECT
      books.comment
    FROM
      books
    WHERE
      user_id = ${userId}
  `;
  return books;
}

// Get a single book by id
export async function getBookById(id: number) {
  const [book] = await sql<Book[]>`
    SELECT
      *
    FROM
      books
    WHERE
      id = ${id}
  `;
  return book;
}

// Get a single book by id and valid session token
export async function getBookByIdAndValidSessionToken(
  id: number,
  token: string | undefined,
) {
  if (!token) return undefined;
  // STRETCH: Update this adding a role to the users and matching it with the session token
  const [book] = await sql<Book[]>`
    SELECT
      books.*
    FROM
      books,
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
    AND
      books.id = ${id}
  `;
  return book;
}

export async function createBook(author: string, title: string) {
  const [book] = await sql<Book[]>`
    INSERT INTO books
      (author, title)
    VALUES
      (${author}, ${title})
    RETURNING *
  `;
  return book;
}
// create book comment, description for a specific book of yours

export async function createCommentByBookId(id: number, comment: string) {
  const [userBookComment] = await sql<Book[]>`
    UPDATE
      books
    SET
     comment = ${comment}
    WHERE
    id = ${id}
    RETURNING *
  `;
  return userBookComment;
}

export async function updateBookById(
  id: number,
  author: string,
  title: string,
) {
  const [book] = await sql<Book[]>`
    UPDATE
      books
    SET
      author = ${author},
      title = ${title}
    WHERE
      id = ${id}
    RETURNING *
  `;
  return book;
}

export async function deleteBookById(id: number) {
  const [book] = await sql<Book[]>`
    DELETE FROM
      books
    WHERE
      id = ${id}
    RETURNING *
  `;
  return book;
}
