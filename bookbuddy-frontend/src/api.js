// ============================================================
// BookBuddy — ALL data access for the app lives in this ONE file.
// Components must never call fetch() directly; they import the
// async functions below.
//
// Everything here is mock data for now. Later these functions
// switch to the Flask backend (http://localhost:5000, e.g.
// POST /api/recommendations) and bookstore info (Google Books)
// will come through the backend as well.
// ============================================================

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

// Mock catalog. Kept private on purpose: pages must get books
// through the async functions below, never by importing this.
const books = [
  {
    id: 1,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    rating: 4.5,
    reason: 'Because you liked The Martian',
    bg: '#00689E',
    fg: '#ffffff',
  },
  {
    id: 2,
    title: 'Circe',
    author: 'Madeline Miller',
    rating: 4.4,
    reason: 'Because you like Fantasy',
    bg: '#FFDD00',
    fg: '#0B2A3C',
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    rating: 4.6,
    reason: 'Because you like Self-help',
    bg: '#0B2A3C',
    fg: '#FFDD00',
  },
  {
    id: 4,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    rating: 4.2,
    reason: 'Readers like you loved this',
    bg: '#BFE6F7',
    fg: '#0B2A3C',
  },
];

// Mock reviews — same for every book until the backend lands.
const reviews = [
  { user: 'Bob', stars: 5, text: '[Review text]' },
  { user: 'Diana', stars: 4, text: '[Review text]' },
];

// Simulates network latency so loading states behave realistically.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRecommendations() {
  await delay(120);
  return books.map((book) => ({ ...book }));
}

export async function getBook(id) {
  await delay(120);
  const book = books.find((b) => b.id === id);
  return book ? { ...book } : null;
}

export async function getReviews(bookId) {
  await delay(120);
  // bookId is accepted but unused while reviews are mocked.
  return reviews.map((review) => ({ ...review }));
}
