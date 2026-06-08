import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiBookmark,
  FiCompass,
  FiFilm,
  FiHome,
  FiLayers,
  FiEdit3,
  FiMenu,
  FiSearch,
  FiTv,
  FiUser,
  FiX,
} from 'react-icons/fi';
import useMagneticHover from '../../hooks/useMagneticHover';
import './header.scss';

const primaryNavItems = [
  { name: 'Home', to: '/', icon: FiHome },
  { name: 'Movies', to: '/#movies', icon: FiFilm },
  { name: 'TV Series', to: '/#series', icon: FiTv },
  { name: 'Anime', to: '/#anime', icon: FiCompass },
  { name: 'Collections', to: '/collection', icon: FiLayers },
];

const utilityNavItems = [
  { name: 'Watchlist', to: '/collection?view=watchlist', icon: FiBookmark },
  { name: 'Any Idea', to: '/any-idea', icon: FiEdit3 },
  {
    name: 'How We Built It',
    href: 'https://github.com/iamhimanshu26/myCinephileWebsite#readme',
    icon: FiCompass,
  },
];

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchButtonRef = useMagneticHover(5);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current
        && !menuRef.current.contains(e.target)
        && dropdownRef.current
        && !dropdownRef.current.contains(e.target)
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

  const isItemActive = ({ to }) => {
    if (!to) return false;
    const [path, hashAndQuery = ''] = to.split('#');
    const [pathnameFromTo, queryFromTo = ''] = path.split('?');
    if (pathnameFromTo && pathnameFromTo !== location.pathname) return false;
    if (!hashAndQuery && pathnameFromTo === '/' && location.hash) return false;
    if (queryFromTo) {
      const currentParams = new URLSearchParams(location.search);
      const targetParams = new URLSearchParams(queryFromTo);
      const keys = Array.from(targetParams.keys());
      const allMatch = keys.every((key) => currentParams.get(key) === targetParams.get(key));
      if (!allMatch) return false;
    }
    if (hashAndQuery) return location.hash === `#${hashAndQuery}`;
    return true;
  };

  const renderDesktopLink = (item, variant = 'primary') => {
    const isActive = isItemActive(item);
    const className = `header__nav-link header__nav-link--${variant} ${isActive ? 'is-active' : ''}`;
    if (item.href) {
      return (
        <a
          key={item.name}
          className={className}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name}
        </a>
      );
    }
    return (
      <Link key={item.name} className={className} to={item.to}>
        {item.name}
      </Link>
    );
  };

  const renderMobileLink = (item) => {
    const Icon = item.icon;
    if (item.href) {
      return (
        <a
          key={item.name}
          href={item.href}
          className="header__dropdown-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          <Icon className="header__dropdown-icon" aria-hidden />
          <span>{item.name}</span>
        </a>
      );
    }
    return (
      <Link
        key={item.name}
        to={item.to}
        className={`header__dropdown-link ${isItemActive(item) ? 'is-active' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        <Icon className="header__dropdown-icon" aria-hidden />
        <span>{item.name}</span>
      </Link>
    );
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
      <a className="header__skip-link" href="#main-content">Skip to content</a>
      <div className="header__wrap container">
        <div className="header__brand" ref={menuRef}>
          <Link to="/" className="header__brand-link" aria-label="Go to home">
            <span className="header__logo-icon" aria-hidden><FiFilm /></span>
            <span className="header__logo-text">Cinephile</span>
          </Link>
        </div>

        <nav className="header__nav" aria-label="Primary navigation">
          {primaryNavItems.map((item) => renderDesktopLink(item, 'primary'))}
        </nav>

        <div className="header__search">
          <form onSubmit={handleSearch} className="header__search-form">
            <input
              type="search"
              placeholder="Search movies, series, anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header__search-input"
              aria-label="Search"
            />
            <button
              ref={searchButtonRef}
              type="submit"
              className="header__search-btn magnetic"
              aria-label="Search"
            >
              <FiSearch aria-hidden />
              <span>Search</span>
            </button>
          </form>
        </div>

        <nav className="header__utility" aria-label="Utility navigation">
          {utilityNavItems.map((item) => renderDesktopLink(item, 'utility'))}
        </nav>

        <div className="header__profile">
          <Link className="header__profile-btn magnetic" to="/collection" aria-label="Profile and watchlist">
            <FiUser aria-hidden />
          </Link>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="header__mobile-toggle"
          onClick={onTriggerClick}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-controls="header-menu"
        >
          {menuOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="header-menu"
          ref={dropdownRef}
          className="header__dropdown"
          aria-label="Primary"
        >
          <ul className="header__dropdown-list">
            {[...primaryNavItems, ...utilityNavItems].map((item) => (
              <li key={item.name}>
                {renderMobileLink(item)}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
