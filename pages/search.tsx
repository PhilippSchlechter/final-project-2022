import { css } from '@emotion/react';
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
      <SearchForm
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
      />
      {errors.map((error) => {
        return (
          <p
            css={css`
              border: 2px solid;
              border-color: #eb5b5b;
              padding: 0.5rem;
            `}
            key={error.message}
          >
            {error.message}
          </p>
        );
      })}
      <button onClick={() => searchUsersByApi(searchFormState)}>search</button>
    </div>
  );
}
