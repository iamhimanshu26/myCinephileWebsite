import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  fetchRecentMovies,
  fetchRecentShows,
  fetchRecentAnimeMovies,
  fetchRecentAnimeShows,
  fetchRecentMoviesOMDb,
  fetchRecentShowsOMDb,
  fetchRecentAnimeMoviesOMDb,
  fetchRecentAnimeShowsOMDb,
  fetchTrendingMoviesTrakt,
  fetchTrendingShowsTrakt,
  fetchAiringTodayTVMaze,
  fetchTrendingAnimeAniList,
} from '../redux/moviesSlice/moviesSlice';
import { hasTMDbKey } from '../redux/tmdbSlice/tmdbSlice';
import { hasTraktKey } from '../api/traktApi';
import ContentSection from '../components/contentSection/ContentSection';
import './home.scss';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasTMDbKey()) {
      dispatch(fetchRecentMovies());
      dispatch(fetchRecentShows());
      dispatch(fetchRecentAnimeMovies());
      dispatch(fetchRecentAnimeShows());
    } else {
      dispatch(fetchRecentMoviesOMDb());
      dispatch(fetchRecentShowsOMDb());
      dispatch(fetchRecentAnimeMoviesOMDb());
      dispatch(fetchRecentAnimeShowsOMDb());
    }
    if (hasTraktKey()) {
      dispatch(fetchTrendingMoviesTrakt());
      dispatch(fetchTrendingShowsTrakt());
    }
    dispatch(fetchAiringTodayTVMaze());
    dispatch(fetchTrendingAnimeAniList());
  }, [dispatch]);

  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="home__hero"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="home__tagline">Discover movies, series & anime</p>
        {!hasTMDbKey() && (
          <p className="home__hint">
            Add REACT_APP_TMDB_KEY in Vercel for recently released & more sections.
          </p>
        )}
      </motion.div>
      <div className="home__content">
        <ContentSection
          title="Recently Released — Movies"
          sectionId="movies"
          type="movies"
          index={0}
        />
        <ContentSection
          title="Recently Released — Series"
          sectionId="series"
          type="shows"
          index={1}
        />
        <ContentSection
          title="Recently Released — Anime Movies"
          sectionId="anime"
          type="animeMovies"
          index={2}
        />
        <ContentSection
          title="Recently Released — Anime Series"
          sectionId="anime-series"
          type="animeShows"
          index={3}
        />
        {hasTraktKey() && (
          <>
            <ContentSection
              title="Trending — Movies (Trakt)"
              sectionId="trending-movies"
              type="trendingMovies"
              index={4}
            />
            <ContentSection
              title="Trending — Series (Trakt)"
              sectionId="trending-shows"
              type="trendingShows"
              index={5}
            />
          </>
        )}
        <ContentSection
          title="Airing Today (TVMaze)"
          sectionId="airing-today"
          type="airingToday"
          index={6}
        />
        <ContentSection
          title="Trending — Anime (AniList)"
          sectionId="trending-anime"
          type="trendingAnime"
          index={7}
        />
      </div>
    </motion.main>
  );
};

export default Home;
