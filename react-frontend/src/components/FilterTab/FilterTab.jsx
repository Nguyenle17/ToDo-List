import { FILTERS, FILTER_LABELS } from '@/utils/filterTodos';
import './FilterTab.css';

export default function FilterTabs({ value, onChange, count, sortOrder, onSortOrderChange }) {
  return (
    <div className="filter-tabs-row">
      <div className="filter-tabs" role="tablist" aria-label="Lọc theo trạng thái">
        {Object.values(FILTERS).map((key) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              className={`filter-tabs__tab${isActive ? ' is-active' : ''}`}
              onClick={() => onChange(key)}
            >
              {FILTER_LABELS[key]}
              {isActive && <span className="filter-tabs__count">{count}</span>}
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
        Thời gian {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}