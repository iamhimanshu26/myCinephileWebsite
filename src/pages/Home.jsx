import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  fetchRecentMovies,
  fetchRecentShows,
  fetchRecentAnimeMoviesOMDb,
  fetchRecentAnimeShowsOMDb,
  fetchRecentMoviesOMDb,
  fetchRecentShowsOMDb,
  fetchTrendingMoviesTrakt,
  fetchTrendingShowsTrakt,
  fetchAiringTodayTVMaze,
  fetchTrendingAnimeAniList,
} from '../redux/moviesSlice/moviesSlice';
import {
  getAllMovies,
  getAllShows,
  getTrendingMovies,
  getTrendingShows,
  getAiringToday,
  getTrendingAnime,
} from '../redux/moviesSlice/moviesSlice';
import { hasTMDbKey } from '../redux/tmdbSlice/tmdbSlice';
import { hasTraktKey } from '../api/traktApi';
import MovieCard from '../components/movieCard/MovieCard';
import './home.scss';

const toList = (data) => {
  if (!data || data.Response !== 'True' || !data.Search) return [];
  return data.Search;
};

const currentYear = new Date().getFullYear();
const YEARS = ['All', ...Array.from({ length: 12 }, (_, i) => String(currentYear - i))];
const SORT_OPTIONS = ['Release Date', 'Title', 'Rating'];
const SORT_ORDER = ['Descending', 'Ascending'];

