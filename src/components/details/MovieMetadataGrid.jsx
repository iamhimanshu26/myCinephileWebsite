import React from 'react';
import PropTypes from 'prop-types';

const metadataConfig = [
  { key: 'Director', label: 'Director' },
  { key: 'Writer', label: 'Writer' },
  { key: 'Actors', label: 'Actors / Cast' },
  { key: 'Genre', label: 'Genre' },
  { key: 'Runtime', label: 'Runtime' },
  { key: 'Released', label: 'Release Date' },
  { key: 'Language', label: 'Language' },
  { key: 'Country', label: 'Country' },
  { key: 'Awards', label: 'Awards' },
  { key: 'imdbRating', label: 'IMDb Rating' },
  { key: 'imdbVotes', label: 'IMDb Votes' },
  { key: 'BoxOffice', label: 'Box Office' },
  { key: 'Production', label: 'Production' },
];

const MovieMetadataGrid = ({ data }) => (
  <section className="detail-metadata">
    <h2>Metadata</h2>
    <div className="detail-metadata__grid">
      {metadataConfig.map((entry) => (
        <article key={entry.key} className="detail-metadata__card surface-card">
          <h3>{entry.label}</h3>
          <p>{data[entry.key] || 'Not available'}</p>
        </article>
      ))}
    </div>
  </section>
);

MovieMetadataGrid.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MovieMetadataGrid;
