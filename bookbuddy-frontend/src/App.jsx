import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Lists from './pages/Lists.jsx';

export default function App() {
  // Step 1: navigation state only. Real page content arrives in Steps 3-6.
  const [page, setPage] = useState('onboarding'); // 'onboarding' | 'discover' | 'book' | 'lists'
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [lists, setLists] = useState({ 1: 'reading', 2: 'reading', 3: 'reading' });

  return (
    <>
      {/* Onboarding has no nav bar (per spec) */}
      {page !== 'onboarding' && (
        <Nav page={page === 'book' ? 'discover' : page} onNavigate={setPage} />
      )}

      {page === 'onboarding' && <Onboarding onNavigate={setPage} />}
      {page === 'discover' && (
        <Discover
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
          currentStatus={selectedBookId ? lists[selectedBookId] : undefined}
          onSetStatus={(status) =>
            setLists((prev) => ({ ...prev, [selectedBookId]: status }))
          }
        />
      )}
      {page === 'lists' && (
        <Lists
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
