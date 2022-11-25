import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Book, getBookById } from '../../../../database/books';
import { getUserByUsername, User } from '../../../../database/users';
import { parseIntFromContextQuery } from '../../../../utils/contextQuery';

type Props = {
  user?: User;
  book: Book;
};

const bookStyles = css`
  height: 830px;
  width: 530px;
  border-radius: 15px;
  /* background-color: #fbf5f888; */
  /* border: 2px solid #ccc; */
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
      <Link href={`/profile/${props.user.username}`}>
        <p className="font-semibold text-lg ml-52 mb-5 mt-5 underline underline-offset-4">
          {props.user.username}'s bookshelf
        </p>
      </Link>
      <div
        css={bookStyles}
        className=" flex mx-auto border-solid mt-20 border-slate-700
      shadow-md bg-[#d0a3bf46]"
      >
        <div className="flex-row pl-3">
          <h1>{props.book.title}</h1>
          <h2>{props.book.author}</h2>
          <h3 className="mt-36 mb-8">Key Takeaways</h3>

          <p className="font-sans text-sm leading-6 font-semibold pr-6">
            {props.book.comment}
          </p>
        </div>
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
