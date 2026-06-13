import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MovieCard from '../movieCard/MovieCard';
import StateBlock from '../ui/StateBlock';

const SimilarMoviesSection = ({
  items,
  movieId,
  title,
  subtitle,
  explanation,
}) => (
  <section className="detail-similar">
    <div className="detail-similar__header">
      <div>
        <h2>{title}</h2>
        {!!subtitle && <p>{subtitle}</p>}
      </div>
      <Link to="/" className="detail-similar__cta">Explore More</Link>
    </div>
    {!!explanation && (
      <p className="detail-similar__explanation">{explanation}</p>
    )}
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
  title: PropTypes.string,
  subtitle: PropTypes.string,
  explanation: PropTypes.string,
};

SimilarMoviesSection.defaultProps = {
  items: [],
  title: 'You May Also Like',
  subtitle: '',
  explanation: '',
};

export default SimilarMoviesSection;
