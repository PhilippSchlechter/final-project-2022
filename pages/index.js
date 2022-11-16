import { css } from '@emotion/react';
import Image from 'next/image';
import SearchForm from '../components/SearchBar';

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
      <h1 className="m-5">bookshelf</h1>
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
      <SearchForm />
    </div>
  );
}
