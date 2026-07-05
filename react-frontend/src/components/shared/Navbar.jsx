import { useState } from 'react';
import './Navbar.css';

const LINKS = [
  { key: 'tasks', label: 'Công việc' },
];

export default function Navbar({ active = 'tasks', onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSelect(key) {
    onNavigate?.(key);
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">SCV</span>
          <div className="navbar__brand-text">
            <span className="navbar__title">Sổ công việc</span>
            <span className="navbar__docket"># Todo list</span>
          </div>
        </div>

        <nav className="navbar__links" aria-label="Điều hướng chính">
          {LINKS.map((link) => (
            <button
              key={link.key}
              className={`navbar__link${active === link.key ? ' is-active' : ''}`}
              onClick={() => handleSelect(link.key)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className="navbar__toggle"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav className="navbar__mobile-links" aria-label="Điều hướng chính (di động)">
          {LINKS.map((link) => (
            <button
              key={link.key}
              className={`navbar__mobile-link${active === link.key ? ' is-active' : ''}`}
              onClick={() => handleSelect(link.key)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
