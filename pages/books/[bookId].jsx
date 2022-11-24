import { css } from '@emotion/react';
/* import { GetServerSidePropsContext } from 'next'; */
import Head from 'next/head';
import { useState } from 'react';
import { getBookById } from '../../database/books';
import { getUserBySessionToken } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const bookStyles = css`
  height: 830px;
  width: 530px;
  border-radius: 15px;
  padding: 20px;
  h1 {
    margin-top: 50px;
    margin-bottom: 50px;
  }
  & + & {
    margin-top: 25px;
  }
`;
const textAreaStyles = css`
  height: 360px;
  width: 430px;
  border: 1px solid black;
  border-radius: 5px;
`;

/* type Props = {
  book: Book;
  error: string;
};
 */
export default function SingleBook(props /* : Props */) {
  const [comment, setComment] = useState(
    /* <Book['comment']> */ props.book.comment,
  );
  const [commentOnEditInput, setCommentOnEditInput] = useState(
    /* <Book['comment']> */ props.book.comment,
  );

  console.log(comment);

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

  async function createBookCommentFromApi(id /* : number */) {
    const response = await fetch(`/api/book/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentOnEditInput,
      }),
    });
    const bookCommentFromApi = await response.json(); /* as Book['comment']; */

    setComment(bookCommentFromApi);
  }

  const isCommentOnEdit = props.book.id;

  return (
    <div>
      <Head>
        <title>My Book Templates</title>
        <meta name="description" content="Book template" />
      </Head>
      <div
        css={bookStyles}
        className="shadow-md flex mx-auto border-solid mt-20 border-slate-700 bg-[#d0a3bf46]"
      >
        <div className="pl-3">
          <h1>{props.book.title}</h1>
          <h2>{props.book.author}</h2>

          <h3 className="mt-32 mb-6">Key Takeaways</h3>

          <div className="flex-row">
            <textarea
              css={textAreaStyles}
              className="font-sans text-sm leading-6 font-semibold bg-[#d0a3bf0f] p-2"
              value={isCommentOnEdit ? commentOnEditInput : props.book.comment}
              disabled={!isCommentOnEdit}
              onChange={(event) => {
                setCommentOnEditInput(event.currentTarget.value);
              }}
            />
            <br />
            {!commentOnEditInput ? (
              <button
                className="rounded-lg text-sm font-medium py-1 px-3 bg-slate-900 text-white hover:bg-slate-700"
                onClick={() => {
                  setCommentOnEditInput(props.book.comment);
                }}
              >
                edit
              </button>
            ) : (
              <button
                className="rounded-lg text-sm font-normal mt-2 py-1 px-3 bg-slate-900 text-white hover:bg-slate-700"
                onClick={async () => {
                  await createBookCommentFromApi(props.book.id);
                }}
              >
                save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(
  context /* : GetServerSidePropsContext */,
) {
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

  return {
    props: {
      book: foundBook,
      user: user,
    },
  };
}
