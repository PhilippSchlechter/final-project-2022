import { sql } from './connect';

export async function getUsers() {
  const users = await sql`
  SELECT * FROM users;
`;
  return users;
}

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<{ id: number; username: string }[]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}
// for the login
export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}
/* joined query */
export async function getUserBySessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<{ id: number; username: string }[]>`

  SELECT /* data (column) I want to receive in response */
    users.id,
    users.username
  FROM  /* tables we use */
    users,
    sessions
  WHERE /* condition */
    sessions.token = ${token} AND
    sessions.user_id = users.id AND
    sessions.expiry_timestamp > now();
  `;

  return user;
}

export async function createUser(username: string, password_hash: string) {
  const [userWithoutPassword] = await sql<{ id: number; username: string }[]>`
  INSERT INTO users
    (username, password_hash)
  VALUES
    (${username}, ${password_hash})
  RETURNING
    id,
    username
  `;
  // ! it is not going to be undefined
  return userWithoutPassword!;
}
