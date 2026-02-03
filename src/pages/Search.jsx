import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  getAllMovies,
  getAllShows,
} from '../redux/moviesSlice/moviesSlice';
import MovieCard from '../components/movieCard/MovieCard';
import './search.scss';

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const movies = useSelector(getAllMovies);
  const shows = useSelector(getAllShows);
  useEffect(() => {
    if (q.trim()) {
      dispatch(fetchAsyncMovies(q.trim()));
      dispatch(fetchAsyncShows(q.trim()));
    }
  }, [q, dispatch]);

  const renderMovies =
    movies.Response === 'True' ? (
      movies.Search.map((movie) => <MovieCard key={movie.imdbID} data={movie} />)
    ) : (
      <p className="search-empty">{movies.Error || 'No movies found'}</p>
    );

  const renderShows =
    shows.Response === 'True' ? (
      shows.Search.map((show) => <MovieCard key={show.imdbID} data={show} />)
    ) : (
      <p className="search-empty">{shows.Error || 'No series found'}</p>
    );

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>
          {q ? `Results for “${q}”` : 'Search movies & series'}
        </h1>
      </div>
      {q ? (
        <div className="search-results">
          <section className="search-section">
            <h2>Movies</h2>
            <div className="search-grid">{renderMovies}</div>
          </section>
          <section className="search-section">
            <h2>Series</h2>
            <div className="search-grid">{renderShows}</div>
          </section>
        </div>
      ) : (
        <p className="search-hint">Use the search bar above to find movies and series.</p>
      )}
    </div>
  );
};

export default Search;
