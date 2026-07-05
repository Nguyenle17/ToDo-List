import { useState } from 'react';
import './TodoForm.css';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || "",
      });
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
  <span className="todo-form__hole" aria-hidden="true" />
  <input
    className="todo-form__input todo-form__input--title"
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Thêm một công việc mới…"
    aria-label="Tên công việc mới"
  />
  <input
    className="todo-form__input todo-form__input--description"
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Mô tả (không bắt buộc)…"
    aria-label="Mô tả công việc"
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