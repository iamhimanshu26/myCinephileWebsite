import React from 'react';
import { Link } from 'react-router-dom';
import './movieCard.scss';

/* eslint-disable react/prop-types */
const MovieCard = (props) => {
  const { data } = props;
  return (
    <div className="movie-card">
      <Link to={`/movie/${data.imdbID || data.id}`}>
        <div className="card-inner">
          <div className="card-top">
            <img
              src={
                data.Poster
                  || (data.poster_path
                    ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
                    : '')
              }
              alt={data.Title || data.title || data.name || 'Poster'}
            />
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
