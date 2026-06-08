import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiFolder, FiPlayCircle } from 'react-icons/fi';
import {
  fetchRecentMovies,
  fetchRecentShows,
  fetchRecentAnimeMovies,
  fetchRecentAnimeShows,
  fetchRecentAnimeMoviesOMDb,
  fetchRecentAnimeShowsOMDb,
  fetchRecentMoviesOMDb,
  fetchRecentShowsOMDb,
  fetchTrendingMoviesTrakt,
  fetchTrendingShowsTrakt,
  fetchAiringTodayTVMaze,
  fetchTrendingAnimeAniList,
  getAllMovies,
  getAllShows,
  getTrendingMovies,
  getTrendingShows,
} from '../redux/moviesSlice/moviesSlice';
import { hasTMDbKey } from '../redux/tmdbSlice/tmdbSlice';
import { hasTraktKey } from '../api/traktApi';
import { GENRE_OPTIONS, COUNTRY_OPTIONS } from '../constants/filters';
import MovieCard from '../components/movieCard/MovieCard';
import ContentSection from '../components/contentSection/ContentSection';
import StateBlock from '../components/ui/StateBlock';
import './home.scss';

const toList = (data) => {
  if (!data || data.Response !== 'True' || !data.Search) return [];
  return data.Search;
};

const currentYear = new Date().getFullYear();
const YEARS = ['All', ...Array.from({ length: 12 }, (_, i) => String(currentYear - i))];
const SORT_OPTIONS = ['Release Date', 'Title', 'Rating'];
const SORT_ORDER = ['Descending', 'Ascending'];

