import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const PageTransition = ({ children, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PageTransition.defaultProps = {
  className: '',
};

export default PageTransition;
