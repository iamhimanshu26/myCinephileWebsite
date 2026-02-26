import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.scss';

const menuItems = [
  { name: 'Home', link: '/', icon: 'bx-home-alt' },
  { name: 'New Movies', link: '/#movies', icon: 'bx-movie' },
  { name: 'New TV series', link: '/#series', icon: 'bx-tv' },
  { name: 'My Collection', link: '/collection', icon: 'bx-bookmark' },
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
    <header className={`header header--dark ${menuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__wrap container">
        <div className="header__brand" ref={menuRef}>
          <button
            ref={triggerRef}
            type="button"
            className="header__menu-trigger"
            onClick={onTriggerClick}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="header__logo-icon"><i className="bx bx-movie-play" /></span>
            <span className="header__logo-text">Cinephile</span>
            <i className={`bx bx-chevron-${menuOpen ? 'up' : 'down'} header__chevron`} aria-hidden />
          </button>
          <span className="header__site-name">Cinephile</span>
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
              Search
            </button>
          </form>
        </div>
      </div>

      {menuOpen && (
        <nav className="header__dropdown" aria-label="Categories">
          <ul className="header__dropdown-list">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link.startsWith('/') ? item.link : '/'}
                  className="header__dropdown-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className={`bx ${item.icon} header__dropdown-icon`} aria-hidden />
                  <span>{item.name}</span>
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
