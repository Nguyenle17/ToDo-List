import { useEffect, useRef, useState } from 'react';
import './TodoItem.css';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function startEdit() {
    setDraft(todo.title);
    setIsEditing(true);
  }

  async function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      await onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setDraft(todo.title);
      setIsEditing(false);
    }
  }

  return (
    <li className={`todo-item${todo.done ? ' is-done' : ''}`}>
      <button
        className="todo-item__check"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        onClick={() => onToggle(todo.id)}
      >
        {todo.done && (
          <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
            <path
              d="M2 8.5 6 12 14 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="todo-item__body">
        {isEditing ? (
          <input
            ref={inputRef}
            className="todo-item__edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="todo-item__title" onDoubleClick={startEdit}>
            {todo.title}

            <div className="todo-item__created-at">
              Ngày tạo: {new Date(todo.createdAt).toLocaleDateString()}
            </div>
            {todo.done ? (
              <>
              </>
            ) : (
              <div className="todo-item__status">
                Chưa hoàn thành
              </div>
            )}
          </span>
        )}
        {todo.done && <span className="todo-item__stamp">ĐÃ XONG</span>}
      </div>

      <div className="todo-item__actions">
        {!isEditing && (
          <button className="todo-item__action" onClick={startEdit} aria-label="Sửa công việc">
            Sửa
          </button>
        )}
        <button
          className="todo-item__action todo-item__action--danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Xóa công việc"
        >
          Xóa
        </button>
      </div>
    </li>
  );
}
