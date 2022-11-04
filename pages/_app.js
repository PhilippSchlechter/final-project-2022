import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  /* useCallback: only updates function if necessary */
  const refreshUserProfile = useCallback(async () => {
    /* this fetch is sending our cookies */
    const profileResponse = await fetch('/api/profile');
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
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
          }
          a {
            text-decoration: none;
            color: black;
          }
        `}
      />

      {/* layout component wraped around */}
      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </>
  );
}

export default MyApp;
