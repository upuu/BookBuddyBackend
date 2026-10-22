const BOOKMARK_MARK = (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0 0h18v24l-9-6-9 6V0z" fill="#FFDD00" />
  </svg>
);

// Design unchanged from Step 2; the avatar is now a button that
// returns to the profile picker (login) screen.
export default function Nav({
  page = '',
  onNavigate = () => {},
  user = 'New reader',
}) {
  return (
    <nav className="nav" aria-label="Main">
      <span className="nav-brand">
        {BOOKMARK_MARK}
        BookBuddy
      </span>

      <div className="nav-links">
        <button
          type="button"
          className="nav-link"
          aria-current={page === 'discover' ? 'page' : undefined}
          onClick={() => onNavigate('discover')}
        >
          Discover
        </button>
        <button
          type="button"
          className="nav-link"
          aria-current={page === 'lists' ? 'page' : undefined}
          onClick={() => onNavigate('lists')}
        >
          My Lists
        </button>
      </div>

      <button
        type="button"
        className="nav-avatar"
        aria-label={`Switch profile (current: ${user})`}
        onClick={() => onNavigate('login')}
      >
        {user.charAt(0)}
      </button>
    </nav>
  );
}
