import { useMemo, useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FILTERS, countByStatus } from '@/utils/filterTodos';
import TodoForm from '@/components/TodoForm/TodoForm';
import SearchBar from '@/components/SearchBar/SearchBar';
import FilterTabs from '@/components/FilterTab/FilterTab';
import TodoList from '@/components/TodoList/TodoList';
import './TodoPage.css';

function toApiStatus(status) {
  if (status === FILTERS.DONE) return 'done';
  if (status === FILTERS.ACTIVE) return 'active';
  return '';
}

export default function TodoPage() {
  const [status, setStatus] = useState(FILTERS.ALL);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const debouncedQuery = useDebouncedValue(query, 300);

  const filter = useMemo(
    () => ({ status: toApiStatus(status), search: debouncedQuery, sortBy: 'createdAt', sortOrder: sortOrder }),
    [status, debouncedQuery, sortOrder]
  );

  const { todos = [], loading, error, addTodo, editTodo, removeTodo } = useTodos(filter);

  const counts = useMemo(() => countByStatus(todos), [todos]);

  const handleSortOrderChange = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  }

  const emptyMessage =
    todos.length === 0 && !debouncedQuery && status === FILTERS.ALL
      ? 'Chưa có công việc nào. Thêm việc đầu tiên ở trên.'
      : 'Không tìm thấy công việc phù hợp.';

  return (
    <section className="todo-page">
      <div className="todo-page__header">
        <div className="todo-page__form">
          <TodoForm onAdd={addTodo} />
        </div>
        <div className="todo-page__search">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      <FilterTabs value={status} onChange={setStatus} counts={counts} sortOrder={sortOrder} onSortOrderChange={handleSortOrderChange} />

      {loading && <p className="todo-page__status">Đang tải danh sách…</p>}

      {error && (
        <p className="todo-page__status todo-page__status--error">
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Đã có lỗi xảy ra. Vui lòng thử lại.'}
        </p>
      )}

      {!loading && !error && (
        <TodoList
          todos={todos}
          onEdit={editTodo}
          onDelete={removeTodo}
          emptyMessage={emptyMessage}
        />
      )}
    </section>
  );
}