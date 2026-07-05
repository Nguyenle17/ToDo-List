import './Pagination.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Trang trước"
      >
        ← Trước
      </button>

      <span className="pagination__info">
        Trang {page} / {totalPages}
      </span>

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Trang sau"
      >
        Sau →
      </button>
    </div>
  );
}