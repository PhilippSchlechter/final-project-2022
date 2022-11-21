import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUsernameSearchBar } from '../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const searchFormState = request.body || undefined;

  const query = searchFormState;
  console.log(query);

  if (request.method === 'POST') {
    const users = await getUserByUsernameSearchBar(query);

    response.status(200).json(users);
  }
}

// 2nd version

/* export type SearchResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SearchResponseBody>,
) {
  const searchFormState = request.body.username;

  const query = searchFormState;
  console.log(query);

  if (request.method === 'POST') {
    const users = await getUserByUsernameSearchBar(query);
    if (!users) {
      return response
        .status(401)
        .json({ errors: [{ message: 'user not found' }] });
    }
    response.status(200).json({ user: { username: users.username } });
  }
}
 */
