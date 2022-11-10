import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Book, getBooksByUserId } from '../database/books';
import { getValidSessionByToken } from '../database/sessions';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  user?: User;
  books: Book[];
  refreshUserProfile: () => Promise<void>;
  errors: { message: string }[];
};

// problem with ts undefined
/* type Props = {
  user?: User;
}; */

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
  width: 850px;
  height: 700px;
  margin: 0 auto;
  padding: 20px 0 0 200px;
`;
/* const createBookStyles = css`
  padding: 20px 0 0 200px;
`; */

const h1Styles = css`
  padding: 20px 0 30px 20px;
`;

const deleteStyles = css`
  padding: 20px 50px 30px 350px;
`;

export default function UserProfile(props: Props) {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>(props.books);
  const [authorInput, setAuthorInput] = useState('');
  const [titleInput, setTitleInput] = useState('');

  const [authorOnEditInput, setAuthorOnEditInput] = useState('');
  const [titleOnEditInput, setTitleOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  /* async function getBooksFromApi() {
    const response = await fetch('/api/books');
    const booksFromApi = await response.json();

    setBooks(booksFromApi);
  }
  useEffect(() => {
    getBooksFromApi().catch((err) => {
      console.log(err);
    });
  }, []); */

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

  async function deleteUserFromApiById(id: number) {
    await fetch(`/api/profiles/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
    });
    await props.refreshUserProfile();
    // redirect user to home after deleting profile
    await router.push(`/`);
  }

  // Admin functions down below

  async function createBookFromApi() {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        author: authorInput,
        title: titleInput,
        id: props.user?.id,
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
        <title>Bookshelf</title>
        <meta name="description" content="Private bookshelf of the user" />
      </Head>
      <h1 css={h1Styles}>{props.user.username}'s Bookshelf</h1>

      {/* Admin input down below */}

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
          add book
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

      <Image src="/1-bookshelf.png" alt="" width="200" height="200" />
      <div css={deleteStyles}>
        Delete Account:
        <button
          css={buttonStyles}
          onClick={() => deleteUserFromApiById(props.user!.id)}
        >
          delete
        </button>
      </div>
    </>
  );
}

// delete User by Session Token?

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const session = token && (await getValidSessionByToken(token));
  const user = token && (await getUserBySessionToken(token));
  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/',
        permanent: false,
      },
    };
  }
  const books = await getBooksByUserId(user.id);

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  return {
    props: { user, books },
  };
}
