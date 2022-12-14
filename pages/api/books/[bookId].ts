import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteBookById,
  getBookByIdAndValidSessionToken,
  updateBookById,
} from '../../../database/books';
import { getValidSessionByToken } from '../../../database/sessions';

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

  const bookId = Number(request.query.bookId);

  // check if the id is a number
  if (!bookId) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'GET') {
    // TODO add an example of a query that requires session token validation
    const book = await getBookByIdAndValidSessionToken(
      bookId,
      request.cookies.sessionToken,
    );

    // check if book exists on the database
    if (!book) {
      return response
        .status(404)
        .json({ message: 'Not a valid Id or not a valid session token' });
    }

    return response.status(200).json(book);
  }

  if (request.method === 'PUT') {
    // NOT getting the id from the body since is already on the query
    const author = request.body?.author;
    const title = request.body?.title;
    /* const comment = request.body?.comment;

    console.log('comment', comment); */

    // Check all the information to create the book
    if (!(author && title)) {
      return response
        .status(400)
        .json({ message: 'property author or title missing' });
    }

    // Create the book using the database util function
    const newBook = await updateBookById(bookId, author, title);

    if (!newBook) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created book
    return response.status(200).json(newBook);
  }

  if (request.method === 'DELETE') {
    const deletedBook = await deleteBookById(bookId);

    if (!deletedBook) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    console.log(deletedBook);

    return response.status(200).json(deletedBook);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