const matchesLanguage = (item, language) => {
  if (language === 'All') return true;
  const source = `${item.Language || ''} ${item.language || ''} ${item.original_language || ''}`.toLowerCase();
  if (language === 'en') return source.includes('english') || source.includes('en');
  if (language === 'ja') return source.includes('japanese') || source.includes('ja');
  return true;
};

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const yearFromUrl = searchParams.get('year') || 'All';
  const genreFromUrl = searchParams.get('genre') || 'All';
  const countryFromUrl = searchParams.get('country') || 'All';
  const [browse, setBrowse] = useState('movies'); // 'movies' | 'series' | 'all'
  const [language, setLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Release Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [trendingTab, setTrendingTab] = useState('day'); // 'day' | 'week' | 'month'

  const moviesData = useSelector(getAllMovies);
  const showsData = useSelector(getAllShows);
  const trendingMoviesData = useSelector(getTrendingMovies);
  const trendingShowsData = useSelector(getTrendingShows);

  useEffect(() => {
    if (hasTMDbKey()) {
      dispatch(fetchRecentMovies());
      dispatch(fetchRecentShows());
      dispatch(fetchRecentAnimeMovies());
      dispatch(fetchRecentAnimeShows());
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

    if (yearFromUrl !== 'All') {
      list = list.filter((item) => {
        const y = item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
        return y === yearFromUrl;
      });
    }
    if (genreFromUrl !== 'All') {
      const genreIdNum = Number(genreFromUrl);
      list = list.filter(
        (item) => Array.isArray(item.genre_ids) && item.genre_ids.includes(genreIdNum)
      );
    }
    if (countryFromUrl !== 'All') {
      list = list.filter(
        (item) => Array.isArray(item.origin_country) && item.origin_country.includes(countryFromUrl)
      );
    }
    list = list.filter((item) => matchesLanguage(item, language));

    const getYear = (item) => item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || '';
    const getTitle = (item) => (item.Title || item.title || item.name || '').toLowerCase();
    const getRating = (item) => Number.parseFloat(item.imdbRating || item.vote_average || 0) || 0;

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
    } else if (sortBy === 'Rating') {
      list.sort((a, b) => {
        const ra = getRating(a);
        const rb = getRating(b);
        return sortOrder === 'Descending' ? rb - ra : ra - rb;
      });
    }

    return list;
  }, [
    browse,
    yearFromUrl,
    genreFromUrl,
    countryFromUrl,
    language,
    sortBy,
    sortOrder,
    hasTrakt,
    moviesList,
    showsList,
    trendingMoviesList,
    trendingShowsList,
  ]);

  const handleYearChange = (y) => {
    const next = new URLSearchParams(searchParams);
    if (y === 'All') next.delete('year');
    else next.set('year', y);
    setSearchParams(next);
  };

  const handleGenreChange = (genreId) => {
    const next = new URLSearchParams(searchParams);
    if (genreId === 'All') next.delete('genre');
    else next.set('genre', genreId);
    setSearchParams(next);
  };

  const handleCountryChange = (countryCode) => {
    const next = new URLSearchParams(searchParams);
    if (countryCode === 'All') next.delete('country');
    else next.set('country', countryCode);
    setSearchParams(next);
  };

  const trendingSidebarList = useMemo(() => {
    const getItemYear = (item) => item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || '';
    let items = [];
    if (trendingTab === 'day') items = [...moviesList, ...trendingMoviesList];
    else if (trendingTab === 'week') items = [...trendingMoviesList, ...trendingShowsList];
    else items = [...showsList, ...trendingShowsList];
    if (yearFromUrl !== 'All') items = items.filter((item) => getItemYear(item) === yearFromUrl);
    if (genreFromUrl !== 'All') {
      const genreIdNum = Number(genreFromUrl);
      items = items.filter(
        (item) => Array.isArray(item.genre_ids) && item.genre_ids.includes(genreIdNum)
      );
    }
    if (countryFromUrl !== 'All') {
      items = items.filter(
        (item) => Array.isArray(item.origin_country) && item.origin_country.includes(countryFromUrl)
      );
    }
    items = items.filter((item) => matchesLanguage(item, language));
    return items.slice(0, 15);
  }, [
    trendingTab,
    yearFromUrl,
    genreFromUrl,
    countryFromUrl,
    language,
    moviesList,
    showsList,
    trendingMoviesList,
    trendingShowsList,
  ]);

  const dropdownClass = 'home__filter-select';

  return (
    <motion.main
      className="home page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home__content">
        <div className="page-header home__header">
          <h1 className="page-title home__title">Cinephile</h1>
          <p className="page-subtitle">
            Explore recently released, trending, and curated titles
            {' '}
            with one consistent discovery experience.
          </p>
        </div>

        <div className="home__filters">
          <div className="home__filter-group">
            <span id="filter-browse-label" className="home__filter-label">Browse</span>
            <select
              className={dropdownClass}
              value={browse}
              onChange={(e) => setBrowse(e.target.value)}
              aria-labelledby="filter-browse-label"
            >
              <option value="all">All</option>
              <option value="movies">Movies</option>
              <option value="series">Series</option>
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-genre-label" className="home__filter-label">Genre</span>
            <select
              className={dropdownClass}
              value={genreFromUrl}
              onChange={(e) => handleGenreChange(e.target.value)}
              aria-labelledby="filter-genre-label"
            >
              <option value="All">All</option>
              {GENRE_OPTIONS.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-country-label" className="home__filter-label">Country</span>
            <select
              className={dropdownClass}
              value={countryFromUrl}
              onChange={(e) => handleCountryChange(e.target.value)}
              aria-labelledby="filter-country-label"
            >
              <option value="All">All</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-year-label" className="home__filter-label">Year</span>
            <select
              className={dropdownClass}
              value={yearFromUrl}
              onChange={(e) => handleYearChange(e.target.value)}
              aria-labelledby="filter-year-label"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-language-label" className="home__filter-label">Language</span>
            <select
              className={dropdownClass}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-labelledby="filter-language-label"
            >
              <option value="All">All</option>
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-sortby-label" className="home__filter-label">Sort By</span>
            <select
              className={dropdownClass}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-labelledby="filter-sortby-label"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="home__filter-group">
            <span id="filter-sort-label" className="home__filter-label">Sort</span>
            <select
              className={dropdownClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-labelledby="filter-sort-label"
            >
              {SORT_ORDER.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="home__main-layout">
          <section className="home__grid-section" id="browse">
            <h2 className="home__section-title">
              <FiFolder />
              <FiPlayCircle />
              Cinephile Top Movies
            </h2>
            <div className="home__movie-grid">
              {combinedForGrid.length === 0 ? (
                <StateBlock
                  title="No matches for current filters"
                  description="Try changing genre, country, year, or language filters."
                  compact
                />
              ) : (
                combinedForGrid.map((item) => (
                  <MovieCard key={item.imdbID || item.id} data={item} />
                ))
              )}
            </div>
          </section>

          <aside className="home__sidebar">
            <div className="home__sidebar-tabs">
              {['day', 'week', 'month'].map((tab) => {
                const tabLabel = { day: 'Day', week: 'Week', month: 'Month' }[tab];
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`home__sidebar-tab ${trendingTab === tab ? 'home__sidebar-tab--active' : ''}`}
                    onClick={() => setTrendingTab(tab)}
                  >
                    Top {tabLabel}
                  </button>
                );
              })}
            </div>
            <ul className="home__sidebar-list">
              {trendingSidebarList.length === 0 ? (
                <li className="home__sidebar-empty">
                  <StateBlock
                    title="No trending items"
                    description="Trending lists will appear when provider data is available."
                    compact
                  />
                </li>
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

        <div className="home__sections">
          <ContentSection
            title="Recently Released — Movies"
            sectionId="movies"
            type="movies"
            index={0}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
          <ContentSection
            title="Recently Released — Series"
            sectionId="series"
            type="shows"
            index={1}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
          <ContentSection
            title="Recently Released — Anime Movies"
            sectionId="anime"
            type="animeMovies"
            index={2}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
          <ContentSection
            title="Recently Released — Anime Series"
            sectionId="anime-series"
            type="animeShows"
            index={3}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
          {hasTraktKey() && (
            <>
              <ContentSection
                title="Trending — Movies (Trakt)"
                sectionId="trending-movies"
                type="trendingMovies"
                index={4}
                yearFilter={yearFromUrl}
                genreFilter={genreFromUrl}
                countryFilter={countryFromUrl}
              />
              <ContentSection
                title="Trending — Series (Trakt)"
                sectionId="trending-shows"
                type="trendingShows"
                index={5}
                yearFilter={yearFromUrl}
                genreFilter={genreFromUrl}
                countryFilter={countryFromUrl}
              />
            </>
          )}
          <ContentSection
            title="Airing Today (TVMaze)"
            sectionId="airing-today"
            type="airingToday"
            index={6}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
          <ContentSection
            title="Trending — Anime (AniList)"
            sectionId="trending-anime"
            type="trendingAnime"
            index={7}
            yearFilter={yearFromUrl}
            genreFilter={genreFromUrl}
            countryFilter={countryFromUrl}
          />
        </div>
      </div>
    </motion.main>
  );
};

export default Home;
