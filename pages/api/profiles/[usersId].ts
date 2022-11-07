import { NextApiRequest, NextApiResponse } from 'next';
import { getValidSessionByToken } from '../../../database/sessions';
import { deleteUserById } from '../../../database/users';

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
  console.log(request.query.userId);
  /* const userId = Number(request.query.userId); */
  const body = JSON.parse(request.body);
  // check if the id is a number
  if (!body) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'DELETE') {
    const deletedUser = await deleteUserById(body.id);

    if (!deletedUser) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedUser);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
