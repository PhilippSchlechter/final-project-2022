import { css } from '@emotion/react';
import Link from 'next/link';

const navStyles = css`
  border-radius: 5px;
  margin: 45px 120px;
  padding: 30px;
  display: flex;

  a {
    text-decoration: none;
    color: black;
  }

  > a + a {
    margin-left: 50px;
  }
  > div {
    margin-right: auto;
    display: flex;
    gap: 100px;
  }
`;

function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  return (
    <header className="font-semibold">
      <nav css={navStyles}>
        <div>
          <Link href="/"> Home</Link>
          {/* <Link href={`/profile/${props.user?.username}`}>Profile</Link> */}
          <Link href="/search">Search</Link>
          <Link href="/private-profile">My Bookshelf</Link>
        </div>
        {props.user && props.user.username}
        {props.user ? (
          <Anchor
            css={css`
              margin-left: 20px;
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
