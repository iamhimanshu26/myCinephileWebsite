import React from 'react';
import PropTypes from 'prop-types';
import { FiBookmark, FiCalendar, FiClock, FiHeart, FiPlayCircle, FiStar } from 'react-icons/fi';
import ImageWithFallback from '../media/ImageWithFallback';
import { getMediaType, getMediaYear, getPosterUrl } from '../../utils/media';

const MovieDetailHero = ({
  data,
  inWatchlist,
  inFavorites,
  onToggleWatchlist,
  onToggleFavorite,
  onBookTicket,
}) => {
  const year = getMediaYear(data);
  const type = getMediaType(data);
  const genres = (data.Genre || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="detail-hero surface-card">
      <div className="detail-hero__poster">
        <ImageWithFallback
          src={getPosterUrl(data, 'w500')}
          alt={`${data.Title} poster`}
          title={data.Title}
          year={year}
          type={type}
          loading="eager"
        />
      </div>

      <div className="detail-hero__content">
        <span className="detail-hero__label">Cinematic Detail</span>
        <h1>{data.Title}</h1>
        <div className="detail-hero__meta">
          {year && (
            <span className="badge">
              <FiCalendar />
              {year}
            </span>
          )}
          {data.Runtime && (
            <span className="badge">
              <FiClock />
              {data.Runtime}
            </span>
          )}
          {data.imdbRating && (
            <span className="badge">
              <FiStar />
              {data.imdbRating}
            </span>
          )}
          {type && <span className="badge">{type}</span>}
          {data.Language && <span className="badge">{data.Language}</span>}
          {data.Country && <span className="badge">{data.Country}</span>}
        </div>
        {!!genres.length && (
          <div className="detail-hero__genres">
            {genres.map((genre) => (
              <span key={genre} className="badge">{genre}</span>
            ))}
          </div>
        )}
        <p className="detail-hero__plot">{data.Plot || 'Storyline unavailable for this title.'}</p>
        <div className="detail-hero__actions">
          <button type="button" className="btn btn--primary" onClick={onToggleWatchlist}>
            <FiBookmark />
            {inWatchlist ? 'Remove Watchlist' : 'Add to Watchlist'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onToggleFavorite}>
            <FiHeart />
            {inFavorites ? 'Remove Favorite' : 'Add to Favorites'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onBookTicket}>
            <FiPlayCircle />
            Book Ticket
          </button>
        </div>
      </div>
    </section>
  );
};

MovieDetailHero.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string,
    Plot: PropTypes.string,
    Genre: PropTypes.string,
    Runtime: PropTypes.string,
    Language: PropTypes.string,
    Country: PropTypes.string,
    imdbRating: PropTypes.string,
  }).isRequired,
  inWatchlist: PropTypes.bool,
  inFavorites: PropTypes.bool,
  onToggleWatchlist: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  onBookTicket: PropTypes.func,
};

MovieDetailHero.defaultProps = {
  inWatchlist: false,
  inFavorites: false,
  onToggleWatchlist: () => {},
  onToggleFavorite: () => {},
  onBookTicket: () => {},
};

export default MovieDetailHero;
