import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import StateBlock from '../ui/StateBlock';

const CastCrewSection = ({ cast }) => {
  if (!cast.length) {
    return (
      <section className="detail-cast">
        <h2>Cast & Crew</h2>
        <StateBlock
          title="Cast details are limited for this title"
          description="Extended cast credits are not available from the current provider response."
          compact
        />
      </section>
    );
  }

  return (
    <section className="detail-cast">
      <h2>Cast & Crew</h2>
      <div className="detail-cast__grid">
        {cast.map((person) => (
          <article key={person.id} className="detail-cast__card surface-card">
            <div className="detail-cast__avatar" aria-hidden>
              <FiUser />
            </div>
            <div className="detail-cast__info">
              <Link to={`/person/${person.id}`} className="detail-cast__name">
                {person.name}
              </Link>
              <p>{person.character || person.known_for_department || 'Cast member'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

CastCrewSection.propTypes = {
  cast: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      character: PropTypes.string,
      known_for_department: PropTypes.string,
    })
  ),
};

CastCrewSection.defaultProps = {
  cast: [],
};

export default CastCrewSection;
