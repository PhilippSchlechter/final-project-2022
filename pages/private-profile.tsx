import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { Book, getBooksByUserId } from '../database/books';
import { getValidSessionByToken } from '../database/sessions';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  user: User;
  books: Book[];
  refreshUserProfile: () => Promise<void>;
  errors: { message: string }[];
};

const inputDisplayStyles = css`
  margin-left: 5px;
  margin-top: 3px;
  border-radius: 4px;

  border: 1px solid #ccc;
`;

const bookListStyles = css`
  border: 2px solid #5a5858;
  border-radius: 7px;
  width: 1000px;
  height: 700px;
  margin: 0 auto;
  padding: 20px 0 0 200px;
`;

const topContainerStyles = css`
  display: flex;
  justify-content: space-evenly;
  border-bottom: solid 2px black;
  margin-left: 450px;
  margin-right: 450px;
  margin-bottom: 100px;
  margin-top: 40px;
  h1 {
    margin-right: 190px;
  }
  img {
    margin-right: 30px;
  }
`;
const imageStyles = css`
  margin-top: 50px;
`;
const inputContainerStyles = css`
  margin-left: 750px;
  margin-bottom: 40px;
`;

const deleteStyles = css`
  padding: 20px 50px 30px 50px;
`;

export default function UserProfile(props: Props) {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>(props.books);
  const [authorInput, setAuthorInput] = useState('');
  const [titleInput, setTitleInput] = useState('');

  const [authorOnEditInput, setAuthorOnEditInput] = useState('');
  const [titleOnEditInput, setTitleOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  /* if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  } */

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
        id: props.user.id,
      }),
    });
    const bookFromApi = (await response.json()) as Book;

    const newState = [...books, bookFromApi];

    setBooks(newState);
  }

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
        <title>My Bookshelf</title>
        <meta name="description" content="Private bookshelf of the user" />
      </Head>
      <div css={topContainerStyles}>
        <h1>{props.user.username}'s bookshelf</h1>

        <Image
          src="/1-bookshelf.png"
          alt=""
          width="200"
          height="200"
          css={imageStyles}
        />
      </div>

      <div css={inputContainerStyles}>
        <p className="text-xl">Add your books:</p>
        <label id="Author">
          <br />
          <input
            className="border-slate-400 rounded
            font-sans
            placeholder:text-slate-500 bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
            placeholder="Author"
            value={authorInput}
            onChange={(event) => {
              setAuthorInput(event.currentTarget.value);
            }}
          />
        </label>
        <br />

        <label id="Title">
          <br />
          <input
            className="border-slate-400 rounded placeholder:font-sans
            placeholder:text-slate-500 bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
            placeholder="Title"
            value={titleInput}
            onChange={(event) => {
              setTitleInput(event.currentTarget.value);
            }}
          />
        </label>
        <button
          className="btn"
          onClick={async () => {
            await createBookFromApi();
          }}
        >
          add
        </button>
      </div>

      <br />
      <br />
      <br />
      <div
        className="border-slate-700 shadow-lg display: block bg-[#d0a3bf46] "
        css={bookListStyles}
      >
        {/* <p className="text-xl">Author - Title</p> */}
        {books.map((book) => {
          const isBookOnEdit = onEditId === book.id;

          return (
            <Fragment key={book.id}>
              <div className="py-2 mt-3">
                <input
                  css={inputDisplayStyles}
                  className="border-slate-400 rounded
            font-sans
             bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
                  value={isBookOnEdit ? authorOnEditInput : book.author}
                  disabled={!isBookOnEdit}
                  onChange={(event) => {
                    setAuthorOnEditInput(event.currentTarget.value);
                  }}
                />
                <input
                  className="border-slate-400 rounded
                font-sans
                 bg-white border py-2 pl-7 pr-3 shadow-sm focus:outline-none focus:border-black-500 focus:ring-black-500 focus:ring-1 sm:text-sm"
                  css={inputDisplayStyles}
                  value={isBookOnEdit ? titleOnEditInput : book.title}
                  disabled={!isBookOnEdit}
                  onChange={(event) => {
                    setTitleOnEditInput(event.currentTarget.value);
                  }}
                />

                <input
                  type="checkbox"
                  name="options"
                  value=""
                  data-testid="options"
                  className="peer text-red-600 bg-red-500"
                />

                <button
                  className="btn invisible peer-checked:visible"
                  onClick={() => deleteBookFromApiById(book.id)}
                >
                  delete
                </button>
                {!isBookOnEdit ? (
                  <button
                    className="btn invisible peer-checked:visible"
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
                    className="btn"
                    onClick={async () => {
                      setOnEditId(undefined);
                      await updateBookFromApiById(book.id);
                    }}
                  >
                    save
                  </button>
                )}
                <Link
                  className="invisible peer-checked:visible"
                  href={`/books/${book.id}`}
                >
                  <button className="btn py-1">template ➜</button>
                </Link>
                <br />
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="my-24 mx-8 shadow-md border-solid border-l-0 border-r-0 border-b-2 border-t-0" />
      <div css={deleteStyles}>
        Delete Account:
        <button
          className="btn"
          onClick={() => deleteUserFromApiById(props.user.id)}
        >
          delete profile
        </button>
      </div>
    </>
  );
}

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
