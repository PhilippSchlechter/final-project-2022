import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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
const topContainerStyles = css`
  display: flex;
  justify-content: space-evenly;
  border-bottom: solid 2px black;
  margin-left: 170px;
  margin-right: 170px;
  margin-bottom: 100px;
  margin-top: 40px;
  h1 {
    margin-right: 190px;
  }
  img {
    margin-right: 30px;
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
        <h1>User not found</h1>
        <Link href="/search">Search for users ➜</Link>
      </>
    );
  }

  const books = props.books;
  const nameToUpperCase = props.user.username;
  const nameToUpperCase2 =
    nameToUpperCase.charAt(0).toUpperCase() + nameToUpperCase.slice(1);

  return (
    <>
      <Head>
        <title>{nameToUpperCase2}'s Bookshelf</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div css={topContainerStyles}>
        <h1>{props.user.username}'s bookshelf</h1>
        <Image src="/1-bookshelf.png" alt="" width="200" height="200" />
      </div>

      <div className="grid px-10 " css={bookStyles}>
        {books.map((book) => {
          return (
            <div
              className=" flex flex-col items-center rounded bg-[#d0a3bf46] first-letter:uppercase py-4 border-solid border-2 mx-96 border-b-0 last-of-type:border-b-2"
              key={`${book}${book.userId}`}
            >
              <span>
                ▪️ {book.author} - {book.title}
                <Link
                  className="ml-1"
                  href={`/profile/user/${props.user!.username}/${book.id}`}
                >
                  ➜
                </Link>
              </span>
            </div>
          );
        })}
      </div>
      {/*  <div className="flex flex-col items-center mx-96 py-3 border-solid border-l-2 border-r-2 border-b-0 border-t-0">
        -
      </div> */}
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
