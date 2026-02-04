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
        <div className="footer__content__logo">
          <Link to="/" className="footer__logo-link">
            CinePhile
          </Link>
        </div>
        <div className="footer__content__menus">
          <div className="footer__content__menu">
            <span className="footer__menu-label">Explore</span>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/#movies" className="footer__link">Movies</Link>
            <Link to="/#series" className="footer__link">Series</Link>
            <Link to="/#anime" className="footer__link">Anime</Link>
          </div>
          <div className="footer__content__menu">
            <span className="footer__menu-label">Support</span>
            <Link to="/" className="footer__link">Contact us</Link>
            <Link to="/" className="footer__link">FAQ</Link>
            <Link to="/" className="footer__link">Privacy policy</Link>
          </div>
          <div className="footer__content__menu">
            <span className="footer__menu-label">Discover</span>
            <Link to="/search?q=action" className="footer__link">Action</Link>
            <Link to="/search?q=comedy" className="footer__link">Comedy</Link>
            <Link to="/search?q=drama" className="footer__link">Drama</Link>
          </div>
        </div>
        <div className="footer__content__copyright">
          <p>CinePhile © 2025 | Created with ♥</p>
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
