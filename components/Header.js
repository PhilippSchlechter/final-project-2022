import { css } from '@emotion/react';
import Link from 'next/link';

const navStyles = css`
  border-radius: 5px;
  margin: 30px 20px;
  padding: 25px;
  display: flex;

  a {
    text-decoration: none;
    color: black;
  }

  > a + a {
    margin-left: 20px;
  }
  > div {
    margin-right: auto;
    display: flex;
    gap: 65px;
  }
`;
/* const iconStyles = css`
  margin-top: 6px;
`; */

function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  return (
    <header>
      <nav css={navStyles}>
        <div>
          {/* <Image
            css={iconStyles}
            src="/1-book-open-variant.png"
            alt="open book icon"
            width="15"
            height="15"
          /> */}
          <Link href="/"> Home</Link>
          <Link href={`/profile/${props.user?.username}`}>Profile</Link>
          <Link href="/search">Search</Link>
          <Link href="/private-profile">My Bookshelf</Link>
        </div>
        {props.user && props.user.username}
        {props.user ? (
          <Anchor
            css={css`
              margin-left: 10px;
            `}
            href="/logout"
          >
            Logout
          </Anchor>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
