import { FILTERS, FILTER_LABELS } from '@/utils/filterTodos';
import './FilterTab.css';

export default function FilterTabs({ value, onChange, counts, sortOrder, onSortOrderChange }) {
  return (
    <div className="filter-tabs-row">
      <div className="filter-tabs" role="tablist" aria-label="Lọc theo trạng thái">
        {Object.values(FILTERS).map((key) => {
          const count =
            key === FILTERS.ALL ? counts.total : key === FILTERS.DONE ? counts.done : counts.active;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={value === key}
              className={`filter-tabs__tab${value === key ? ' is-active' : ''}`}
              onClick={() => onChange(key)}
            >
              {FILTER_LABELS[key]}
              <span className="filter-tabs__count">{count}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="filter-tabs__sort"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        aria-label={sortOrder === 'asc' ? 'Đang sắp xếp tăng dần, bấm để đổi sang giảm dần' : 'Đang sắp xếp giảm dần, bấm để đổi sang tăng dần'}
        title="Sắp xếp theo ngày"
      >
        Ngày {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}