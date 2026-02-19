import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GENRE_OPTIONS, COUNTRY_OPTIONS } from '../../constants/filters';
import './header.scss';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = ['All', ...Array.from({ length: 12 }, (_, i) => String(currentYear - i))];

const menuItems = [
  { name: 'Home', link: '/', icon: 'bx-home-alt' },
  {
    name: 'Genre',
    link: '#genre',
    icon: 'bx-category',
    hasDropdown: true,
  },
  {
    name: 'Country',
    link: '#country',
    icon: 'bx-world',
    hasDropdown: true,
  },
  {
    name: 'Year',
    link: '#year',
    icon: 'bx-calendar',
    hasDropdown: true,
  },
  { name: 'New Movies', link: '/#movies', icon: 'bx-movie' },
  { name: 'New TV series', link: '/#series', icon: 'bx-tv' },
  { name: 'My Collection', link: '/collection', icon: 'bx-bookmark' },
  { name: 'Login', link: '#login', icon: 'bx-log-in' },
  { name: 'Signup', link: '#signup', icon: 'bx-user-plus' },
];

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);
  const genreDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    function handleClickOutsideDropdown(e) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) {
        setYearDropdownOpen(false);
      }
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target)) {
        setGenreDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutsideDropdown);
    return () => document.removeEventListener('click', handleClickOutsideDropdown);
  }, []);

  const currentYearParam = searchParams.get('year') || 'All';
  const currentGenreParam = searchParams.get('genre') || 'All';
  const currentCountryParam = searchParams.get('country') || 'All';

  const updateParamsAndGoHome = (next) => {
    const search = next.toString();
    navigate({ pathname: '/', search: search ? `?${search}` : '' });
  };

  const handleYearSelect = (y) => {
    setYearDropdownOpen(false);
    const next = new URLSearchParams(searchParams);
    if (y === 'All') next.delete('year');
    else next.set('year', y);
    updateParamsAndGoHome(next);
  };

  const handleGenreSelect = (genreId) => {
    setGenreDropdownOpen(false);
    const next = new URLSearchParams(searchParams);
    if (genreId === 'All') next.delete('genre');
    else next.set('genre', genreId);
    updateParamsAndGoHome(next);
  };

  const handleCountrySelect = (countryCode) => {
    setCountryDropdownOpen(false);
    const next = new URLSearchParams(searchParams);
    if (countryCode === 'All') next.delete('country');
    else next.set('country', countryCode);
    updateParamsAndGoHome(next);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, [darkMode]);

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
              placeholder="Search"
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

        <div className="header__right">
          <button
            type="button"
            className={`header__theme-toggle ${darkMode ? 'header__theme-toggle--on' : ''}`}
            onClick={() => setDarkMode((d) => !d)}
            aria-label={darkMode ? 'Light mode' : 'Dark mode'}
          >
            <span className="header__theme-label">Dark</span>
          </button>
          <nav className="header__nav">
            {menuItems.map((item) => {
              if (item.name === 'Year') {
                return (
                  <span
                    key={item.name}
                    className="header__nav-item-wrap header__nav-item-wrap--dropdown"
                    ref={yearDropdownRef}
                  >
                    <button
                      type="button"
                      className="header__nav-link header__nav-link--dropdown"
                      onClick={() => {
                        setYearDropdownOpen((o) => !o);
                        setGenreDropdownOpen(false);
                        setCountryDropdownOpen(false);
                      }}
                      aria-expanded={yearDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      Year {currentYearParam !== 'All' ? `(${currentYearParam})` : ''}
                      <i className={`bx bx-chevron-${yearDropdownOpen ? 'up' : 'down'}`} />
                    </button>
                    {yearDropdownOpen && (
                      <div className="header__filter-dropdown" role="listbox">
                        {YEAR_OPTIONS.map((y) => (
                          <button
                            key={y}
                            type="button"
                            role="option"
                            aria-selected={currentYearParam === y}
                            className={`header__filter-option ${currentYearParam === y ? 'header__filter-option--active' : ''}`}
                            onClick={() => handleYearSelect(y)}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                );
              }
              if (item.name === 'Genre') {
                const currentLabel = currentGenreParam === 'All'
                  ? 'Genre'
                  : GENRE_OPTIONS.find((g) => g.id === currentGenreParam)?.name || 'Genre';
                return (
                  <span key={item.name} className="header__nav-item-wrap header__nav-item-wrap--dropdown" ref={genreDropdownRef}>
                    <button
                      type="button"
                      className="header__nav-link header__nav-link--dropdown"
                      onClick={() => {
                        setGenreDropdownOpen((o) => !o);
                        setYearDropdownOpen(false);
                        setCountryDropdownOpen(false);
                      }}
                      aria-expanded={genreDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {currentLabel}
                      <i className={`bx bx-chevron-${genreDropdownOpen ? 'up' : 'down'}`} />
                    </button>
                    {genreDropdownOpen && (
                      <div className="header__filter-dropdown" role="listbox">
                        <button
                          type="button"
                          role="option"
                          aria-selected={currentGenreParam === 'All'}
                          className={`header__filter-option ${currentGenreParam === 'All' ? 'header__filter-option--active' : ''}`}
                          onClick={() => handleGenreSelect('All')}
                        >
                          All
                        </button>
                        {GENRE_OPTIONS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            role="option"
                            aria-selected={currentGenreParam === g.id}
                            className={`header__filter-option ${currentGenreParam === g.id ? 'header__filter-option--active' : ''}`}
                            onClick={() => handleGenreSelect(g.id)}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                );
              }
              if (item.name === 'Country') {
                const currentLabel = currentCountryParam === 'All'
                  ? 'Country'
                  : COUNTRY_OPTIONS.find((c) => c.code === currentCountryParam)?.name || 'Country';
                return (
                  <span key={item.name} className="header__nav-item-wrap header__nav-item-wrap--dropdown" ref={countryDropdownRef}>
                    <button
                      type="button"
                      className="header__nav-link header__nav-link--dropdown"
                      onClick={() => {
                        setCountryDropdownOpen((o) => !o);
                        setYearDropdownOpen(false);
                        setGenreDropdownOpen(false);
                      }}
                      aria-expanded={countryDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {currentLabel}
                      <i className={`bx bx-chevron-${countryDropdownOpen ? 'up' : 'down'}`} />
                    </button>
                    {countryDropdownOpen && (
                      <div className="header__filter-dropdown" role="listbox">
                        <button
                          type="button"
                          role="option"
                          aria-selected={currentCountryParam === 'All'}
                          className={`header__filter-option ${currentCountryParam === 'All' ? 'header__filter-option--active' : ''}`}
                          onClick={() => handleCountrySelect('All')}
                        >
                          All
                        </button>
                        {COUNTRY_OPTIONS.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            role="option"
                            aria-selected={currentCountryParam === c.code}
                            className={`header__filter-option ${currentCountryParam === c.code ? 'header__filter-option--active' : ''}`}
                            onClick={() => handleCountrySelect(c.code)}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                );
              }
              return (
                <span key={item.name} className="header__nav-item-wrap">
                  <Link to={item.link.startsWith('/') ? item.link : '/'} className="header__nav-link">
                    {item.name}
                  </Link>
                </span>
              );
            })}
          </nav>
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
