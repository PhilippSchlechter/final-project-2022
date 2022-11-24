const SearchForm = ({ searchFormState, setSearchFormState }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchFormState) {
      console.log(`Searching: ${searchFormState}`);
    }
  };

  return (
    <div className="mb-5">
      <form className="flex" onSubmit={handleSubmit}>
        <label htmlFor="user-search" className="sr-only flex">
          Search
        </label>
        <input
          id="user-search"
          data-testid="user-search-bar"
          className="form-input font-sans font-semibold text-base px-12 py-2 focus:border-slate-300 border-slate-400 mx-auto mb-8"
          type="search"
          placeholder="Search profiles…"
          value={searchFormState}
          onChange={(event) => {
            setSearchFormState(event.target.value);
          }}
        />
      </form>
    </div>
  );
};

export default SearchForm;
