import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { Comfortaa } from '@next/font/google';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
});

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  /* useCallback: only updates function if necessary */
  const refreshUserProfile = useCallback(async () => {
    /* this fetch is sending our cookies */
    const profileResponse = await fetch('/api/profiles');
    const profileResponseBody = await profileResponse.json();
    /* if there are errors -> undefined
      else -> user profile */
    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <>
      {/* globalstyle for all pages */}
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: font-sans comfortaa;
          }
          a {
            text-decoration: none;
            color: black;
          }
        `}
      />

      {/* layout component wraped around */}
      <main className={`${comfortaa.variable} font-sans`}>
        <Layout user={user}>
          <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
        </Layout>
      </main>
    </>
  );
}

export default MyApp;
