import { useNews } from "../contexts/NewsContext";

function Search() {
  const { query, searchPost } = useNews();
  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => searchPost(e.target.value)}
        className="search"
        placeholder="Search for tech news..."
      />
    </>
  );
}

export default Search;
