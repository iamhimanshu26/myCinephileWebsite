import React from 'react';
import PropTypes from 'prop-types';
import CaseStudyCard from './CaseStudyCard';

const TechStackCard = ({ item }) => (
  <CaseStudyCard
    title={item.name}
    subtitle={item.purpose}
    badge={item.status}
    className={`tech-card tech-card--${item.status.toLowerCase()}`}
  >
    <p>{item.note}</p>
  </CaseStudyCard>
);

TechStackCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Current', 'Future']).isRequired,
  }).isRequired,
};

export default TechStackCard;
