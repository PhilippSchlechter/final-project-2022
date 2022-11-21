import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import SearchForm from '../components/SearchForm';

export default function SearchPage() {
  const [displayedUsers, setDisplayedUsers] = useState('');
  const [searchFormState, setSearchFormState] = useState('');
  const router = useRouter();

  const searchUsersByApi = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchFormState),
    });
    const foundUsers = await response.json();
    console.log('foundUsers', foundUsers);
    console.log('response', response);
    setDisplayedUsers(foundUsers);
    if (foundUsers) {
      await router.push(`/profile/${foundUsers.username}`);
    }
  };

  <button onClick={() => searchUsersByApi(searchFormState)}>search</button>;
  const initialRender = useRef(true);
  // trigger a search whenever the search form state changes && length >= 3 -OR- length == 0 (implying a reset)
  /* useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (searchFormState.length >= 3 || searchFormState.length === 0) {
        const formState = searchFormState;
        searchUsersByApi('api/search', formState);
      }
    }
  }, [searchFormState]); */

  return (
    <div>
      <SearchForm
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
        setdisplayedUsers={setDisplayedUsers}
      />
      {/* <p>{displayedUsers}</p> */}
      <button onClick={() => searchUsersByApi(searchFormState)}>search</button>
    </div>
  );
}
