import { css } from '@emotion/react';
import Head from 'next/head';
import Header from './Header';

const mainStyles = css`
  padding: 20px 20px;
`;

export default function Layout(props) {
  return (
    <>
      <Head>
        <link rel="icon" href="/faviconB.ico" />
      </Head>
      {/* header component for all pages */}
      <Header user={props.user} />
      {/* main styles for all pages */}
      <main css={mainStyles}>{props.children}</main>
    </>
  );
}
