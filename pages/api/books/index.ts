import { NextApiRequest, NextApiResponse } from 'next';
import { getBooks, getBooksByUserId } from '../../../database/books';
import { getValidSessionByToken } from '../../../database/sessions';
import { createBookByUserId } from '../../../database/user_books';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  if (request.method === 'GET') {
    /* const books = await getBooksByUserId(session.token); */
    const books = await getBooks();
    return response.status(200).json(books);
  }

  if (request.method === 'POST') {
    if (!request.cookies.sessionToken) {
      response
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    const author = request.body?.author;
    const title = request.body?.title;
    const userId = request.body?.id;

    // Check all the information to create the book exists
    if (!(author && title)) {
      return response
        .status(400)
        .json({ message: 'property author or title missing' });
    }

    // TODO: add type checking to the api
    // Create the book using the database util function

    const newBook = await createBookByUserId(author, title, userId);
    console.log('new Book', newBook);

    // response with the new created book
    return response.status(200).json(newBook);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
