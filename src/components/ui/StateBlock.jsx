import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiInbox, FiLoader } from 'react-icons/fi';
import './stateBlock.scss';

const icons = {
  empty: FiInbox,
  error: FiAlertCircle,
  loading: FiLoader,
};

const StateBlock = ({
  variant = 'empty',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  compact = false,
}) => {
  const Icon = icons[variant] || FiInbox;
  const className = `state-block state-block--${variant} ${compact ? 'state-block--compact' : ''}`;

  return (
    <section className={className} role={variant === 'error' ? 'alert' : 'status'} aria-live="polite">
      <div className="state-block__icon-wrap">
        <Icon className={`state-block__icon ${variant === 'loading' ? 'state-block__icon--spin' : ''}`} />
      </div>
      <h3 className="state-block__title">{title}</h3>
      {description ? <p className="state-block__description">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Link className="btn btn--primary state-block__action" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction ? (
        <button type="button" className="btn btn--primary state-block__action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
};

StateBlock.propTypes = {
  variant: PropTypes.oneOf(['empty', 'error', 'loading']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionTo: PropTypes.string,
  onAction: PropTypes.func,
  compact: PropTypes.bool,
};

StateBlock.defaultProps = {
  variant: 'empty',
  description: '',
  actionLabel: '',
  actionTo: '',
  onAction: null,
  compact: false,
};

export default StateBlock;
