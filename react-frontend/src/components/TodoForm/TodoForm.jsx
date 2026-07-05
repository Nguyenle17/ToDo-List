import { useState } from 'react';
import './TodoForm.css';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    await onAdd(title);
    setTitle('');
    setSubmitting(false);
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <span className="todo-form__hole" aria-hidden="true" />
      <input
        className="todo-form__input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thêm một công việc mới…"
        aria-label="Tên công việc mới"
      />
      <button
        className="todo-form__submit"
        type="submit"
        disabled={!title.trim() || submitting}
      >
        Thêm
      </button>
    </form>
  );
}
