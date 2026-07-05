import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <button
        className="search-bar__button"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
      >
        Search
      </button>
      <input
        className="search-bar__input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm công việc theo tên…"
        aria-label="Tìm kiếm công việc"
      />
      {value && (
        <button
          className="search-bar__clear"
          type="button"
          onClick={() => onChange('')}
          aria-label="Xóa tìm kiếm"
        >
          ×
        </button>
      )}
    </div>
  );
}
