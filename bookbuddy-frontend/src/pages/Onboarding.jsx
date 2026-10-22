import { useState } from 'react';
import logo from '../assets/logo.png';
import { GENRES } from '../api.js';

// Genres pre-selected for the demo (per design spec).
const DEFAULT_SELECTED = ['Fantasy', 'Sci-Fi', 'Non-fiction'];

export default function Onboarding({ onNavigate = () => {} }) {
  const [selected, setSelected] = useState(DEFAULT_SELECTED);
  const [authors, setAuthors] = useState('');

  function toggleGenre(genre) {
    setSelected((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  }

  return (
    <main className="onboarding">
      <div className="onboarding-card">
        <img
          src={logo}
          alt="BookBuddy"
          width="220"
          className="onboarding-logo"
        />

        <h1>What do you love to read?</h1>
        <p className="onboarding-sub">
          Pick a few genres. We&apos;ll use them until you&apos;ve rated some
          books.
        </p>

        <div className="chip-group" role="group" aria-label="Favorite genres">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              className="chip"
              aria-pressed={selected.includes(genre)}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="favorite-authors">Favorite authors (optional)</label>
          <input
            id="favorite-authors"
            type="text"
            placeholder="e.g. Andy Weir"
            value={authors}
            onChange={(event) => setAuthors(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => onNavigate('discover')}
        >
          Show my recommendations
        </button>

        <button
          type="button"
          className="btn-link"
          onClick={() => onNavigate('discover')}
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