const Home = () => {
  const dispatch = useDispatch();
  const [browse, setBrowse] = useState('movies'); // 'movies' | 'series' | 'all'
  const [genre, setGenre] = useState('All');
  const [year, setYear] = useState('All');
  const [language, setLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Release Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [trendingTab, setTrendingTab] = useState('day'); // 'day' | 'week' | 'month'

  const moviesData = useSelector(getAllMovies);
  const showsData = useSelector(getAllShows);
  const trendingMoviesData = useSelector(getTrendingMovies);
  const trendingShowsData = useSelector(getTrendingShows);
  const airingTodayData = useSelector(getAiringToday);
  const trendingAnimeData = useSelector(getTrendingAnime);

  useEffect(() => {
    if (hasTMDbKey()) {
      dispatch(fetchRecentMovies());
      dispatch(fetchRecentShows());
    } else {
      dispatch(fetchRecentMoviesOMDb());
      dispatch(fetchRecentShowsOMDb());
    }
    dispatch(fetchRecentAnimeMoviesOMDb());
    dispatch(fetchRecentAnimeShowsOMDb());
    if (hasTraktKey()) {
      dispatch(fetchTrendingMoviesTrakt());
      dispatch(fetchTrendingShowsTrakt());
    }
    dispatch(fetchAiringTodayTVMaze());
    dispatch(fetchTrendingAnimeAniList());
  }, [dispatch]);

  const moviesList = useMemo(() => toList(moviesData), [moviesData]);
  const showsList = useMemo(() => toList(showsData), [showsData]);
  const trendingMoviesList = useMemo(() => toList(trendingMoviesData), [trendingMoviesData]);
  const trendingShowsList = useMemo(() => toList(trendingShowsData), [trendingShowsData]);

  const hasTrakt = hasTraktKey();
  const combinedForGrid = useMemo(() => {
    let items = [];
    if (browse === 'movies' || browse === 'all') {
      items = [...items, ...moviesList.map((m) => ({ ...m, _type: 'movie' }))];
      if (hasTrakt) items = [...items, ...trendingMoviesList.map((m) => ({ ...m, _type: 'movie' }))];
    }
    if (browse === 'series' || browse === 'all') {
      items = [...items, ...showsList.map((s) => ({ ...s, _type: 'show' }))];
      if (hasTrakt) items = [...items, ...trendingShowsList.map((s) => ({ ...s, _type: 'show' }))];
    }
    const byId = new Map();
    items.forEach((item) => {
      const id = item.imdbID || item.id;
      if (id && !byId.has(id)) byId.set(id, item);
    });
    let list = Array.from(byId.values());

    if (year !== 'All') {
      list = list.filter((item) => {
        const y = item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
        return y === year;
      });
    }

    const getYear = (item) => item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || '';
    const getTitle = (item) => (item.Title || item.title || item.name || '').toLowerCase();

    if (sortBy === 'Release Date') {
      list.sort((a, b) => {
        const ya = getYear(a);
        const yb = getYear(b);
        if (sortOrder === 'Descending') return (yb || '').localeCompare(ya || '');
        return (ya || '').localeCompare(yb || '');
      });
    } else if (sortBy === 'Title') {
      list.sort((a, b) => {
        const ta = getTitle(a);
        const tb = getTitle(b);
        return sortOrder === 'Descending' ? tb.localeCompare(ta) : ta.localeCompare(tb);
      });
    }

    return list;
  }, [browse, year, sortBy, sortOrder, hasTrakt, moviesList, showsList, trendingMoviesList, trendingShowsList]);

  const trendingSidebarList = useMemo(() => {
    if (trendingTab === 'day') return [...moviesList, ...trendingMoviesList].slice(0, 15);
    if (trendingTab === 'week') return [...trendingMoviesList, ...trendingShowsList].slice(0, 15);
    return [...showsList, ...trendingShowsList].slice(0, 15);
  }, [trendingTab, moviesList, showsList, trendingMoviesList, trendingShowsList]);

  const dropdownClass = 'home__filter-select';

  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home__content">
        <h1 className="home__title">Cinephile — Watch Movies Online Free</h1>

        <div className="home__filters">
          <div className="home__filter-group">
            <label className="home__filter-label">Browse</label>
            <select
              className={dropdownClass}
              value={browse}
              onChange={(e) => setBrowse(e.target.value)}
              aria-label="Browse"
            >
              <option value="all">All</option>
              <option value="movies">Movies</option>
              <option value="series">Series</option>
            </select>
          </div>
          <div className="home__filter-group">
            <label className="home__filter-label">Genre</label>
            <select
              className={dropdownClass}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              aria-label="Genre"
            >
              <option value="All">All</option>
              <option value="Action">Action</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>
          <div className="home__filter-group">
            <label className="home__filter-label">Year</label>
            <select
              className={dropdownClass}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Year"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <label className="home__filter-label">Language</label>
            <select
              className={dropdownClass}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
            >
              <option value="All">All</option>
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div className="home__filter-group">
            <label className="home__filter-label">Sort By</label>
            <select
              className={dropdownClass}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <label className="home__filter-label">Sort</label>
            <select
              className={dropdownClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
            >
              {SORT_ORDER.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="home__main-layout">
          <section className="home__grid-section" id="movies">
            <h2 className="home__section-title">
              <i className="bx bx-folder" />
              <i className="bx bx-play-circle" />
              Cinephile Top Movies
            </h2>
            <div className="home__movie-grid">
              {combinedForGrid.length === 0 ? (
                <p className="home__empty">Nothing to show yet. Try changing filters or search above.</p>
              ) : (
                combinedForGrid.map((item) => (
                  <MovieCard key={item.imdbID || item.id} data={item} />
                ))
              )}
            </div>
          </section>

          <aside className="home__sidebar">
            <div className="home__sidebar-tabs">
              {['day', 'week', 'month'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`home__sidebar-tab ${trendingTab === tab ? 'home__sidebar-tab--active' : ''}`}
                  onClick={() => setTrendingTab(tab)}
                >
                  Top {tab === 'day' ? 'Day' : tab === 'week' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>
            <ul className="home__sidebar-list">
              {trendingSidebarList.length === 0 ? (
                <li className="home__sidebar-empty">No trending items yet.</li>
              ) : (
                trendingSidebarList.map((item) => {
                  const id = item.imdbID || item.id;
                  const title = item.Title || item.title || item.name;
                  const year = item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || 'N/A';
                  const content = (
                    <>
                      <span className="home__sidebar-title">{title} ({year})</span>
                      <span className="home__sidebar-meta">HD — N/A</span>
                    </>
                  );
                  return (
                    <li key={id} className="home__sidebar-item">
                      {item.externalUrl ? (
                        <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="home__sidebar-link">
                          {content}
                        </a>
                      ) : (
                        <Link to={`/movie/${id}`} className="home__sidebar-link">{content}</Link>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        </div>
      </div>
    </motion.main>
  );
};

export default Home;
