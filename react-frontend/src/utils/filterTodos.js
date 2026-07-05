export const FILTERS = {
  ALL: 'all',
  DONE: 'done',
  ACTIVE: 'active',
};

export const FILTER_LABELS = {
  [FILTERS.ALL]: 'Tất cả',
  [FILTERS.ACTIVE]: 'Chưa xong',
  [FILTERS.DONE]: 'Đã xong',
};

/**
 * Applies status filter + text search to a list of todos.
 * @param {Array} todos
 * @param {{ status: string, query: string }} options
 */
export function filterTodos(todos, { status = FILTERS.ALL, query = '' } = {}) {
  const q = query.trim().toLowerCase();

  return todos.filter((todo) => {
    const matchesStatus =
      status === FILTERS.ALL ||
      (status === FILTERS.DONE && todo.completed) ||
      (status === FILTERS.ACTIVE && !todo.completed);

    const matchesQuery = q === '' || todo.title.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });
}