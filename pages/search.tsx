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
      <h1>Search Profiles</h1>
      <SearchForm
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
      />
      <button onClick={() => searchUsersByApi(searchFormState)}>search</button>
      {errors.map((error) => {
        return (
          <p id="hideMeAfter5Seconds" key={error.message}>
            {error.message}
          </p>
        );
      })}
    </div>
  );
}
