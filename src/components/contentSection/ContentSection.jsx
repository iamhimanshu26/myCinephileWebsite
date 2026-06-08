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
import StateBlock from '../ui/StateBlock';
import SkeletonCards from '../ui/SkeletonCards';
import Settings from '../../settings';
import { applyCatalogFilters } from '../../utils/catalogFilters';
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
  title,
  sectionId,
  type,
  index = 0,
  yearFilter,
  genreFilter,
  countryFilter,
  languageFilter,
  sortBy,
  sortOrder,
}) => {
  const data = useSelector(selectors[type]);
  const loading = !data || Object.keys(data).length === 0;
  const rawList = (data?.Response === 'True' && data.Search) ? data.Search : [];
  const list = applyCatalogFilters(rawList, {
    year: yearFilter,
    genre: genreFilter,
    country: countryFilter,
    language: languageFilter,
    sortBy,
    sortOrder,
  });
  const error = data?.Response === 'False' ? data.Error : '';
  const isEmpty = list.length === 0;

  let content = (
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

  if (loading) {
    content = <SkeletonCards count={8} compact />;
  } else if (isEmpty) {
    content = (
      <StateBlock
        variant={error ? 'error' : 'empty'}
        title={error ? 'Could not load this section' : 'No titles available yet'}
        description={error || 'Try another filter or refresh the page.'}
        compact
      />
    );
  }

  return (
    <motion.section
      id={sectionId}
      className="content-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.06 + index * 0.05 }}
    >
      <h2 className="content-section__title">{title}</h2>
      <div className="content-section__slider">{content}</div>
    </motion.section>
  );
};

export default ContentSection;
