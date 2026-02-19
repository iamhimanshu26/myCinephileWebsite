import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCollection,
  normalizeCollectionItem,
  isInCollection,
} from '../../redux/collectionSlice/collectionSlice';
import './movieCard.scss';

/* eslint-disable react/prop-types */
const MovieCard = (props) => {
  const { data } = props;
  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const itemId = data.imdbID || data.id;
  const inCollection = useSelector(isInCollection(itemId));

  let posterUrl = '';
  if (data.Poster && data.Poster !== 'N/A') {
    posterUrl = data.Poster;
  } else if (data.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
  }
  const usePlaceholder = !posterUrl || imgError;

  const handleCollectionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCollection) {
      dispatch(addToCollection(normalizeCollectionItem(data)));
    }
  };

  const cardContent = (
    <div className="card-inner">
      <div className="card-top">
        {usePlaceholder ? (
          <div className="card-poster-placeholder" aria-hidden>
            <i className="fa fa-film" />
          </div>
        ) : (
          <img
            src={posterUrl}
            alt={data.Title || data.title || data.name || 'Poster'}
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="card-bottom">
        <div className="card-info">
          <h4>{data.Title || data.title || data.name}</h4>
          <p>
            {data.Year
              || data.release_date?.slice(0, 4)
              || data.first_air_date?.slice(0, 4)}
          </p>
        </div>
      </div>
    </div>
  );

  const isExternal = Boolean(data.externalUrl);

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.35 }}
    >
      {!isExternal && (
        <button
          type="button"
          className={`movie-card__collection-btn ${inCollection ? 'movie-card__collection-btn--saved' : ''}`}
          onClick={handleCollectionClick}
          aria-label={inCollection ? 'In collection' : 'Add to collection'}
          title={inCollection ? 'In collection' : 'Add to collection'}
        >
          <i className={`fa ${inCollection ? 'fa-bookmark' : 'fa-bookmark-o'}`} aria-hidden />
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
        <Link to={`/movie/${itemId}`}>{cardContent}</Link>
      )}
    </motion.div>
  );
};

export default MovieCard;
