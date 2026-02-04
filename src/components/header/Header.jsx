import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.scss';

const menuItems = [
  { name: 'Home', link: '/', icon: 'fa-home' },
  { name: 'Movies', link: '/#movies', icon: 'fa-film' },
  { name: 'Series', link: '/#series', icon: 'fa-tv' },
  { name: 'Anime', link: '/#anime', icon: 'fa-star' },
  { name: 'My Collection', link: '/collection', icon: 'fa-bookmark' },
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
    <header className={`header ${menuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__wrap container">
        <div className="header__left" ref={menuRef}>
          <button
            ref={triggerRef}
            type="button"
            className="header__menu-trigger"
            onClick={onTriggerClick}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="header__menu-trigger-text">Cinephile</span>
            <i className={`fa fa-chevron-${menuOpen ? 'up' : 'down'}`} aria-hidden />
          </button>

          {menuOpen && (
            <nav className="header__dropdown" aria-label="Categories">
              <ul className="header__dropdown-list">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className="header__dropdown-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className={`fa ${item.icon}`} aria-hidden />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
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
              <i className="fa fa-search" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
