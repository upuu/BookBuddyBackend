import { useEffect, useState } from 'react';
import { getRecommendations, STATUS } from '../api.js';
import Cover from '../components/Cover.jsx';

const TAB_KEYS = Object.keys(STATUS); // ['want', 'reading', 'read']

export default function Lists({
  lists,
  onMove = () => {},
  onRemove = () => {},
}) {
  const [catalog, setCatalog] = useState([]);
  const [activeTab, setActiveTab] = useState('reading'); // default: Currently Reading

  useEffect(() => {
    let alive = true;
    getRecommendations().then((data) => {
      if (alive) setCatalog(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const rows = Object.entries(lists)
    .filter(([, statusKey]) => statusKey === activeTab)
    .map(([id]) => catalog.find((book) => book.id === Number(id)))
    .filter(Boolean);

  return (
    <main className="page">
      <h1>My Lists</h1>

      <div
        className="chip-group filter-chips list-tabs"
        role="group"
        aria-label="Filter my lists by status"
      >
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="chip"
            aria-pressed={activeTab === key}
            onClick={() => setActiveTab(key)}
          >
            {STATUS[key]}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="empty-note">No books here yet. Find one on Discover.</p>
      ) : (
        <ul className="list-rows">
          {rows.map((book) => (
            <li className="list-row" key={book.id}>
              <Cover
                book={book}
                className="mini-cover"
                style={{ width: '64px', height: '92px' }}
              />

              <div className="row-info">
                <p className="row-title">{book.title}</p>
                <p className="row-author">{book.author}</p>
              </div>

              <select
                className="move-select"
                aria-label={`Move ${book.title} to another list`}
                value={lists[book.id]}
                onChange={(event) => onMove(book.id, event.target.value)}
              >
                {TAB_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {STATUS[key]}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn-link row-remove"
                aria-label={`Remove ${book.title} from My Lists`}
                onClick={() => onRemove(book.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
