import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBookmark,
  FiCheck,
  FiPlayCircle,
  FiStar,
} from 'react-icons/fi';
import {
  getMediaId,
  getMediaRating,
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getPosterUrl,
} from '../../utils/media';
import './heroSection.scss';

const HeroSection = ({
  item,
  isSaved,
  onToggleSave,
  onExplore,
}) => {
  if (!item) {
    return (
      <section className="hero-section surface-card">
        <div className="hero-section__fallback">
          <h1 className="hero-section__title">Discover your next watch</h1>
          <p className="hero-section__subtitle">
            Discovery data is loading. Use filters or search to start exploring Cinephile.
          </p>
          <button type="button" className="btn btn--primary" onClick={onExplore}>
            Explore Movies
          </button>
        </div>
      </section>
    );
  }

  const title = getMediaTitle(item);
  const year = getMediaYear(item);
  const type = getMediaType(item);
  const rating = getMediaRating(item);
  const poster = getPosterUrl(item, 'w780');
  const detailsId = getMediaId(item);
  const hasExternalUrl = Boolean(item.externalUrl);

  return (
    <section className="hero-section surface-card">
      <div
        className="hero-section__backdrop"
        style={poster ? { backgroundImage: `url(${poster})` } : undefined}
        aria-hidden
      />
      <div className="hero-section__overlay" />
      <motion.div
        className="hero-section__content"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-section__eyebrow">Featured Pick</span>
        <h1 className="hero-section__title">{title}</h1>
        <p className="hero-section__subtitle">
          A highlighted discovery with high visual quality and curated metadata from
          current feeds.
        </p>
        <div className="hero-section__meta">
          {year && <span className="badge">{year}</span>}
          {type && <span className="badge">{type}</span>}
          {rating && (
            <span className="badge hero-section__rating">
              <FiStar />
              {rating}
            </span>
          )}
        </div>
        <div className="hero-section__actions">
          {hasExternalUrl ? (
            <a
              href={item.externalUrl}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiPlayCircle />
              View Details
            </a>
          ) : (
            <Link to={`/movie/${detailsId}`} className="btn btn--primary">
              <FiPlayCircle />
              View Details
            </Link>
          )}
          <button type="button" className="btn btn--ghost" onClick={onToggleSave}>
            {isSaved ? <FiCheck /> : <FiBookmark />}
            {isSaved ? 'Saved to Watchlist' : 'Add to Watchlist'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onExplore}>
            Explore Movies
          </button>
        </div>
      </motion.div>
    </section>
  );
};

HeroSection.propTypes = {
  item: PropTypes.shape({
    externalUrl: PropTypes.string,
  }),
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  onExplore: PropTypes.func,
};

HeroSection.defaultProps = {
  item: null,
  isSaved: false,
  onToggleSave: () => {},
  onExplore: () => {},
};

export default HeroSection;
