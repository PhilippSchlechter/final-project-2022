import { NextApiRequest, NextApiResponse } from 'next';
import { createBook, getBooks } from '../../../database/books';
import { getValidSessionByToken } from '../../../database/sessions';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  console.log('session is passed', request.cookies.sessionToken);

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

    // Check all the information to create the animal exists
    if (!(author && title)) {
      return response
        .status(400)
        .json({ message: 'property author or title missing' });
    }

    // TODO: add type checking to the api

    // Create the animal using the database util function
    const newBook = await createBook(author, title);

    // response with the new created book
    return response.status(200).json(newBook);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
