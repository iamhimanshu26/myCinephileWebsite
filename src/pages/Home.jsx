import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  fetchAsyncAnimeMovies,
  fetchAsyncAnimeShows,
} from '../redux/moviesSlice/moviesSlice';
import ContentSection from '../components/contentSection/ContentSection';
import './home.scss';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAsyncMovies('movie'));
    dispatch(fetchAsyncShows('series'));
    dispatch(fetchAsyncAnimeMovies());
    dispatch(fetchAsyncAnimeShows());
  }, [dispatch]);

  return (
    <main className="home">
      <div className="home__hero">
        <h1 className="home__title">CinePhile</h1>
        <p className="home__tagline">Discover movies, series & anime</p>
      </div>
      <div className="home__content">
        <ContentSection
          title="Movies"
          sectionId="movies"
          type="movies"
        />
        <ContentSection
          title="Series"
          sectionId="series"
          type="shows"
        />
        <ContentSection
          title="Latest Anime — Movies"
          sectionId="anime"
          type="animeMovies"
        />
        <ContentSection
          title="Latest Anime — Series"
          sectionId="anime-series"
          type="animeShows"
        />
      </div>
    </main>
  );
};

export default Home;
