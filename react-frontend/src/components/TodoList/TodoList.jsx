import TodoItem from '@/components/TodoItem/TodoItem';
import './TodoList.css';

export default function TodoList({ todos, onToggle, onEdit, onDelete, emptyMessage }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
