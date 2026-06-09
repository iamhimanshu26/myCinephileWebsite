import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import MovieCard from '../movieCard/MovieCard';
import StateBlock from '../ui/StateBlock';
import './discoverySection.scss';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.02,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverySection = ({
  section,
  index,
}) => (
  <motion.section
    className="discovery-section"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={containerVariants}
    transition={{ delay: Math.min(index * 0.03, 0.2) }}
  >
    <header className="discovery-section__header">
      <div>
        <h2>{section.title}</h2>
        <p>{section.subtitle}</p>
      </div>
    </header>

    {section.items.length === 0 ? (
      <StateBlock
        title={`No titles in ${section.title}`}
        description="Try changing browse tabs or filters to load more titles."
        compact
      />
    ) : (
      <motion.div className="discovery-section__rail" variants={containerVariants}>
        {section.items.map((item) => (
          <motion.div
            key={item.imdbID || item.id}
            className="discovery-section__card"
            variants={cardVariants}
          >
            <MovieCard data={item} />
          </motion.div>
        ))}
      </motion.div>
    )}
  </motion.section>
);

DiscoverySection.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        imdbID: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.number,
};

DiscoverySection.defaultProps = {
  index: 0,
};

export default DiscoverySection;
