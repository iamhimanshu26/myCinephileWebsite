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
import SkeletonCards from '../components/ui/SkeletonCards';
import StateBlock from '../components/ui/StateBlock';
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

  const isMoviesLoading = q && Object.keys(movies || {}).length === 0;
  const isShowsLoading = q && Object.keys(shows || {}).length === 0;

  let renderMovies = movies.Response === 'True'
    ? movies.Search.map((movie) => <MovieCard key={movie.imdbID} data={movie} />)
    : (
      <StateBlock
        variant={movies.Error ? 'error' : 'empty'}
        title={movies.Error ? 'Movies could not be loaded' : 'No movies found'}
        description={movies.Error || 'Try searching with a different keyword.'}
        compact
      />
    );
  if (isMoviesLoading) {
    renderMovies = <SkeletonCards count={8} />;
  }

  let renderShows = shows.Response === 'True'
    ? shows.Search.map((show) => <MovieCard key={show.imdbID} data={show} />)
    : (
      <StateBlock
        variant={shows.Error ? 'error' : 'empty'}
        title={shows.Error ? 'Series could not be loaded' : 'No series found'}
        description={shows.Error || 'Try searching with a different keyword.'}
        compact
      />
    );
  if (isShowsLoading) {
    renderShows = <SkeletonCards count={8} />;
  }

  return (
    <div className="search-page page-shell">
      <div className="search-page-header page-header">
        <h1 className="page-title">
          {q ? `Results for “${q}”` : 'Search movies & series'}
        </h1>
        <p className="page-subtitle">Search across movies and TV series powered by OMDb.</p>
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
        <StateBlock
          title="Start your search"
          description="Use the search bar in the header to find movies and series."
          compact
        />
      )}
    </div>
  );
};

export default Search;
