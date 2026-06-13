import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiBookmark,
  FiClock,
  FiCompass,
  FiHeart,
  FiLoader,
  FiMap,
  FiRefreshCcw,
  FiSend,
  FiStar,
} from 'react-icons/fi';
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
  addToFavorites,
  getAllCollectionEntries,
  normalizeCollectionItem,
  removeFromCollection,
  removeFromFavorites,
} from '../redux/collectionSlice/collectionSlice';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import ImageWithFallback from '../components/media/ImageWithFallback';
import {
  getMediaId,
  getMediaRating,
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getPosterUrl,
} from '../utils/media';
import {
  getFallbackRecommendations,
  hasExternalAIProvider,
} from '../services/recommendationService';
import { buildTasteProfile } from '../services/personalizationService';
import { getRecentlyViewed } from '../services/recentlyViewedService';
import { getBookings } from '../services/bookingService';
import { getAllReviews } from '../services/reviewService';
import { addActivity } from '../services/activityService';
import './cinephileAI.scss';

const QUICK_PROMPTS = [
  'Date Night',
  'Weekend Anime',
  'Mind-Bending',
  'Emotional',
  'Family Night',
  'Thriller Under 2 Hours',
  'Like Interstellar',
  'Feel-Good',
  'Dark & Serious',
  'Motivational',
  'Short Runtime',
  'Award-Winning',
];

const toList = (data) => {
  if (!data || data.Response !== 'True' || !Array.isArray(data.Search)) return [];
  return data.Search;
};

const plannerDefaults = {
  availableTime: '120',
  mood: 'emotional',
  preferredType: 'movie',
  situation: 'alone',
  runtime: 'short',
};

const plannerSituationText = {
  alone: 'a solo session',
  family: 'a family watch',
  dateNight: 'a date night',
  friends: 'a group watch',
};

