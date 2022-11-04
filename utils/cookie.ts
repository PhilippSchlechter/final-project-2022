import cookie from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  // check if we are in production e.g Fly.io
  const isProduction = process.env.NODE_ENV === 'production';

  // 24 hours in seconds
  const maxAge = 60 * 60 * 24;

  // pass name, value and options for the cookie
  return cookie.serialize('sessionToken', token, {
    // for new browsers
    maxAge: maxAge,
    // for internet explorer and old browsers
    expires: new Date(
      Date.now() /** current date in milliseconds */ +
        maxAge * 1000 /** 24  hours in milliseconds */,
    ),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    //
    sameSite: 'lax',
  });
}
