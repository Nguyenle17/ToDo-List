import { useEffect, useMemo, useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FILTERS } from '@/utils/filterTodos';
import TodoForm from '@/components/TodoForm/TodoForm';
import SearchBar from '@/components/SearchBar/SearchBar';
import FilterTabs from '@/components/FilterTab/FilterTab';
import TodoList from '@/components/TodoList/TodoList';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
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
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedQuery, sortOrder]);

  const filter = useMemo(
    () => ({
      page,
      limit,
      status: toApiStatus(status),
      search: debouncedQuery,
      sortBy: 'createdAt',
      sortOrder,
    }),
    [status, debouncedQuery, sortOrder, page, limit]
  );

  const { todos, totalPages, totalTodos, loading, error, addTodo, editTodo, removeTodo } = useTodos(filter);

  const handleSortOrderChange = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const emptyMessage =
    todos.length === 0 && !debouncedQuery && status === FILTERS.ALL
      ? 'Chưa có công việc nào. Thêm việc đầu tiên ở trên.'
      : 'Không tìm thấy công việc phù hợp.';

  return (
    <section className="todo-page">

      <SearchBar value={query} onChange={setQuery} />
      <TodoForm onAdd={addTodo} />

      <FilterTabs
        value={status}
        onChange={setStatus}
        count={totalTodos}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />

      {loading && <p className="todo-page__status">Đang tải danh sách…</p>}

      {error && (
        <ErrorMessage error={error} className="todo-page__status" />
      )}

      {!loading && !error && (
        <>
          <TodoList
            todos={todos}
            onEdit={editTodo}
            onDelete={removeTodo}
            emptyMessage={emptyMessage}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}