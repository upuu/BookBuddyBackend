// ============================================================
// BookBuddy — ALL data access for the app lives in this ONE file.
// Components must never call fetch() directly; they import the
// async functions below.
//
// Books and recommendations now come from the Flask backend
// (proxied by Vite in dev: /api/* -> http://localhost:5000).
// Reviews are still mocked — there is no backend endpoint yet.
// ============================================================

export const CURRENT_USER = 'Alice';

export const SERVER_ERROR_MESSAGE =
  "Can't reach the BookBuddy server. Start the Flask backend (python app.py), then refresh this page.";

export const STATUS = {
  want: 'Want to Read',
  reading: 'Currently Reading',
  read: 'Read',
};

export const GENRES = [
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Romance',
  'Thriller',
  'Non-fiction',
  'Historical',
  'Self-help',
];

// Cover palette, applied by index to backend books (no images,
// no gradients — solid color boxes showing the title).
const COVER_PALETTE = [
  { bg: '#00689E', fg: '#ffffff' },
  { bg: '#FFDD00', fg: '#0B2A3C' },
  { bg: '#0B2A3C', fg: '#FFDD00' },
  { bg: '#BFE6F7', fg: '#0B2A3C' },
];

const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Mock reviews — no backend endpoint yet, same for every book.
const reviews = [
  { user: 'Bob', stars: 5, text: '[Review text]' },
  { user: 'Diana', stars: 4, text: '[Review text]' },
];

// Simulates network latency for the mocked endpoint.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBooks() {
  const response = await fetch('/api/books');
  if (!response.ok) {
    throw new Error(`GET /api/books failed with ${response.status}`);
  }
  const data = await response.json();

  return (data.books || []).map((book, index) => ({
    id: slug(book.title),
    title: book.title,
    author: book.author,
    genre: book.genre,
    rating: null, // backend has no ratings yet — show "Rating coming soon"
    ...COVER_PALETTE[index % COVER_PALETTE.length],
  }));
}

export async function getRecommendations(user = CURRENT_USER, catalog = []) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  });
  if (!response.ok) {
    throw new Error(`POST /api/recommendations failed with ${response.status}`);
  }
  const data = await response.json();

  const books = (data.recommendations || [])
    .map((rec) => catalog.find((book) => book.title === rec.title))
    .filter(Boolean);

  return { books, algorithm: data.algorithm };
}

export async function getReviews(bookId) {
  await delay(120);
  // bookId is accepted but unused while reviews are mocked.
  return reviews.map((review) => ({ ...review }));
}
