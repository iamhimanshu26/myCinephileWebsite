import React from 'react';
import PropTypes from 'prop-types';
import CaseStudyCard from './CaseStudyCard';

const RoadmapCard = ({ section }) => (
  <CaseStudyCard title={section.title} className="roadmap-card">
    <ul className="roadmap-card__list">
      {section.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </CaseStudyCard>
);

RoadmapCard.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default RoadmapCard;
