import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiRotateCcw } from 'react-icons/fi';
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
  getAnimeMovies,
  getAnimeShows,
  getAiringToday,
  getTrendingAnime,
  getTrendingMovies,
  getTrendingShows,
} from '../redux/moviesSlice/moviesSlice';
import { hasTMDbKey } from '../redux/tmdbSlice/tmdbSlice';
import { hasTraktKey } from '../api/traktApi';
import {
  addToCollection,
  isInCollection,
  normalizeCollectionItem,
  removeFromCollection,
} from '../redux/collectionSlice/collectionSlice';
import { GENRE_OPTIONS, COUNTRY_OPTIONS } from '../constants/filters';
import PageTransition from '../components/ui/PageTransition';
import {
  applyCatalogFilters,
  getLanguageFilterCoverage,
} from '../utils/catalogFilters';
import {
  buildDiscoverySections,
  DISCOVERY_MEDIA_TABS,
} from '../utils/discoverySections';
import { getMediaId, hasRenderablePoster } from '../utils/media';
import {
  getRecentlyViewed,
} from '../services/recentlyViewedService';
import CategoryTabs from '../components/discovery/CategoryTabs';
import HeroSection from '../components/discovery/HeroSection';
import DiscoverySection from '../components/discovery/DiscoverySection';
import './home.scss';

const toList = (data) => {
  if (!data || data.Response !== 'True' || !data.Search) return [];
  return data.Search;
};

const currentYear = new Date().getFullYear();
const YEARS = ['All', ...Array.from({ length: 12 }, (_, i) => String(currentYear - i))];
const SORT_OPTIONS = ['Release Date', 'Title', 'Rating'];
const SORT_ORDER = ['Descending', 'Ascending'];

const annotateCategory = (list, category) => list.map((item) => ({
  ...item,
  categoryTag: category,
}));