const CinephileAI = () => {
  const dispatch = useDispatch();
  const collectionEntries = useSelector(getAllCollectionEntries);

  const moviesData = useSelector(getAllMovies);
  const showsData = useSelector(getAllShows);
  const animeMoviesData = useSelector(getAnimeMovies);
  const animeShowsData = useSelector(getAnimeShows);
  const airingTodayData = useSelector(getAiringToday);
  const trendingAnimeData = useSelector(getTrendingAnime);
  const trendingMoviesData = useSelector(getTrendingMovies);
  const trendingShowsData = useSelector(getTrendingShows);

  const [prompt, setPrompt] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultPack, setResultPack] = useState(null);
  const [plannerInputs, setPlannerInputs] = useState(plannerDefaults);
  const [plannerResult, setPlannerResult] = useState(null);

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

  const catalogPools = useMemo(() => ({
    movies: moviesList,
    shows: showsList,
    anime: [...animeMoviesList, ...animeShowsList, ...trendingAnimeList],
    trending: [...trendingMoviesList, ...trendingShowsList, ...trendingAnimeList],
    airingToday: airingTodayList,
  }), [
    moviesList,
    showsList,
    animeMoviesList,
    animeShowsList,
    trendingAnimeList,
    trendingMoviesList,
    trendingShowsList,
    airingTodayList,
  ]);

  const tasteProfile = useMemo(() => buildTasteProfile({
    recentlyViewed: getRecentlyViewed(),
    reviews: getAllReviews(),
    bookings: getBookings(),
    collectionEntries,
    catalog: Object.values(catalogPools).flat(),
  }), [catalogPools, collectionEntries]);

  const watchlistIds = useMemo(
    () => new Set(collectionEntries.filter((item) => item.watchlist).map((item) => item.id)),
    [collectionEntries]
  );
  const favoriteIds = useMemo(
    () => new Set(collectionEntries.filter((item) => item.favorite).map((item) => item.id)),
    [collectionEntries]
  );

  const generateRecommendations = async (nextPrompt) => {
    const trimmedPrompt = nextPrompt.trim();
    if (!trimmedPrompt) return;
    setError('');
    setLoading(true);
    setActivePrompt(trimmedPrompt);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pack = getFallbackRecommendations({
        prompt: trimmedPrompt,
        catalogPools,
        tasteProfile,
        limit: 10,
      });
      if (!pack.results.length) {
        throw new Error('Could not generate recommendations right now. Try a different prompt.');
      }
      setResultPack(pack);
      addActivity({
        type: 'recommendation',
        title: `Generated Cinephile AI suggestions for "${trimmedPrompt}"`,
        metadata: { strategy: pack.strategy },
      });
    } catch (serviceError) {
      setError(serviceError.message || 'Could not generate recommendations right now. Try a different prompt.');
      setResultPack(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await generateRecommendations(prompt);
  };

  const handleApplyChip = (chip) => {
    setPrompt(chip);
    generateRecommendations(chip);
  };

  const handleToggleWatchlist = (item) => {
    const itemId = getMediaId(item);
    if (!itemId) return;
    if (watchlistIds.has(itemId)) {
      dispatch(removeFromCollection(itemId));
      addActivity({ type: 'watchlist', title: `Removed ${getMediaTitle(item)} from Watchlist` });
      return;
    }
    dispatch(addToCollection(normalizeCollectionItem(item)));
    addActivity({ type: 'watchlist', title: `Added ${getMediaTitle(item)} to Watchlist` });
  };

  const handleToggleFavorite = (item) => {
    const itemId = getMediaId(item);
    if (!itemId) return;
    if (favoriteIds.has(itemId)) {
      dispatch(removeFromFavorites(itemId));
      addActivity({ type: 'favorite', title: `Removed ${getMediaTitle(item)} from Favorites` });
      return;
    }
    dispatch(addToFavorites({ ...normalizeCollectionItem(item), watchlist: watchlistIds.has(itemId) }));
    addActivity({ type: 'favorite', title: `Added ${getMediaTitle(item)} to Favorites` });
  };

  const handlePlannerChange = (event) => {
    const { name, value } = event.target;
    setPlannerInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuildPlan = () => {
    const plannerPrompt = [
      plannerInputs.mood,
      plannerInputs.preferredType,
      plannerInputs.runtime,
      plannerInputs.situation,
      `available time ${plannerInputs.availableTime} minutes`,
    ].join(' ');
    const pack = getFallbackRecommendations({
      prompt: plannerPrompt,
      catalogPools,
      tasteProfile,
      limit: 1,
    });
    const topPick = pack.results[0];
    if (!topPick) {
      setPlannerResult(null);
      return;
    }
    const planText = (
      `Plan a ${plannerSituationText[plannerInputs.situation]} around `
      + `${getMediaTitle(topPick.item)} in a ${plannerInputs.runtime} runtime window.`
    );
    setPlannerResult({
      ...topPick,
      planText,
    });
    addActivity({
      type: 'planner',
      title: `Built watch plan with ${getMediaTitle(topPick.item)}`,
    });
  };

  return (
    <PageTransition className="cinephile-ai page-shell">
      <div className="cinephile-ai__container">
        <motion.section
          className="cinephile-ai__hero surface-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="cinephile-ai__eyebrow">CINEPHILE AI</span>
          <h1 className="page-title">Cinephile AI</h1>
          <p className="page-subtitle">
            Not sure what to watch? Tell Cinephile what you feel like watching and get personalized
            title suggestions.
          </p>
          <p className="cinephile-ai__demo-note">
            Cinephile AI currently uses demo recommendation logic and local activity data.
            {' '}
            It is designed to support future Gemini/OpenAI integration.
            {!hasExternalAIProvider() && ' External AI keys are not configured in this environment yet.'}
          </p>
        </motion.section>

        <section className="cinephile-ai__prompt surface-card">
          <h2>Describe your mood, situation, or movie taste</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              className="input cinephile-ai__textarea"
              rows={4}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={"I want something emotional but not too slow...\nSuggest movies like Interstellar...\nAnime movies for a peaceful weekend...\nThriller under 2 hours..."}
            />
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? <FiLoader className="is-spinning" /> : <FiSend />}
              Get Recommendations
            </button>
          </form>
          <div className="cinephile-ai__chips">
            {QUICK_PROMPTS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="badge cinephile-ai__chip"
                onClick={() => handleApplyChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <section className="surface-card cinephile-ai__loading">
            <h3>Finding the right titles for your mood...</h3>
            <div className="cinephile-ai__loading-dots" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </section>
        )}

        {!!error && (
          <StateBlock
            variant="error"
            title="Could not generate recommendations right now. Try a different prompt."
            description={error}
            actionLabel="Retry"
            onAction={() => generateRecommendations(activePrompt || prompt)}
          />
        )}

        {!loading && !error && !resultPack && (
          <StateBlock
            title="Describe your mood, situation, or movie taste"
            description="Cinephile AI will suggest titles that match your vibe and activity profile."
            compact
          />
        )}

        {!!resultPack && !loading && (
          <section className="cinephile-ai__results">
            <article className="surface-card cinephile-ai__explanation">
              <h2>Recommendation Explanation</h2>
              <p>{resultPack.explanation}</p>
              <span className="badge">Prompt: {activePrompt}</span>
            </article>
            <motion.div
              className="cinephile-ai__results-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {resultPack.results.map((entry) => {
                const item = entry.item;
                const itemId = getMediaId(item);
                const isMovie = getMediaType(item) === 'Movie';
                return (
                  <motion.article
                    key={`${itemId}-${entry.reason}`}
                    className="surface-card cinephile-ai-card"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="cinephile-ai-card__poster">
                      <ImageWithFallback
                        src={getPosterUrl(item, 'w500')}
                        alt={`${getMediaTitle(item)} poster`}
                        title={getMediaTitle(item)}
                        year={getMediaYear(item)}
                        type={getMediaType(item)}
                      />
                    </div>
                    <div className="cinephile-ai-card__content">
                      <h3>{getMediaTitle(item)}</h3>
                      <div className="cinephile-ai-card__meta">
                        <span className="badge">{getMediaYear(item) || 'Unknown year'}</span>
                        <span className="badge">{getMediaType(item)}</span>
                        {!!getMediaRating(item) && (
                          <span className="badge">
                            <FiStar />
                            {getMediaRating(item)}
                          </span>
                        )}
                        {!!item.Runtime && (
                          <span className="badge">
                            <FiClock />
                            {item.Runtime}
                          </span>
                        )}
                      </div>
                      {item.Genre && <p className="cinephile-ai-card__genre">{item.Genre}</p>}
                      <p className="cinephile-ai-card__reason">{entry.reason}</p>
                      <div className="cinephile-ai-card__actions">
                        <Link to={`/movie/${itemId}`} className="btn btn--primary">View Details</Link>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => handleToggleWatchlist(item)}
                        >
                          <FiBookmark />
                          {watchlistIds.has(itemId) ? 'Saved' : 'Add to Watchlist'}
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => handleToggleFavorite(item)}
                        >
                          <FiHeart />
                          {favoriteIds.has(itemId) ? 'Favorited' : 'Add to Favorites'}
                        </button>
                        {isMovie && (
                          <Link to={`/booking/${itemId}`} className="btn btn--ghost">
                            <FiMap />
                            Book Ticket
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </section>
        )}

        <section className="surface-card cinephile-ai__planner">
          <div className="cinephile-ai__planner-header">
            <h2>Watch Planner</h2>
            <p>Plan what to watch tonight or over the weekend.</p>
          </div>
          <div className="cinephile-ai__planner-grid">
            <label htmlFor="planner-time">
              Available time
              <select
                id="planner-time"
                name="availableTime"
                className="select"
                value={plannerInputs.availableTime}
                onChange={handlePlannerChange}
              >
                <option value="90">~ 90 minutes</option>
                <option value="120">~ 2 hours</option>
                <option value="180">~ 3 hours</option>
              </select>
            </label>
            <label htmlFor="planner-mood">
              Mood
              <select
                id="planner-mood"
                name="mood"
                className="select"
                value={plannerInputs.mood}
                onChange={handlePlannerChange}
              >
                <option value="emotional">Emotional</option>
                <option value="mind-bending">Mind-bending</option>
                <option value="motivational">Motivational</option>
                <option value="dark">Dark</option>
                <option value="feel-good">Feel-good</option>
              </select>
            </label>
            <label htmlFor="planner-type">
              Preferred type
              <select
                id="planner-type"
                name="preferredType"
                className="select"
                value={plannerInputs.preferredType}
                onChange={handlePlannerChange}
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
                <option value="anime">Anime</option>
              </select>
            </label>
            <label htmlFor="planner-situation">
              Watching with
              <select
                id="planner-situation"
                name="situation"
                className="select"
                value={plannerInputs.situation}
                onChange={handlePlannerChange}
              >
                <option value="alone">Alone</option>
                <option value="family">Family</option>
                <option value="dateNight">Date night</option>
                <option value="friends">Friends</option>
              </select>
            </label>
            <label htmlFor="planner-runtime">
              Runtime style
              <select
                id="planner-runtime"
                name="runtime"
                className="select"
                value={plannerInputs.runtime}
                onChange={handlePlannerChange}
              >
                <option value="short">Short runtime</option>
                <option value="long">Long/epic runtime</option>
              </select>
            </label>
          </div>
          <button type="button" className="btn btn--primary" onClick={handleBuildPlan}>
            <FiCompass />
            Build Watch Plan
          </button>

          {plannerResult ? (
            <article className="surface-card cinephile-ai__planner-result">
              <h3>Suggested plan: {getMediaTitle(plannerResult.item)}</h3>
              <p>{plannerResult.reason}</p>
              <p>{plannerResult.planText}</p>
              <div className="cinephile-ai__planner-actions">
                <Link to={`/movie/${getMediaId(plannerResult.item)}`} className="btn btn--primary">
                  View Details
                </Link>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => handleToggleWatchlist(plannerResult.item)}
                >
                  <FiBookmark />
                  Add to Watchlist
                </button>
                {getMediaType(plannerResult.item) === 'Movie' && (
                  <Link to={`/booking/${getMediaId(plannerResult.item)}`} className="btn btn--ghost">
                    <FiMap />
                    Book Ticket
                  </Link>
                )}
              </div>
            </article>
          ) : (
            <StateBlock
              title="Need a plan?"
              description="Use the watch planner inputs above to get one guided title recommendation."
              compact
            />
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default CinephileAI;
