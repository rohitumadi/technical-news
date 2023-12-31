import { useNews } from "./../contexts/NewsContext";
import { FaComments } from "react-icons/fa";

function SearchResultList() {
  const { hits, isLoading, handleRemove } = useNews();

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
  const { title, author, num_comments, url, objectID, created_at } = hit;
  const date = new Date(created_at).toLocaleDateString();
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>
        By {author} | {num_comments} <FaComments /> | {date}
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
