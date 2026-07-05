import { useEffect, useRef, useState } from 'react';
import './TodoItem.css';

export default function TodoItem({ todo, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftDescription, setDraftDescription] = useState(todo.description ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function startEdit() {
    setDraftTitle(todo.title);
    setDraftDescription(todo.description ?? '');
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraftTitle(todo.title);
    setDraftDescription(todo.description ?? '');
    setIsEditing(false);
  }

  async function commitEdit() {
    const trimmedTitle = draftTitle.trim();
    const trimmedDescription = draftDescription.trim();

    const titleChanged = trimmedTitle && trimmedTitle !== todo.title;
    const descriptionChanged = trimmedDescription !== (todo.description ?? '');

    if (titleChanged || descriptionChanged) {
      await onEdit({
        id: todo.id,
        data: {
          title: trimmedTitle || todo.title,
          description: trimmedDescription || "",
        },
      });
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' is-done' : ''}`}>
      <button
        className="todo-item__check"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        onClick={() => onEdit({ id: todo.id, data: { completed: !todo.completed } })}
      >
        {todo.completed && (
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
          <>
            <input
              ref={inputRef}
              className="todo-item__edit-input"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tiêu đề"
            />
            <textarea
              className="todo-item__edit-textarea"
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mô tả (không bắt buộc)"
              rows={2}
            />
          </>
        ) : (
          <div className="todo-item__title" onDoubleClick={startEdit}>
            {todo.title}
          </div>
        )}

        {!isEditing && todo.description && (
          <div className="todo-item__description" onDoubleClick={startEdit}>
            {todo.description}
          </div>
        )}

        <div className="todo-item__meta">
          <span className="todo-item__created-at">
            Ngày tạo: {new Date(todo.createdAt).toLocaleDateString()}
          </span>
          {!todo.completed && (
            <span className="todo-item__status">Chưa hoàn thành</span>
          )}
        </div>

        {todo.completed && <span className="todo-item__stamp">ĐÃ XONG</span>}
      </div>

      <div className="todo-item__actions">
        {isEditing ? (
          <>
            <button
              className="todo-item__action todo-item__action--save"
              onClick={commitEdit}
              aria-label="Lưu thay đổi"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path
                  d="M2 8.5 6 12 14 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Lưu
            </button>
            <button
              className="todo-item__action"
              onClick={cancelEdit}
              aria-label="Hủy chỉnh sửa"
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button className="todo-item__action todo-item__action--edit" onClick={startEdit} aria-label="Sửa công việc">
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path
                  d="M11.5 2.5 13.5 4.5 5 13H3V11L11.5 2.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sửa
            </button>
            <button
              className="todo-item__action todo-item__action--danger"
              onClick={() => onDelete(todo.id)}
              aria-label="Xóa công việc"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path
                  d="M3 4H13M6 4V2.5H10V4M5 4V13.5H11V4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Xóa
            </button>
          </>
        )}
      </div>
    </li>
  );
}