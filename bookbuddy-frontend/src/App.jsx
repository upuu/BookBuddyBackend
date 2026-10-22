import { useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Lists from './pages/Lists.jsx';
import { getBooks, SERVER_ERROR_MESSAGE } from './api.js';

export default function App() {
  const [page, setPage] = useState('onboarding'); // 'onboarding' | 'discover' | 'book' | 'lists'
  const [selectedBookId, setSelectedBookId] = useState(null); // string slug
  const [lists, setLists] = useState({ 'the-hobbit': 'read', dune: 'reading' });

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

  return (
    <>
      {/* Onboarding has no nav bar (per spec) */}
      {page !== 'onboarding' && (
        <Nav page={page === 'book' ? 'discover' : page} onNavigate={setPage} />
      )}

      {page === 'onboarding' && <Onboarding onNavigate={setPage} />}
      {page === 'discover' && (
        <Discover
          catalog={catalog}
          onOpenBook={(id) => {
            setSelectedBookId(id);
            setPage('book');
          }}
          onAddToList={(id) =>
            setLists((prev) => ({ ...prev, [id]: 'want' }))
          }
        />
      )}
      {page === 'book' && (
        <BookDetail
          bookId={selectedBookId}
          catalog={catalog}
          currentStatus={selectedBookId ? lists[selectedBookId] : undefined}
          onSetStatus={(status) =>
            setLists((prev) => ({ ...prev, [selectedBookId]: status }))
          }
        />
      )}
      {page === 'lists' && (
        <Lists
          catalog={catalog}
          lists={lists}
          onMove={(id, status) =>
            setLists((prev) => ({ ...prev, [id]: status }))
          }
          onRemove={(id) =>
            setLists((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            })
          }
        />
      )}
    </>
  );
}
