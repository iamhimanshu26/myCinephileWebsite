import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiChevronUp,
  FiCompass,
  FiHelpCircle,
  FiShield,
} from 'react-icons/fi';
import useMagneticHover from '../../hooks/useMagneticHover';
import './footer.scss';

/* eslint-disable arrow-body-style */
const Footer = () => {
  const backTopRef = useMagneticHover(4);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__overlay" aria-hidden />
      <div className="footer__content container">
        <div className="footer__row footer__row--main">
          <div className="footer__brand">
            <Link to="/" className="footer__logo-link">Cinephile</Link>
            <p className="footer__tagline">
              Discover movies, series, and anime from trusted data providers.
            </p>
          </div>
          <nav className="footer__nav" aria-label="Support links">
            <span className="footer__menu-label"><FiHelpCircle /> Support</span>
            <Link to="/" className="footer__link">Contact</Link>
            <Link to="/" className="footer__link">FAQ</Link>
            <Link to="/" className="footer__link">Privacy</Link>
          </nav>
          <nav className="footer__nav" aria-label="Discover links">
            <span className="footer__menu-label"><FiCompass /> Discover</span>
            <Link to="/search?q=action" className="footer__link">Action</Link>
            <Link to="/search?q=comedy" className="footer__link">Comedy</Link>
            <Link to="/search?q=drama" className="footer__link">Drama</Link>
          </nav>
          <div className="footer__meta">
            <span className="footer__meta-item"><FiShield /> Family friendly filtering</span>
            <a
              className="footer__meta-item"
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Data providers <FiArrowUpRight />
            </a>
          </div>
        </div>
        <div className="footer__row footer__row--copyright">
          <p>Cinephile © 2026. Built for modern movie discovery.</p>
          <button
            ref={backTopRef}
            type="button"
            className="footer__back-top magnetic"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FiChevronUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
