const SearchForm = ({ searchFormState, setSearchFormState }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchFormState) {
      console.log(`Searching: ${searchFormState}`);
    }
  };

  return (
    <div className="mb-5">
      <form className="relative" onSubmit={handleSubmit}>
        <label htmlFor="user-search" className="sr-only">
          Search
        </label>
        <input
          id="user-search"
          data-testid="user-search-bar"
          className="form-input w-full pl-9 focus:border-slate-300"
          type="search"
          placeholder="Search profiles…"
          value={searchFormState}
          onChange={(event) => {
            setSearchFormState(event.target.value);
          }}
        />
        {/* <button
          className="absolute inset-0 right-auto group"
          aria-label="Search"
        /> */}
      </form>
    </div>
  );
};

export default SearchForm;
