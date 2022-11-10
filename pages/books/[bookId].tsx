import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Book, getBookById } from '../../database/books';
import { getUserBySessionToken, User } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const bookStyles = css`
  height: 1000px;
  width: 650px;
  border-radius: 15px;
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

type Props = {
  book: Book;
  error: string;
  /* user?: User; */
};

export default function SingleBook(props: Props) {
  const [comment, setComment] = useState(props.book.comment);
  const [commentOnEditInput, setCommentOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Book not found</title>
          <meta name="description" content="Book not found" />
        </Head>
        <h1>{props.error}</h1>
      </div>
    );
  }

  async function createBookCommentFromApi(id: number) {
    const response = await fetch(`/api/books/${id}template`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentOnEditInput,
        /* id: props.user?.id, */
      }),
    });
    const bookCommentFromApi = (await response.json()) as Book;

    /* setComment(bookCommentFromApi); */
  }
  const isCommentOnEdit = onEditId === props.book.id;

  console.log('comment', props.book.comment);

  return (
    <div>
      <Head>
        <title>Book templates</title>
        <meta name="description" content="Book template" />
      </Head>
      <div css={bookStyles}>
        <h1>{props.book.title}</h1>
        <h2>{props.book.author}</h2>
        <br />
        <br />
        <br />
        <h3>Description</h3>
        <div>{props.book.comment}</div>
        <input
          value={isCommentOnEdit ? commentOnEditInput : props.book.comment}
          disabled={!isCommentOnEdit}
          onChange={(event) => {
            setCommentOnEditInput(event.currentTarget.value);
          }}
        />
        {!isCommentOnEdit ? (
          <button
            onClick={() => {
              setOnEditId(props.book.id);
              setCommentOnEditInput(props.book.comment);
            }}
          >
            edit
          </button>
        ) : (
          <button
            onClick={async () => {
              setOnEditId(undefined);
              await createBookCommentFromApi(props.book.id);
            }}
          >
            save
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the book ID from the URL
  const bookId = parseIntFromContextQuery(context.query.bookId);
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/',
        permanent: false,
      },
    };
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

  if (typeof foundBook === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Book not found',
      },
    };
  }
  if (user.id !== foundBook.userId) {
    return {
      redirect: {
        destination: '/login?returnTo=/',
        permanent: false,
      },
    };
  }
  /*  console.log('userId', user.id); */

  return {
    props: {
      book: foundBook,
      user: user,
    },
  };
}
