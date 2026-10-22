import { useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Login from './pages/Login.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Lists from './pages/Lists.jsx';
import { getBooks, SERVER_ERROR_MESSAGE } from './api.js';

// Seeded reading lists per profile (demo data).
const SEED_LISTS = {
  Alice: { 'the-hobbit': 'read', dune: 'reading' },
  Bob: {},
  Charlie: {},
  Diana: {},
};

export default function App() {
  const [page, setPage] = useState('login'); // 'login' | 'onboarding' | 'discover' | 'book' | 'lists'
  const [user, setUser] = useState(null); // profile name, or 'New reader'
  const [selectedBookId, setSelectedBookId] = useState(null); // string slug

  // Lists per user: { [userName]: { [bookId]: status } }
  const [lists, setLists] = useState(SEED_LISTS);

  // Catalog loaded once from the Flask backend and passed down.
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    let alive = true;
    getBooks()
      .then((books) => {
        if (!alive) return;
        setCatalog(books);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setServerError(SERVER_ERROR_MESSAGE);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="page">
        <p role="status" className="page-sub">
          Loading books&hellip;
        </p>
      </main>
    );
  }

  if (serverError) {
    return (
      <main className="page">
        <p role="alert" className="error-note">
          {serverError}
        </p>
      </main>
    );
  }

  // Current user's lists (created lazily for 'New reader' etc.)
  const userLists = (user && lists[user]) || {};

  function handleEnter(name) {
    setUser(name);
    setPage('discover');
  }

  function handleOnboardingNavigate(target) {
    // Questionnaire path = cold start: backend returns its default
    // catalog for a user it does not know.
    if (target === 'discover') setUser('New reader');
    setPage(target);
  }

  function updateCurrentLists(mutator) {
    setLists((prev) => ({
      ...prev,
      [user]: mutator(prev[user] || {}),
    }));
  }

  function addToList(bookId) {
    updateCurrentLists((current) => ({ ...current, [bookId]: 'want' }));
  }

  function setStatusForBook(bookId, status) {
    updateCurrentLists((current) => ({ ...current, [bookId]: status }));
  }

  function moveBook(bookId, status) {
    updateCurrentLists((current) => ({ ...current, [bookId]: status }));
  }

  function removeBook(bookId) {
    updateCurrentLists((current) => {
      const next = { ...current };
      delete next[bookId];
      return next;
    });
  }

  return (
    <>
      {/* Nav bar: all pages except login and onboarding (per spec) */}
      {(page === 'discover' || page === 'book' || page === 'lists') && (
        <Nav
          page={page === 'book' ? 'discover' : page}
          onNavigate={setPage}
          user={user}
        />
      )}

      {page === 'login' && (
        <Login onEnter={handleEnter} onNavigate={setPage} />
      )}
      {page === 'onboarding' && (
        <Onboarding onNavigate={handleOnboardingNavigate} />
      )}
      {page === 'discover' && (
        <Discover
          catalog={catalog}
          user={user}
          onOpenBook={(id) => {
            setSelectedBookId(id);
            setPage('book');
          }}
          onAddToList={addToList}
        />
      )}
      {page === 'book' && (
        <BookDetail
          bookId={selectedBookId}
          catalog={catalog}
          user={user}
          currentStatus={selectedBookId ? userLists[selectedBookId] : undefined}
          onSetStatus={(status) => setStatusForBook(selectedBookId, status)}
        />
      )}
      {page === 'lists' && (
        <Lists
          catalog={catalog}
          lists={userLists}
          onMove={moveBook}
          onRemove={removeBook}
        />
      )}
    </>
  );
}
