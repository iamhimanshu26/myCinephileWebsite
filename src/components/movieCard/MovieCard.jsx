import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './movieCard.scss';

/* eslint-disable react/prop-types */
const MovieCard = (props) => {
  const { data } = props;
  const [imgError, setImgError] = useState(false);

  let posterUrl = '';
  if (data.Poster && data.Poster !== 'N/A') {
    posterUrl = data.Poster;
  } else if (data.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
  }
  const usePlaceholder = !posterUrl || imgError;

  return (
    <div className="movie-card">
      <Link to={`/movie/${data.imdbID || data.id}`}>
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
      </Link>
    </div>
  );
};

export default MovieCard;
