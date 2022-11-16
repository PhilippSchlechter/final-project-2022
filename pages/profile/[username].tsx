import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Book, getBooksByUserId } from '../../database/books';
import { getUserByUsername, User } from '../../database/users';

type Props = {
  user?: User;
  books: Book[];
};

const bookStyles = css`
  .hide {
    display: none;
  }

  .myDIV:hover + .hide {
    display: block;
    color: red;
  }
`;

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }

  const books = props.books;
  /* const userBooks = books.map((book) => {
    return (
      <div key="props.books">
        ▪️ {book.author} - {book.title}{' '}
      </div>
    );
  });
 */
  return (
    <>
      <Head>
        <title>Public Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <h1>{props.user.username}'s bookshelf:</h1>

      {/* {userBooks} */}
      <hr />
      <div css={bookStyles}>
        {books.map((book) => {
          return (
            <div key="props.books">
              ▪️ {book.author} - {book.title}{' '}
              <Link href={`/profile/user/${props.user!.username}/${book.id}`}>
                ➜
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the username from the URL
  const username = context.query.username as string;

  const user = await getUserByUsername(username.toLowerCase());
  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  const books = await getBooksByUserId(user.id);

  return {
    props: { user, books },
  };
}
