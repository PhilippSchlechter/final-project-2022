import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import { SearchResponseBody } from './api/search';

export default function SearchPage() {
  const [searchFormState, setSearchFormState] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  const searchUsersByApi = async (user: string) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: searchFormState.toLocaleLowerCase(),
      }),
    });
    const foundUsers = (await response.json()) as SearchResponseBody;
    console.log(user);

    if ('errors' in foundUsers) {
      setErrors(foundUsers.errors);
      return console.log('errors', foundUsers.errors);
    }

    await router.push(`/profile/${foundUsers.user.username}`);
  };

  return (
    <div>
      <Head>
        <title>Search Profiles</title>
        <meta name="Search Profiles" content="register new users" />
      </Head>
      <div className="flex">
        <h1 className="mx-auto mb-24 mt-36 text-4xl underline underline-offset-4">
          Search Profiles
        </h1>
      </div>

      <SearchForm
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
      />
      <div className="flex">
        <button
          className="mx-auto mt-3 rounded-lg text-sm font-medium py-1.5 px-4 tracking-wide bg-slate-900 text-white hover:bg-slate-700"
          onClick={() => searchUsersByApi(searchFormState)}
        >
          Search
        </button>
      </div>
      {errors.map((error) => {
        return (
          <div key={error.message} className="flex">
            <p className="mx-auto rounded mt-5" id="hideMeAfter5Seconds">
              {error.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
