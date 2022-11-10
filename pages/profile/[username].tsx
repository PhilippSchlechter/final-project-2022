import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Book, getBooksByUserId } from '../../database/books';
import { getUserByUsername, User } from '../../database/users';

type Props = {
  user?: User;
  books: Book[];
};

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
  const userBooks = books.map((book) => {
    return (
      <div key="props.books">
        ▪️ {book.author} - {book.title}{' '}
      </div>
    );
  });

  return (
    <>
      <Head>
        <title>Public Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <h1>{props.user.username}'s Bookshelf:</h1>
      <hr />
      {userBooks}
      <hr />
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
  console.log('books profile test', books);
  return {
    props: { user, books },
  };
}
