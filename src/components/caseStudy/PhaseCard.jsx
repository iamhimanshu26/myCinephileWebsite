import React from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import CaseStudyCard from './CaseStudyCard';

const statusIcon = (status) => {
  if (status === 'Completed') return <FiCheckCircle />;
  return <FiClock />;
};

const PhaseCard = ({ phase }) => (
  <CaseStudyCard
    title={phase.name}
    badge={phase.status}
    icon={statusIcon(phase.status)}
    className="phase-card"
  >
    <ul className="phase-card__list">
      <li>
        <strong>Problem:</strong>
        {' '}
        {phase.problem}
      </li>
      <li>
        <strong>Solution:</strong>
        {' '}
        {phase.solution}
      </li>
      <li>
        <strong>Result:</strong>
        {' '}
        {phase.result}
      </li>
    </ul>
  </CaseStudyCard>
);

PhaseCard.propTypes = {
  phase: PropTypes.shape({
    name: PropTypes.string.isRequired,
    problem: PropTypes.string.isRequired,
    solution: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default PhaseCard;
