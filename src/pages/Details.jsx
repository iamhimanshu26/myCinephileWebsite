import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllMovies,
  getAllShows,
  getAnimeMovies,
  getAnimeShows,
  getTrendingMovies,
  getTrendingShows,
  getAiringToday,
  getTrendingAnime,
  fetchAsyncMoviesOrShowsDetails,
  fetchAsyncDetailByTmdbId,
  getSelectedMovieOrShow,
} from '../redux/moviesSlice/moviesSlice';
import {
  findMovieByImdbId,
  fetchMovieCredits,
  fetchWatchProviders,
  getMovieCredits,
  getFindResult,
  getWatchProviders,
  hasTMDbKey,
  clearCredits,
  clearFind,
  clearWatchProviders,
} from '../redux/tmdbSlice/tmdbSlice';
import {
  addToCollection,
  addToFavorites,
  getAllCollectionEntries,
  removeFromCollection,
  removeFromFavorites,
  normalizeCollectionItem,
  isInCollection,
  isInFavorites,
} from '../redux/collectionSlice/collectionSlice';
import { isAdultContent } from '../utils/contentFilter';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import {
  addRecentlyViewed,
  getRecentlyViewed,
} from '../services/recentlyViewedService';
import { addActivity } from '../services/activityService';
import { getBookings } from '../services/bookingService';
import { getAllReviews } from '../services/reviewService';
import { buildTasteProfile } from '../services/personalizationService';
import { getFallbackRecommendations } from '../services/recommendationService';
import MovieDetailHero from '../components/details/MovieDetailHero';
import MovieMetadataGrid from '../components/details/MovieMetadataGrid';
import CastCrewSection from '../components/details/CastCrewSection';
import ReviewSection from '../components/details/ReviewSection';
import SimilarMoviesSection from '../components/details/SimilarMoviesSection';
import { getMediaTitle, getMediaType, getMediaYear } from '../utils/media';
import getSimilarTitles from '../utils/similarMovies';
import './details.scss';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  const allMovies = useSelector(getAllMovies);
  const allShows = useSelector(getAllShows);
  const animeMovies = useSelector(getAnimeMovies);
  const animeShows = useSelector(getAnimeShows);
  const trendingMovies = useSelector(getTrendingMovies);
  const trendingShows = useSelector(getTrendingShows);
  const airingToday = useSelector(getAiringToday);
  const trendingAnime = useSelector(getTrendingAnime);
  const credits = useSelector(getMovieCredits);
  const findResult = useSelector(getFindResult);
  const watchProviders = useSelector(getWatchProviders);
  const tmdbAvailable = hasTMDbKey();
  const inWatchlist = useSelector(isInCollection(id));
  const inFavorites = useSelector(isInFavorites(id));
  const collectionEntries = useSelector(getAllCollectionEntries);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const feedbackTimerRef = useRef(null);

  const toList = (payload) => (
    payload && payload.Response === 'True' && Array.isArray(payload.Search)
      ? payload.Search
      : []
  );

  useEffect(() => {
    if (!id) return;
    dispatch(clearCredits());
    dispatch(clearFind());
    dispatch(clearWatchProviders());
    if (id.startsWith('tt')) {
      dispatch(fetchAsyncMoviesOrShowsDetails(id));
    } else {
      dispatch(fetchAsyncDetailByTmdbId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!data || !data.imdbID || !tmdbAvailable) return;
    dispatch(findMovieByImdbId(data.imdbID));
  }, [data?.imdbID, dispatch, tmdbAvailable]);

  useEffect(() => {
    if (!findResult) return;
    const movie = findResult.movie_results?.[0];
    const tv = findResult.tv_results?.[0];
    const tmdbId = movie?.id ?? tv?.id;
    const mediaType = movie ? 'movie' : 'tv';
    if (tmdbId) {
      dispatch(fetchMovieCredits(tmdbId));
      dispatch(fetchWatchProviders({ id: tmdbId, mediaType }));
    }
  }, [findResult, dispatch]);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    if (isAdultContent(data)) return;
    const title = getMediaTitle(data);
    addRecentlyViewed({
      ...data,
      id,
      type: data.Type || getMediaType(data),
      Year: data.Year || getMediaYear(data),
    });
    addActivity({
      type: 'view',
      title: `Viewed ${title}`,
      metadata: { movieId: id },
    });
  }, [data, id]);

  useEffect(
    () => () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    },
    []
  );

  const cast = useMemo(
    () => (credits?.cast || []).slice(0, 16),
    [credits]
  );

  const catalogPools = useMemo(() => ({
    movies: toList(allMovies),
    shows: toList(allShows),
    anime: [...toList(animeMovies), ...toList(animeShows), ...toList(trendingAnime)],
    trending: [...toList(trendingMovies), ...toList(trendingShows), ...toList(trendingAnime)],
    airingToday: toList(airingToday),
  }), [
    allMovies,
    allShows,
    animeMovies,
    animeShows,
    trendingMovies,
    trendingShows,
    trendingAnime,
    airingToday,
  ]);

  const tasteProfile = useMemo(() => buildTasteProfile({
    recentlyViewed: getRecentlyViewed(),
    reviews: getAllReviews(),
    bookings: getBookings(),
    collectionEntries,
    catalog: Object.values(catalogPools).flat(),
  }), [catalogPools, collectionEntries]);

  const aiRecommendationPack = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return null;
    return getFallbackRecommendations({
      prompt: `Like ${getMediaTitle(data)} with ${data.Genre || 'strong storytelling'}`,
      catalogPools,
      tasteProfile,
      limit: 8,
    });
  }, [data, catalogPools, tasteProfile]);

  const similarItems = useMemo(() => getSimilarTitles({
    currentItem: data,
    candidatePools: [
      toList(allMovies),
      toList(allShows),
      toList(animeMovies),
      toList(animeShows),
      toList(trendingMovies),
      toList(trendingShows),
      toList(airingToday),
      toList(trendingAnime),
    ],
    limit: 10,
  }), [
    data,
    allMovies,
    allShows,
    animeMovies,
    animeShows,
    trendingMovies,
    trendingShows,
    airingToday,
    trendingAnime,
  ]);

  const watchNextItems = useMemo(() => {
    const fromAI = (aiRecommendationPack?.results || []).map((entry) => entry.item);
    const combined = [...fromAI, ...similarItems];
    const byId = new Map();
    combined.forEach((item) => {
      const mediaId = item.imdbID || item.id;
      if (!mediaId || mediaId === id || byId.has(mediaId)) return;
      byId.set(mediaId, item);
    });
    return Array.from(byId.values()).slice(0, 10);
  }, [aiRecommendationPack, similarItems, id]);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => setFeedbackMessage(''), 1800);
  };

  const normalizedItem = useMemo(
    () => normalizeCollectionItem({ ...data, id }),
    [data, id]
  );

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      dispatch(removeFromCollection(id));
      addActivity({
        type: 'watchlist',
        title: `Removed ${getMediaTitle(data)} from Watchlist`,
      });
      showFeedback('Removed from watchlist');
      return;
    }
    dispatch(addToCollection(normalizedItem));
    addActivity({
      type: 'watchlist',
      title: `Added ${getMediaTitle(data)} to Watchlist`,
    });
    showFeedback('Added to watchlist');
  };

  const handleToggleFavorite = () => {
    if (inFavorites) {
      dispatch(removeFromFavorites(id));
      addActivity({
        type: 'favorite',
        title: `Removed ${getMediaTitle(data)} from Favorites`,
      });
      showFeedback('Removed from favorites');
      return;
    }
    dispatch(addToFavorites({ ...normalizedItem, watchlist: normalizedItem.watchlist || false }));
    addActivity({
      type: 'favorite',
      title: `Added ${getMediaTitle(data)} to Favorites`,
    });
    showFeedback('Added to favorites');
  };

  const handleBookTicket = () => {
    navigate(`/booking/${id}`);
  };

  const handleReviewSaved = (payload = {}) => {
    const actionLabel = payload.action
      ? `${payload.action.charAt(0).toUpperCase()}${payload.action.slice(1)}`
      : 'Updated';
    const ratingLabel = payload.rating ? ` (${payload.rating} stars)` : '';
    addActivity({
      type: 'review',
      title: `${actionLabel} review for ${getMediaTitle(data)}${ratingLabel}`,
    });
  };

  return (
    <PageTransition className="details-page page-shell">
      <div className="back-container">
        <Link to="/" className="details-back-btn">
          <IoMdArrowRoundBack />
          <span>Back to home</span>
        </Link>
      </div>
      <div className="movie-section">
        {Object.keys(data).length === 0 && (
          <StateBlock
            variant="loading"
            title="Loading title details"
            description="Fetching cast, ratings, and streaming providers."
          />
        )}
        {Object.keys(data).length > 0 && isAdultContent(data) && (
          <StateBlock
            variant="empty"
            title="This title is hidden"
            description="This content is not displayed to keep the platform family-friendly."
            actionLabel="Back to home"
            actionTo="/"
          />
        )}
        {Object.keys(data).length > 0 && !isAdultContent(data) && (
          <>
            <div className="details-stack">
              {!!feedbackMessage && (
                <div className="details-feedback badge">{feedbackMessage}</div>
              )}
              <MovieDetailHero
                data={data}
                inWatchlist={inWatchlist}
                inFavorites={inFavorites}
                onToggleWatchlist={handleToggleWatchlist}
                onToggleFavorite={handleToggleFavorite}
                onBookTicket={handleBookTicket}
              />

              <section className="detail-storyline surface-card">
                <h2>Storyline</h2>
                <p>{data.Plot || 'No storyline available for this title yet.'}</p>
              </section>

              <MovieMetadataGrid data={data} />
              <CastCrewSection cast={cast} />
              <ReviewSection
                movieId={id}
                movieTitle={data.Title || ''}
                onReviewSaved={handleReviewSaved}
              />
              <SimilarMoviesSection
                items={watchNextItems}
                movieId={id}
                title="Watch Next"
                subtitle={`Because this title belongs to ${data.Genre || 'your current watch lane'}.`}
                explanation={aiRecommendationPack?.explanation || ''}
              />

              {tmdbAvailable && (watchProviders || findResult) && (
                <section className="details-watch surface-card">
                  <span className="details-watch-label">Where to watch</span>
                  <div className="details-watch-links">
                    {(() => {
                      const first = watchProviders?.results
                        && Object.entries(watchProviders.results).find(
                          ([, info]) => info?.link
                        );
                      const link = first?.[1]?.link;
                      return link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="details-watch-link"
                        >
                          <FiExternalLink />
                          Watch / find streaming options on TMDb
                        </a>
                      ) : (
                        <a
                          href={`https://www.themoviedb.org/search?query=${encodeURIComponent(data.Title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="details-watch-link"
                        >
                          <FiSearch />
                          Search for this title on TMDb
                        </a>
                      );
                    })()}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Details;
