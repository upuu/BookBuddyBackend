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
      {page !== 'onboarding' && <Nav />}

      {page === 'onboarding' && <Onboarding onNavigate={setPage} />}
      {page === 'discover' && <Discover />}
      {page === 'book' && <BookDetail bookId={selectedBookId} />}
      {page === 'lists' && <Lists />}
    </>
  );
}
