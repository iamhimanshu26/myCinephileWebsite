import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';

/* eslint-disable arrow-body-style */
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__overlay" aria-hidden />
      <div className="footer__content container">
        <div className="footer__row footer__row--main">
          <Link to="/" className="footer__logo-link">Cinephile</Link>
          <nav className="footer__nav">
            <span className="footer__menu-label">Support</span>
            <Link to="/" className="footer__link">Contact</Link>
            <Link to="/" className="footer__link">FAQ</Link>
            <Link to="/" className="footer__link">Privacy</Link>
          </nav>
          <nav className="footer__nav">
            <span className="footer__menu-label">Discover</span>
            <Link to="/search?q=action" className="footer__link">Action</Link>
            <Link to="/search?q=comedy" className="footer__link">Comedy</Link>
            <Link to="/search?q=drama" className="footer__link">Drama</Link>
          </nav>
        </div>
        <div className="footer__row footer__row--copyright">
          <p>Cinephile © 2025 | Created with ♥</p>
          <button
            type="button"
            className="footer__back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <i className="fa fa-chevron-up" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
