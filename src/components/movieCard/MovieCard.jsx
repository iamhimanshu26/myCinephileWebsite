import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiBookmark, FiCheck, FiStar } from 'react-icons/fi';
import {
  addToCollection,
  normalizeCollectionItem,
  isInCollection,
  removeFromCollection,
} from '../../redux/collectionSlice/collectionSlice';
import { addActivity } from '../../services/activityService';
import useMagneticHover from '../../hooks/useMagneticHover';
import ImageWithFallback from '../media/ImageWithFallback';
import {
  getMediaRating,
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getPosterUrl,
} from '../../utils/media';
import './movieCard.scss';

/* eslint-disable react/prop-types */
const MovieCard = (props) => {
  const { data } = props;
  const dispatch = useDispatch();
  const collectionButtonRef = useMagneticHover(4);
  const itemId = data.imdbID || data.id;
  const inCollection = useSelector(isInCollection(itemId));
  const title = getMediaTitle(data);
  const year = getMediaYear(data);
  const type = getMediaType(data);
  const rating = getMediaRating(data);
  const posterUrl = getPosterUrl(data, 'w500');

  const handleCollectionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCollection) {
      dispatch(removeFromCollection(itemId));
      addActivity({
        type: 'watchlist',
        title: `Removed ${title} from Watchlist`,
      });
    } else {
      dispatch(addToCollection(normalizeCollectionItem(data)));
      addActivity({
        type: 'watchlist',
        title: `Added ${title} to Watchlist`,
      });
    }
  };

  const cardContent = (
    <article className="movie-card__inner">
      <div className="movie-card__poster">
        <ImageWithFallback
          src={posterUrl}
          alt={`${title} poster`}
          title={title}
          year={year}
          type={type}
          className="movie-card__poster-media"
          imageClassName="movie-card__poster-image"
        />
        <span className="movie-card__view-more">View details</span>
      </div>
      <div className="movie-card__content">
        <h3 className="movie-card__title">{title}</h3>
        <div className="movie-card__meta">
          <span className="movie-card__meta-pill">{year || 'Unknown year'}</span>
          {type && <span className="movie-card__meta-pill">{type}</span>}
          {rating && (
            <span className="movie-card__meta-pill movie-card__meta-pill--rating">
              <FiStar />
              {rating}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  const isExternal = Boolean(data.externalUrl);

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22 }}
    >
      {!isExternal && (
        <button
          ref={collectionButtonRef}
          type="button"
          className={`movie-card__collection-btn magnetic ${inCollection ? 'movie-card__collection-btn--saved' : ''}`}
          onClick={handleCollectionClick}
          aria-label={inCollection ? 'Remove from collection' : 'Add to collection'}
          title={inCollection ? 'Remove from collection' : 'Add to collection'}
        >
          {inCollection ? <FiCheck aria-hidden /> : <FiBookmark aria-hidden />}
        </button>
      )}
      {isExternal ? (
        <a
          href={data.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="movie-card__link"
        >
          {cardContent}
        </a>
      ) : (
        <Link to={`/movie/${itemId}`} className="movie-card__link">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
};

export default MovieCard;
