import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Không tìm thấy trang</h1>
      <p className="not-found__message">
        Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link to="/" className="not-found__link">
        ← Về trang chủ
      </Link>
    </section>
  );
}