import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';

const topContainerStyles = css`
  display: flex;
  justify-content: space-evenly;
  border-bottom: solid 3px black;
  margin-left: 270px;
  margin-right: 270px;
  margin-bottom: 100px;
  margin-top: 240px;
  h1 {
    margin-right: 190px;
    margin-bottom: 30px;
  }
  img {
    margin-right: 30px;
  }
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="Homepage" content="Landing page bookshelf app" />
      </Head>
      <div css={topContainerStyles}>
        <h1 className="text-6xl">bookshelves </h1>

        <Image
          src="/1-bookshelf.png"
          alt="bookshelf-logo black and white"
          width="240"
          height="240"
        />
      </div>
      {/* <h2>Create your own bookshelf</h2> */}
    </div>
  );
}
