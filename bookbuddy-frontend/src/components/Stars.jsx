// Gold star rating — display mode for now.
//   numeric → "★ 4.5"   (used for book ratings)
//   default → "★★★★☆"   (used for review star counts)
// Interactive star buttons for the review form arrive in Step 5.
export default function Stars({ value, numeric = false, label }) {
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
