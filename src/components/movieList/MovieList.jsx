import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllMovies,
  getAllShows,
  fetchAsyncMovies,
  fetchAsyncShows,
} from '../../redux/moviesSlice/moviesSlice';
import MovieCard from '../movieCard/MovieCard';
import './movieList.scss';

// Assuming you have a Settings import or define it here
// If you don't have this file, I'll provide an example configuration below
import Settings from '../../settings';

const MovieList = () => {
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();

  const movies = useSelector(getAllMovies);
  const shows = useSelector(getAllShows);

  useEffect(() => {
    dispatch(fetchAsyncMovies('Superhero'));
    dispatch(fetchAsyncShows('Superhero'));
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (term.trim()) {
      dispatch(fetchAsyncMovies(term));
      dispatch(fetchAsyncShows(term));
      setTerm('');
    }
  };

  // Preparing the rendering of movies for the slider
  const renderMovies = movies.Response === 'True' ? (
    movies.Search.map((movie) => (
      <MovieCard key={movie.imdbID} data={movie} />
    ))
  ) : (
    <div className="movies-error">
      {movies.Error || 'No movies found'}
    </div>
  );

  // Preparing the rendering of shows for the slider
  const renderShows = shows.Response === 'True' ? (
    shows.Search.map((show) => (
      <MovieCard key={show.imdbID} data={show} />
    ))
  ) : (
    <div className="shows-error">
      {shows.Error || 'No shows found'}
    </div>
  );

  return (
    <div>
      <div className="search-bar">
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <input
              id="movie-search"
              name="movie-search"
              type="text"
              placeholder="Movies and Shows"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search Movies and Shows"
            />
            <button type="submit" aria-label="Search">
              <i className="fa fa-search" />
            </button>
          </div>
        </form>
      </div>

      <div className="movie-wrapper">
        <div className="movie-list">
          <h2>Movies</h2>
          <div className="movie-container">
            <Slider
              dots={Settings.dots}
              infinite={Settings.infinite}
              speed={Settings.speed}
              slidesToShow={Settings.slidesToShow}
              slidesToScroll={Settings.slidesToScroll}
              responsive={Settings.responsive}
            >
              {renderMovies}
            </Slider>
          </div>
        </div>

        <div className="shows-list">
          <h2>Shows</h2>
          <div className="movie-container">
            <Slider
              dots={Settings.dots}
              infinite={Settings.infinite}
              speed={Settings.speed}
              slidesToShow={Settings.slidesToShow}
              slidesToScroll={Settings.slidesToScroll}
              responsive={Settings.responsive}
            >
              {renderShows}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
