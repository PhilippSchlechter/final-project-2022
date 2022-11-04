import { css } from '@emotion/react';
import Image from 'next/image';

const imageStyles = css`
  display: flex;
  justify-content: center;
  margin-top: 150px;
  margin-right: 300px;
`;
const h1Styles = css``;
/* const iconStyles = css``; */

export default function Home() {
  return (
    <div css={imageStyles}>
      <h1 css={h1Styles}>
        {/* <Image
          css={iconStyles}
          src="/1-book-open-variant.png"
          alt="open book icon"
          width="30"
          height="30"
        /> */}
        bookshelf
      </h1>{' '}
      <Image src="/1-bookshelf.png" alt="" width="240" height="240" />
    </div>
  );
}
