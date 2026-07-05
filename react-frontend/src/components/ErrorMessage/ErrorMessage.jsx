export default function ErrorMessage({ error, className = '' }) {
  if (!error) return null;

  const message = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : 'Đã có lỗi xảy ra. Vui lòng thử lại.';

  return (
    <p className={`error-message ${className}`.trim()}>
      {message}
    </p>
  );
}