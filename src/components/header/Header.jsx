import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './header.scss';

const menuItems = [
  { name: 'Home', link: '/', icon: 'fa-home' },
  { name: 'Movies', link: '/#movies', icon: 'fa-film' },
  { name: 'Series', link: '/#series', icon: 'fa-tv' },
  { name: 'Anime', link: '/#anime', icon: 'fa-star' },
];

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

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
    <div className="header">
      <div className="header__wrap container">
        <div className="header__left">
          <div className="logo logo--menu" ref={menuRef}>
            <button
              type="button"
              className="logo__trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              CinePhile
              <i className={`fa fa-chevron-${menuOpen ? 'up' : 'down'}`} />
            </button>
            {menuOpen && (
              <ul className="logo__dropdown">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      onClick={() => setMenuOpen(false)}
                      className={pathname === item.link ? 'active' : ''}
                    >
                      <i className={`fa ${item.icon}`} />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;
