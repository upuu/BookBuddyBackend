import { useEffect, useState } from 'react';
import { getRecommendations } from '../api.js';
import Cover from '../components/Cover.jsx';
import Stars from '../components/Stars.jsx';

const FILTERS = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Self-help'];

export default function Discover({
  onOpenBook = () => {},
  onAddToList = () => {},
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    let alive = true;
    getRecommendations().then((data) => {
      if (!alive) return;
      setBooks(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const visibleBooks =
    activeFilter === 'All'
      ? books
      : books.filter((book) => (book.genres || []).includes(activeFilter));

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

      {loading && (
        <p role="status" className="page-sub">
          Loading picks&hellip;
        </p>
      )}

      {!loading && visibleBooks.length === 0 && (
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
            <Stars value={book.rating} numeric />
            <p className="card-reason">{book.reason}</p>

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
