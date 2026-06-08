import React from 'react';
import PropTypes from 'prop-types';

const CaseStudyCard = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  className,
}) => (
  <article className={`case-card surface-card ${className}`}>
    <header className="case-card__header">
      <div className="case-card__title-wrap">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="case-card__meta">
        {badge ? <span className="badge">{badge}</span> : null}
        {icon ? <span className="case-card__icon" aria-hidden>{icon}</span> : null}
      </div>
    </header>
    <div className="case-card__content">{children}</div>
  </article>
);

CaseStudyCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CaseStudyCard.defaultProps = {
  subtitle: '',
  badge: '',
  icon: null,
  className: '',
};

export default CaseStudyCard;
