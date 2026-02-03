import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './header.scss';

const menuItems = [
  {
    name: 'Home',
    link: '/',
    icon: 'fa-home',
    desc: 'Back to home',
  },
  {
    name: 'Movies',
    link: '/#movies',
    icon: 'fa-film',
    desc: 'Browse movies',
  },
  {
    name: 'Series',
    link: '/#series',
    icon: 'fa-tv',
    desc: 'Browse series',
  },
  {
    name: 'Anime',
    link: '/#anime',
    icon: 'fa-star',
    desc: 'Latest anime',
  },
];

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const updateMenuPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 6,
        left: rect.left,
      });
    }
  };

  useEffect(() => {
    if (menuOpen && triggerRef.current) {
      updateMenuPosition();
    }
  }, [menuOpen]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (
        menuOpen
        && menuRef.current
        && !menuRef.current.contains(e.target)
        && triggerRef.current
        && !triggerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    const onResize = () => {
      if (menuOpen) updateMenuPosition();
    };
    document.addEventListener('click', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    if (!menuOpen) {
      updateMenuPosition();
    }
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

  const dropdownContent = menuOpen && (
    <ul
      ref={menuRef}
      className="logo__dropdown logo__dropdown--portal"
      style={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 10000,
      }}
    >
      <li className="logo__dropdown-title">Categories</li>
      {menuItems.map((item) => (
        <li key={item.name}>
          <Link
            to={item.link}
            onClick={() => setMenuOpen(false)}
            className={pathname === item.link ? 'active' : ''}
          >
            <i className={`fa ${item.icon}`} />
            <span className="logo__dropdown-text">
              <strong>{item.name}</strong>
              <small>{item.desc}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`header ${menuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__wrap container">
        <div className="header__left">
          <div className="logo logo--menu">
            <button
              ref={triggerRef}
              type="button"
              className="logo__trigger"
              onClick={handleTriggerClick}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              CinePhile
              <i className={`fa fa-chevron-${menuOpen ? 'up' : 'down'}`} />
            </button>
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
      {createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default Header;
