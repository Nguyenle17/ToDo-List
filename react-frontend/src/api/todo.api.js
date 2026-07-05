import api from './api';

function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.set(key, value);
    }
  });
  return usp.toString();
}

export const todoApi = {
  getTodos: (filter = {}) => {
    const qs = buildQuery({
      page: filter.page ?? 1,
      limit: filter.limit ?? 10,
      status: filter.status ?? '',
      search: filter.search ?? '',
      sortBy: filter.sortBy ?? 'createdAt',
      sortOrder: filter.sortOrder ?? 'desc',
    });
    return api.get(`/todos?${qs}`);
  },
  createTodo: (data) => api.post('/todos', data),
  updateTodo: (id, data) => api.patch(`/todos/${id}`, data),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
  toggleTodo: (id) => api.patch(`/todos/${id}/toggle`),
};
