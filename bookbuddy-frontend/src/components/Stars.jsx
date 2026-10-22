// Gold star rating.
//   display (default): numeric → "★ 4.5" / glyphs → "★★★★☆"
//   interactive:        5 clickable buttons with aria-label "N stars"
export default function Stars({
  value,
  numeric = false,
  label,
  interactive = false,
  onRate = () => {},
}) {
  if (interactive) {
    const selected = typeof value === 'number' ? value : 0;

    return (
      <div className="stars-input" role="group" aria-label="Rate this book">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-btn${n <= selected ? ' is-on' : ''}`}
            aria-label={`${n} stars`}
            onClick={() => onRate(n)}
          >
            <span aria-hidden="true">{n <= selected ? '★' : '☆'}</span>
          </button>
        ))}
      </div>
    );
  }

  if (typeof value !== 'number') return null;

  const ariaLabel = label || `Rated ${value} out of 5 stars`;

  if (numeric) {
    return (
      <span className="stars" role="img" aria-label={ariaLabel}>
        <span aria-hidden="true">★</span> {value}
      </span>
    );
  }

  const filled = Math.round(value);
  const glyphs = '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled);

  return (
    <span className="stars" role="img" aria-label={ariaLabel}>
      <span aria-hidden="true">{glyphs}</span>
    </span>
  );
}
