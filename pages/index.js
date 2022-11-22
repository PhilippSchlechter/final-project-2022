import Head from 'next/head';
import Image from 'next/image';

/* const imageStyles = css`
  display: flex;
  justify-content: center;
  margin-top: 150px;
  margin-right: 300px;
`; */

/* const iconStyles = css``; */

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="Homepage" content="Landing page bookshelf app" />
      </Head>
      <h1 className="m-5">bookshelves</h1>
      <Image
        src="/1-bookshelf.png"
        alt="bookshelf-logo black and white"
        width="240"
        height="240"
        className=""
      />
      <br />
      <br />
      <br />
    </div>
  );
}
