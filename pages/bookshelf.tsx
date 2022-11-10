import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Book } from '../database/books';
import { getValidSessionByToken } from '../database/sessions';

type Props = {
  errors: { message: string }[];
};

const inputDisplayStyles = css`
  background-color: white;
  margin-left: 5px;
  margin-top: 3px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI';
  color: black;
`;
const buttonStyles = css`
  background-color: white;
  margin: 3px;
  border-radius: 4px;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI';
  color: black;
`;

const bookListStyles = css`
  border: 1px solid #ccc;
  border-radius: 7px;
  width: auto;
  height: 400px;
  margin: 0 auto;
  padding: 20px 0 0 200px;
`;
/* const createBookStyles = css`
  padding: 20px 0 0 200px;
`; */

const h1Styles = css`
  padding: 20px 0 30px 350px;
`;
export default function Hi() {
  return <div>df</div>;
}
/* export default function BooksAdmin(props: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [titleInput, setTitleInput] = useState('');

  const [authorOnEditInput, setAuthorOnEditInput] = useState('');
  const [titleOnEditInput, setTitleOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  async function getBooksFromApi() {
    const response = await fetch('/api/books');
    const booksFromApi = await response.json();

    setBooks(booksFromApi);
  }

  async function createBookFromApi() {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        author: authorInput,
        title: titleInput,
      }),
    });
    const bookFromApi = (await response.json()) as Book;

    // TODO handle the error when book from Api is undefined
    // you can check if bookFromApi contains an error and display the error in the front end

    const newState = [...books, bookFromApi];

    setBooks(newState);
  }
  // check body !!!!!
  async function deleteBookFromApiById(id: number) {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    });
    const deletedBook = (await response.json()) as Book;

    const filteredBooks = books.filter((book) => {
      return book.id !== deletedBook.id;
    });

    setBooks(filteredBooks);
  }

  async function updateBookFromApiById(id: number) {
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        author: authorOnEditInput,
        title: titleOnEditInput,
      }),
    });
    const updatedBookFromApi = (await response.json()) as Book;

    // TODO handle the error when book from api is undefined
    // you can check if bookFromApi contains an error and display the error in the front end

    const newState = books.map((book) => {
      if (book.id === updatedBookFromApi.id) {
        return updatedBookFromApi;
      } else {
        return book;
      }
    });

    setBooks(newState);
  }

  useEffect(() => {
    getBooksFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  if ('errors' in props) {
    return (
      <div>
        {props.errors.map((error) => {
          return <div key={error.message}>{error.message}</div>;
        })}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Bookshelf Admin</title>
        <meta name="description" content="Bookshelf Admin" />
      </Head>

      <h1 css={h1Styles}>Bookshelf</h1>
      <div>
        <label>
          Author
          <br />
          <input
            css={inputDisplayStyles}
            value={authorInput}
            onChange={(event) => {
              setAuthorInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />

        <label>
          Title
          <br />
          <input
            css={inputDisplayStyles}
            value={titleInput}
            onChange={(event) => {
              setTitleInput(event.currentTarget.value);
            }}
          />
        </label>
        <button
          css={buttonStyles}
          onClick={async () => {
            await createBookFromApi();
          }}
        >
          create book
        </button>
      </div>
      <br />
      <br />
      <br />
      <div css={bookListStyles}>
        {books.map((book) => {
          const isBookOnEdit = onEditId === book.id;

          return (
            <Fragment key={book.id}>
              <input
                css={inputDisplayStyles}
                value={isBookOnEdit ? authorOnEditInput : book.author}
                disabled={!isBookOnEdit}
                onChange={(event) => {
                  setAuthorOnEditInput(event.currentTarget.value);
                }}
              />
              <input
                css={inputDisplayStyles}
                value={isBookOnEdit ? titleOnEditInput : book.title}
                disabled={!isBookOnEdit}
                onChange={(event) => {
                  setTitleOnEditInput(event.currentTarget.value);
                }}
              />

              <button
                css={buttonStyles}
                onClick={() => deleteBookFromApiById(book.id)}
              >
                delete
              </button>
              {!isBookOnEdit ? (
                <button
                  css={buttonStyles}
                  onClick={() => {
                    setOnEditId(book.id);
                    setAuthorOnEditInput(book.author);
                    setTitleOnEditInput(book.title);
                  }}
                >
                  edit
                </button>
              ) : (
                <button
                  css={buttonStyles}
                  onClick={async () => {
                    setOnEditId(undefined);
                    await updateBookFromApiById(book.id);
                  }}
                >
                  save
                </button>
              )}
              <Link href={`/books/${book.id}`}>➜</Link>
              <br />
            </Fragment>
          );
        })}
      </div>
    </>
  );
} */

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the username from the URL
  const token = context.req.cookies.sessionToken;

  const session = token && (await getValidSessionByToken(token));

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  /*  const csrfToken = await createTokenFromSecret(session.csrfSecret); */

  return {
    props: {
      /* csrfToken */
    },
  };
}
