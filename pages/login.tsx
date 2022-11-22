import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/login';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });
    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }
    // return to = redirects with query
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (so no https: is allowed)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }
    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/private-profile`);
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="login users" />
      </Head>
      <h1>Login</h1>
      {errors.map((error) => {
        return (
          <p
            css={css`
              background-color: #df3939;
              border-radius: 3px;
              color: white;
              padding: 5px;
              margin: 10px 0 10px 0;
            `}
            key={error.message}
          >
            ERROR: {error.message}
          </p>
        );
      })}

      <label>
        username:
        <div>
          <input
            className="border-slate-400 rounded placeholder:font-sans comfortaa placeholder:text-slate-400 bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value.toLowerCase());
            }}
          />
        </div>
      </label>
      <br />
      <label>
        password:
        <div>
          <input
            className=" border-slate-400 rounded placeholder:italic placeholder:text-slate-400 bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </div>
      </label>
      <br />
      <button
        onClick={async () => {
          await loginHandler();
        }}
      >
        Login
      </button>
      <p>
        no account yet?
        <Link
          className="pl-1 text-violet-500 hover:text-violet-600 active:text-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          href="/register"
        >
          sign up here
        </Link>
      </p>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
