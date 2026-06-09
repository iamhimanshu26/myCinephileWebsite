import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './categoryTabs.scss';

const CategoryTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="category-tabs" role="tablist" aria-label="Browse categories">
    {tabs.map((tab) => (
      <motion.button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        className={`category-tabs__item ${activeTab === tab.id ? 'is-active' : ''}`}
        onClick={() => onTabChange(tab.id)}
        whileTap={{ scale: 0.98 }}
      >
        {tab.label}
      </motion.button>
    ))}
  </div>
);

CategoryTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default CategoryTabs;
