import React from 'react';
import PropTypes from 'prop-types';

const CaseStudyTabs = ({ tabs, activeTab, onChange }) => (
  <nav className="case-tabs" aria-label="How we built tabs">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`case-tabs__item ${activeTab === tab.id ? 'is-active' : ''}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

CaseStudyTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CaseStudyTabs;
