const SearchForm = ({
  searchFormState,
  setSearchFormState,
  /* setDisplayedJobs, */
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

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
          className="form-input w-full pl-9 focus:border-slate-300"
          type="search"
          placeholder="Search users…"
          value={searchFormState}
          onChange={(e) => setSearchFormState(e.target.value)}
        />
        <button
          className="absolute inset-0 right-auto group"
          aria-label="Search"
        />
      </form>
    </div>
  );
};

export default SearchForm;
