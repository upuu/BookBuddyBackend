import { useEffect, useState } from 'react';
import {
  getRecommendations,
  CURRENT_USER,
  SERVER_ERROR_MESSAGE,
} from '../api.js';
import Cover from '../components/Cover.jsx';
import Stars from '../components/Stars.jsx';

const FILTERS = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Self-help'];

export default function Discover({
  catalog,
  onOpenBook = () => {},
  onAddToList = () => {},
}) {
  const [books, setBooks] = useState([]);
  const [algorithm, setAlgorithm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getRecommendations(CURRENT_USER, catalog)
      .then((result) => {
        if (!alive) return;
        setBooks(result.books);
        setAlgorithm(result.algorithm);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError(SERVER_ERROR_MESSAGE);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [catalog]);

  const visibleBooks =
    activeFilter === 'All'
      ? books
      : books.filter(
          (book) => book.genre && book.genre.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <main className="page">
      <h1>Good evening, Alice</h1>
      <p className="page-sub">
        Picked for you from your ratings and favorite genres.
      </p>

      <div
        className="chip-group filter-chips"
        role="group"
        aria-label="Filter picks by genre"
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className="chip"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <h2>Top picks for you</h2>
      {algorithm && <p className="algo-line">Recommended by: {algorithm}</p>}

      {loading && (
        <p role="status" className="page-sub">
          Loading picks&hellip;
        </p>
      )}

      {error && (
        <p role="alert" className="error-note">
          {error}
        </p>
      )}

      {!loading && !error && visibleBooks.length === 0 && (
        <p className="empty-note">No books in this genre yet.</p>
      )}

      <div className="book-grid">
        {visibleBooks.map((book) => (
          <article className="book-card" key={book.id}>
            <button
              type="button"
              className="cover-btn"
              onClick={() => onOpenBook(book.id)}
              aria-label={`View ${book.title} details`}
            >
              <Cover book={book} style={{ height: '300px' }} />
            </button>

            <h3 className="card-title">{book.title}</h3>
            <p className="card-author">{book.author}</p>

            {book.rating == null ? (
              <p className="rating-soon">Rating coming soon</p>
            ) : (
              <Stars value={book.rating} numeric />
            )}

            <p className="card-reason">{book.genre}</p>

            <button
              type="button"
              className="btn-outline"
              onClick={() => onAddToList(book.id)}
            >
              Add to list
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
