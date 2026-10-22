// Solid colored box showing the book title — no images, no gradients.
// Size comes from the caller (300px grid cards, 460px detail, mini rows).
// aria-hidden by default because the title is always shown as real text
// next to the cover, which avoids screen readers reading it twice.
export default function Cover({ book, className = '', style }) {
  if (!book) return null;

  return (
    <div
      className={`cover${className ? ` ${className}` : ''}`}
      style={{ backgroundColor: book.bg, color: book.fg, ...style }}
      aria-hidden="true"
    >
      <span className="cover-title">{book.title}</span>
    </div>
  );
}
