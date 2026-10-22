import { useEffect, useState } from 'react';
import { getReviews, STATUS } from '../api.js';
import Cover from '../components/Cover.jsx';
import Stars from '../components/Stars.jsx';

const LIST_OPTIONS = [STATUS.want, STATUS.reading, STATUS.read];

export default function BookDetail({
  bookId,
  catalog,
  currentStatus,
  onSetStatus = () => {},
}) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    let alive = true;
    setRating(0);
    setReviewText('');

    getReviews(bookId).then((data) => {
      if (alive) setReviews(data);
    });

    return () => {
      alive = false;
    };
  }, [bookId]);

  const book = (catalog || []).find((entry) => entry.id === bookId);

  if (!book) {
    return (
      <main className="page">
        <p className="empty-note">Book not found.</p>
      </main>
    );
  }

  // Real working destination until the backend sends the official
  // bookstore link (Google Books integration — Milestone 3).
  const bookstoreUrl = `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(
    `${book.title} ${book.author}`
  )}`;

  const canPost = rating >= 1 && reviewText.trim().length > 0;

  function postReview() {
    if (!canPost) return;
    setReviews((prev) => [
      { user: 'Alice', stars: rating, text: reviewText.trim() },
      ...prev,
    ]);
    setRating(0);
    setReviewText('');
  }

  return (
    <main className="page">
      <div className="detail-grid">
        <div className="detail-cover">
          <Cover book={book} style={{ height: '460px' }} />
        </div>

        <div className="detail-content">
          <h1>{book.title}</h1>
          <p className="detail-author">{book.author}</p>

          {book.rating == null ? (
            <p className="rating-soon">Rating coming soon</p>
          ) : (
            <p className="detail-rating">
              <Stars value={book.rating} numeric />
              <span aria-hidden="true"> &middot; </span>
              <span>[rating count]</span>
            </p>
          )}

          <p className="detail-desc">
            [Book description loaded from the Google Books API]
          </p>

          <h2 className="detail-h2">Add to my lists</h2>
          <div
            className="chip-group detail-chips"
            role="group"
            aria-label="Add to my lists"
          >
            {LIST_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                className="chip"
                aria-pressed={currentStatus === status}
                onClick={() => onSetStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <a
            className="btn-buy"
            href={bookstoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy online &middot; [price from bookstore]
          </a>
          <p className="buy-note">
            Opens the bookstore&apos;s website to check out.
          </p>

          <hr className="divider" />

          <h2 className="detail-h2">Rate and review</h2>
          <Stars value={rating} interactive onRate={setRating} />

          <div className="field detail-field">
            <label htmlFor="review-text">Your review</label>
            <textarea
              id="review-text"
              rows="4"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-primary btn-detail"
            onClick={postReview}
            disabled={!canPost}
            aria-describedby="post-hint"
          >
            Post review
          </button>
          <p className="post-hint" id="post-hint">
            Select a star rating and write your review to enable posting.
          </p>

          <h2 className="detail-h2">Reader reviews</h2>
          <ul className="review-list">
            {reviews.map((review, index) => (
              <li className="review-box" key={`${review.user}-${index}`}>
                <p className="review-head">
                  <span className="review-name">{review.user}</span>
                  <Stars value={review.stars} />
                </p>
                <p className="review-text">{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
