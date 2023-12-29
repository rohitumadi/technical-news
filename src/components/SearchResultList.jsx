import { useNews } from "./../contexts/NewsContext";
import { FaComments } from "react-icons/fa";

function SearchResultList() {
  const { hits, nbPages, isLoading, handleRemove } = useNews();

  if (isLoading) return <h1>Loading...</h1>;
  if (hits)
    return (
      <div className="result-list">
        {hits.map((hit, index) => (
          <Result hit={hit} key={index} handleRemove={handleRemove} />
        ))}
      </div>
    );
}

function Result({ hit, handleRemove }) {
  const { title, author, num_comments, url, objectID } = hit;
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>
        By {author} | {num_comments} <FaComments />
      </p>
      <div className="card-btn">
        <a href={url} target="_blank">
          Read More
        </a>
        <a href="#" onClick={() => handleRemove(objectID)}>
          Remove
        </a>
      </div>
    </div>
  );
}

export default SearchResultList;
