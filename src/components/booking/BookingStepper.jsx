import React from 'react';
import PropTypes from 'prop-types';

const BookingStepper = ({ steps, activeStep }) => (
  <ol className="booking-stepper">
    {steps.map((step, index) => {
      const isActive = index === activeStep;
      const isCompleted = index < activeStep;
      return (
        <li
          key={step}
          className={`booking-stepper__item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
        >
          <span className="booking-stepper__index">{index + 1}</span>
          <span className="booking-stepper__label">{step}</span>
        </li>
      );
    })}
  </ol>
);

BookingStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default BookingStepper;
