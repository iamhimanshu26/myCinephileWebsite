import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MovieCard from '../movieCard/MovieCard';
import StateBlock from '../ui/StateBlock';

const SimilarMoviesSection = ({ items, movieId }) => (
  <section className="detail-similar">
    <div className="detail-similar__header">
      <h2>Similar Movies</h2>
      <Link to="/" className="detail-similar__cta">Explore More</Link>
    </div>
    {items.length === 0 ? (
      <StateBlock
        title="No similar movies yet"
        description="We could not build a strong similar list for this title yet."
        compact
      />
    ) : (
      <div className="detail-similar__grid">
        {items
          .filter((entry) => (entry.imdbID || entry.id) !== movieId)
          .slice(0, 8)
          .map((entry) => (
            <MovieCard key={entry.imdbID || entry.id} data={entry} />
          ))}
      </div>
    )}
  </section>
);

SimilarMoviesSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  movieId: PropTypes.string.isRequired,
};

SimilarMoviesSection.defaultProps = {
  items: [],
};

export default SimilarMoviesSection;
