import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { Book, getBookById } from '../../database/books';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const bookStyles = css`
  height: 1000px;
  width: 650px;
  border-radius: 15px;
  border: 2px solid #ccc;
  padding: 20px;
  h1 {
    margin-top: 50px;
  }
  & + & {
    margin-top: 25px;
  }
`;

type Props =
  | {
      book: Book;
    }
  | {
      error: string;
    };

export default function SingleBook(props: Props) {
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

  return (
    <div>
      <Head>
        <title>
          {props.book.author}, the {props.book.title}
        </title>
        <meta
          name="description"
          content={`${props.book.author} is a ${props.book.title}`}
        />
      </Head>
      <div css={bookStyles}>
        <h1>{props.book.title}</h1>
        <h2>{props.book.author}</h2>
        <h3>Description</h3>
        <h3>Rating</h3>
        <h3>Key Takeaways</h3>
      </div>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  // Retrieve the book ID from the URL
  const bookId = parseIntFromContextQuery(context.query.bookId);

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

  return {
    props: {
      book: foundBook,
    },
  };
}
