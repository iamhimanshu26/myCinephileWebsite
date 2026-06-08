import React from 'react';
import PropTypes from 'prop-types';
import './skeletonCards.scss';

const SkeletonCards = ({ count = 6, compact = false }) => (
  <div className={`skeleton-cards ${compact ? 'skeleton-cards--compact' : ''}`} aria-hidden>
    {Array.from({ length: count }).map((_, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <article className="skeleton-card" key={idx}>
        <div className="skeleton-card__poster" />
        <div className="skeleton-card__line skeleton-card__line--title" />
        <div className="skeleton-card__line skeleton-card__line--meta" />
      </article>
    ))}
  </div>
);

SkeletonCards.propTypes = {
  count: PropTypes.number,
  compact: PropTypes.bool,
};

SkeletonCards.defaultProps = {
  count: 6,
  compact: false,
};

export default SkeletonCards;
