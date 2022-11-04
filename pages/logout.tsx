import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { deleteSessionByToken } from '../database/sessions';

export default function Logout() {
  // return Null so this pages never loads, redirect options down below
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  // delete cookie in database
  if (token) {
    await deleteSessionByToken(token);

    // delete cookie in browser
    context.res.setHeader(
      'Set-Cookie',
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
