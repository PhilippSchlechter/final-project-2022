import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUsernameSearchBar } from '../../database/users';

export type SearchResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SearchResponseBody>,
) {
  if (request.method === 'POST') {
    if (typeof request.body.username !== 'string' || !request.body.username) {
      /* return error */
      return response
        .status(400)
        .json({ errors: [{ message: 'username not provided' }] });
    }

    const searchFormState = request.body.username;

    const query = searchFormState;
    console.log(query);

    const user = await getUserByUsernameSearchBar(query);
    if (!user) {
      return response
        .status(401)
        .json({ errors: [{ message: 'User not found - Please try again' }] });
    }

    response.status(200).json({ user: user });
  }
}
