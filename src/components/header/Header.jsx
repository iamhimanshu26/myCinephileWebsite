import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiFilm, FiHome, FiSearch, FiTv,
} from 'react-icons/fi';
import './header.scss';

const menuItems = [
  { name: 'Home', link: '/', icon: FiHome },
  { name: 'New Movies', link: '/#movies', icon: FiFilm },
  { name: 'New TV Series', link: '/#series', icon: FiTv },
  { name: 'My Collection', link: '/collection', icon: FiBookmark },
];

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current
        && !menuRef.current.contains(e.target)
        && triggerRef.current
        && !triggerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const onTriggerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchTerm('');
      setMenuOpen(false);
    }
  };

  return (
    <header className={`header header--dark ${menuOpen ? 'header--menu-open' : ''}`}>
      <a className="header__skip-link" href="#main-content">Skip to content</a>
      <div className="header__wrap container">
        <div className="header__brand" ref={menuRef}>
          <button
            ref={triggerRef}
            type="button"
            className="header__menu-trigger"
            onClick={onTriggerClick}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-controls="header-menu"
          >
            <span className="header__logo-icon" aria-hidden><FiFilm /></span>
            <span className="header__logo-text">Cinephile</span>
            {menuOpen
              ? <FiChevronUp className="header__chevron" aria-hidden />
              : <FiChevronDown className="header__chevron" aria-hidden />}
          </button>
          <span className="header__site-name">Movie Discovery Platform</span>
        </div>

        <div className="header__search">
          <form onSubmit={handleSearch} className="header__search-form">
            <input
              type="search"
              placeholder="Search movies, series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header__search-input"
              aria-label="Search"
            />
            <button type="submit" className="header__search-btn" aria-label="Search">
              <FiSearch aria-hidden />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {menuOpen && (
        <nav id="header-menu" className="header__dropdown" aria-label="Primary">
          <ul className="header__dropdown-list">
            {menuItems.map(({ name, link, icon: Icon }) => (
              <li key={name}>
                <Link
                  to={link.startsWith('/') ? link : '/'}
                  className="header__dropdown-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="header__dropdown-icon" aria-hidden />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
