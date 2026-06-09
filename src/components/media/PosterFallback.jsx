import React from 'react';
import PropTypes from 'prop-types';
import { FiFilm } from 'react-icons/fi';
import './posterFallback.scss';

const PosterFallback = ({
  title,
  year,
  type,
  className,
}) => (
  <div className={`poster-fallback ${className || ''}`}>
    <div className="poster-fallback__texture" aria-hidden />
    <div className="poster-fallback__badge">
      <FiFilm />
      <span>Cinephile</span>
    </div>
    <div className="poster-fallback__content">
      <h4>{title || 'Untitled'}</h4>
      <div className="poster-fallback__meta">
        {year && <span>{year}</span>}
        {type && <span>{type}</span>}
      </div>
    </div>
  </div>
);

PosterFallback.propTypes = {
  title: PropTypes.string,
  year: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};

PosterFallback.defaultProps = {
  title: '',
  year: '',
  type: '',
  className: '',
};

export default PosterFallback;
