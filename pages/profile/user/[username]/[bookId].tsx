import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Book, getBookById } from '../../../../database/books';
import { getUserByUsername, User } from '../../../../database/users';
import { parseIntFromContextQuery } from '../../../../utils/contextQuery';

type Props = {
  user?: User;
  book: Book;
};

const bookStyles = css`
  height: 1000px;
  width: 650px;
  border-radius: 15px;
  background-color: #fbf5f888;
  border: 2px solid #ccc;
  padding: 20px;
  h1 {
    margin-top: 50px;
    margin-bottom: 50px;
  }
  & + & {
    margin-top: 25px;
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
  const nameToUpperCase = props.user.username;
  const nameToUpperCase2 =
    nameToUpperCase.charAt(0).toUpperCase() + nameToUpperCase.slice(1);

  return (
    <>
      <Head>
        <title>{nameToUpperCase2}'s Bookshelf</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div css={bookStyles} className="shadow-md">
        <h1>{props.book.title}</h1>
        <h2>{props.book.author}</h2>
        <br />
        <br />
        <br />
        <h3>Key Takeaways</h3>
        <p>{props.book.comment}</p>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the username from the URL
  const username = context.query.username as string;
  const bookId = parseIntFromContextQuery(context.query.bookId);

  const user = await getUserByUsername(username.toLowerCase());
  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  if (typeof bookId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Book not found',
      },
    };
  }

  const foundBook = await getBookById(bookId);
  console.log('foundBook', foundBook);

  if (typeof foundBook === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Book not found',
      },
    };
  }

  return {
    props: {
      user: user,
      book: foundBook,
    },
  };
}
