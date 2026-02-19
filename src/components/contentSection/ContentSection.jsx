import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  getAllMovies,
  getAllShows,
  getAnimeMovies,
  getAnimeShows,
  getTrendingMovies,
  getTrendingShows,
  getAiringToday,
  getTrendingAnime,
} from '../../redux/moviesSlice/moviesSlice';
import MovieCard from '../movieCard/MovieCard';
import Settings from '../../settings';
import './contentSection.scss';

const selectors = {
  movies: getAllMovies,
  shows: getAllShows,
  animeMovies: getAnimeMovies,
  animeShows: getAnimeShows,
  trendingMovies: getTrendingMovies,
  trendingShows: getTrendingShows,
  airingToday: getAiringToday,
  trendingAnime: getTrendingAnime,
};

/* eslint-disable react/prop-types */
const ContentSection = ({
  title, sectionId, type, index = 0,
}) => {
  const data = useSelector(selectors[type]);
  const list = (data?.Response === 'True' && data.Search) ? data.Search : [];
  const error = data?.Error;
  const isEmpty = list.length === 0;

  const content = isEmpty ? (
    <p className="content-section-empty">
      {error || 'Nothing to show yet. Try searching above.'}
    </p>
  ) : (
    <Slider
      dots={Settings.dots}
      infinite={Settings.infinite}
      speed={Settings.speed}
      slidesToShow={Settings.slidesToShow}
      slidesToScroll={Settings.slidesToScroll}
      responsive={Settings.responsive}
    >
      {list.map((item) => (
        <MovieCard key={item.imdbID || item.id} data={item} />
      ))}
    </Slider>
  );

  return (
    <motion.section
      id={sectionId}
      className="content-section"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.08 }}
    >
      <h2 className="content-section__title">{title}</h2>
      <div className="content-section__slider">{content}</div>
    </motion.section>
  );
};

export default ContentSection;
