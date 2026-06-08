import React from 'react';
import PropTypes from 'prop-types';

const WorkflowStep = ({ step, index }) => (
  <article className="workflow-step surface-card">
    <span className="workflow-step__index">{index + 1}</span>
    <div>
      <h4>{step.title}</h4>
      <p>{step.description}</p>
    </div>
  </article>
);

WorkflowStep.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default WorkflowStep;
