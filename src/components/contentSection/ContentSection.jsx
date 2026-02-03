import React from 'react';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';
import {
  getAllMovies,
  getAllShows,
  getAnimeMovies,
  getAnimeShows,
} from '../../redux/moviesSlice/moviesSlice';
import MovieCard from '../movieCard/MovieCard';
import Settings from '../../settings';
import './contentSection.scss';

const selectors = {
  movies: getAllMovies,
  shows: getAllShows,
  animeMovies: getAnimeMovies,
  animeShows: getAnimeShows,
};

/* eslint-disable react/prop-types */
const ContentSection = ({ title, sectionId, type }) => {
  const data = useSelector(selectors[type]);
  const list = (data?.Response === 'True' && data.Search) ? data.Search : [];
  const error = data?.Error;

  const content =
    list.length > 0 ? (
      <Slider
        dots={Settings.dots}
        infinite={Settings.infinite}
        speed={Settings.speed}
        slidesToShow={Settings.slidesToShow}
        slidesToScroll={Settings.slidesToScroll}
        responsive={Settings.responsive}
      >
        {list.map((item) => (
          <MovieCard key={item.imdbID} data={item} />
        ))}
      </Slider>
    ) : (
      <p className="content-section-empty">
        {error || 'Nothing to show yet. Try searching above.'}
      </p>
    );

  return (
    <section id={sectionId} className="content-section">
      <h2 className="content-section__title">{title}</h2>
      <div className="content-section__slider">{content}</div>
    </section>
  );
};

export default ContentSection;