const Home = () => {
  const dispatch = useDispatch();
  const discoveryRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const yearFromUrl = searchParams.get('year') || 'All';
  const genreFromUrl = searchParams.get('genre') || 'All';
  const countryFromUrl = searchParams.get('country') || 'All';
  const [browse, setBrowse] = useState('all');
  const [language, setLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Release Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [recentlyViewed, setRecentlyViewed] = useState(
    () => getRecentlyViewed()
  );

  const moviesData = useSelector(getAllMovies);
  const showsData = useSelector(getAllShows);
  const animeMoviesData = useSelector(getAnimeMovies);
  const animeShowsData = useSelector(getAnimeShows);
  const airingTodayData = useSelector(getAiringToday);
  const trendingAnimeData = useSelector(getTrendingAnime);
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
  const animeMoviesList = useMemo(() => toList(animeMoviesData), [animeMoviesData]);
  const animeShowsList = useMemo(() => toList(animeShowsData), [animeShowsData]);
  const airingTodayList = useMemo(() => toList(airingTodayData), [airingTodayData]);
  const trendingAnimeList = useMemo(() => toList(trendingAnimeData), [trendingAnimeData]);
  const trendingMoviesList = useMemo(() => toList(trendingMoviesData), [trendingMoviesData]);
  const trendingShowsList = useMemo(() => toList(trendingShowsData), [trendingShowsData]);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  const activeFilters = useMemo(
    () => ({
      year: yearFromUrl,
      genre: genreFromUrl,
      country: countryFromUrl,
      language,
      sortBy,
      sortOrder,
    }),
    [yearFromUrl, genreFromUrl, countryFromUrl, language, sortBy, sortOrder]
  );

  const pools = useMemo(() => {
    const movies = annotateCategory(
      [
        ...moviesList,
        ...trendingMoviesList.filter((item) => hasRenderablePoster(item)),
      ],
      'movies'
    );
    const shows = annotateCategory(
      [
        ...showsList,
        ...trendingShowsList.filter((item) => hasRenderablePoster(item)),
        ...airingTodayList,
      ],
      'series'
    );
    const anime = annotateCategory(
      [...animeMoviesList, ...animeShowsList, ...trendingAnimeList],
      'anime'
    );
    const trending = annotateCategory(
      [...trendingMoviesList, ...trendingShowsList, ...trendingAnimeList],
      'movies'
    ).map((item) => {
      if (anime.some((animeItem) => getMediaId(animeItem) === getMediaId(item))) {
        return {
          ...item,
          categoryTag: 'anime',
        };
      }
      if (shows.some((showItem) => getMediaId(showItem) === getMediaId(item))) {
        return {
          ...item,
          categoryTag: 'series',
        };
      }
      return item;
    });

    return {
      movies,
      shows,
      anime,
      trending,
    };
  }, [
    moviesList,
    showsList,
    animeMoviesList,
    animeShowsList,
    airingTodayList,
    trendingMoviesList,
    trendingShowsList,
    trendingAnimeList,
  ]);

  const filteredCatalog = useMemo(() => {
    let base = [];
    if (browse === 'all' || browse === 'movies') base = [...base, ...pools.movies];
    if (browse === 'all' || browse === 'series') base = [...base, ...pools.shows];
    if (browse === 'all' || browse === 'anime') base = [...base, ...pools.anime];
    return applyCatalogFilters(base, activeFilters);
  }, [activeFilters, browse, pools]);

  const discoverySections = useMemo(
    () => buildDiscoverySections({
      browse,
      filters: activeFilters,
      movies: pools.movies,
      shows: pools.shows,
      anime: pools.anime,
      trending: pools.trending,
      recentlyViewed,
    }),
    [activeFilters, browse, pools, recentlyViewed]
  );

  const heroItem = useMemo(() => {
    const priorityOrder = ['trending-now', 'popular-movies', 'top-rated'];
    for (let i = 0; i < priorityOrder.length; i += 1) {
      const section = discoverySections.find((entry) => entry.id === priorityOrder[i]);
      const candidate = section?.items?.find((entry) => hasRenderablePoster(entry));
      if (candidate) return candidate;
    }
    return (
      discoverySections
        .flatMap((section) => section.items)
        .find((entry) => hasRenderablePoster(entry))
      || null
    );
  }, [discoverySections]);

  const heroId = getMediaId(heroItem || {});
  const heroIsSaved = useSelector(isInCollection(heroId || '__none__'));

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

  const languageCoverage = useMemo(
    () => getLanguageFilterCoverage(filteredCatalog),
    [filteredCatalog]
  );

  const handleResetFilters = () => {
    setSearchParams({});
    setBrowse('all');
    setLanguage('All');
    setSortBy('Release Date');
    setSortOrder('Descending');
  };

  const handleToggleHeroWatchlist = () => {
    if (!heroItem || !heroId) return;
    if (heroIsSaved) dispatch(removeFromCollection(heroId));
    else dispatch(addToCollection(normalizeCollectionItem(heroItem)));
  };

  const handleExplore = () => {
    discoveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const dropdownClass = 'home__filter-select';

  return (
    <PageTransition className="home page-shell">
      <div className="home__content">
        <div className="page-header home__header">
          <h1 className="page-title home__title">Cinephile Discovery</h1>
          <p className="page-subtitle">
            Explore movies, TV series, and anime through a cinematic discovery flow with curated
            sections, high-quality media cards, and reliable poster handling.
          </p>
        </div>

        <CategoryTabs
          tabs={DISCOVERY_MEDIA_TABS}
          activeTab={browse}
          onTabChange={setBrowse}
        />

        <HeroSection
          item={heroItem}
          isSaved={heroIsSaved}
          onToggleSave={handleToggleHeroWatchlist}
          onExplore={handleExplore}
        />

        <div className="home__filters surface-card">
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
              <option value="series">TV Series</option>
              <option value="anime">Anime</option>
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
          <div className="home__filter-actions">
            <button type="button" className="btn btn--ghost" onClick={handleResetFilters}>
              <FiRotateCcw />
              Reset Filters
            </button>
          </div>
        </div>

        <p className="home__result-count">
          {filteredCatalog.length}
          {' '}
          title(s) match current filters.
        </p>

        {language !== 'All' && languageCoverage.unsupportedCount > 0 && (
          <p className="home__filter-note">
            Language filtering is applied where provider metadata exists.
            {' '}
            {languageCoverage.unsupportedCount}
            {' '}
            title(s) currently use fallback metadata and are kept visible.
          </p>
        )}

        <div className="home__anchors" aria-hidden>
          <span id="movies" />
          <span id="series" />
          <span id="anime" />
        </div>

        <div className="home__sections" ref={discoveryRef}>
          {discoverySections.map((section, index) => (
            <DiscoverySection key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
