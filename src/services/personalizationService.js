import { GENRE_OPTIONS } from '../constants/filters';
import { getMediaId, getMediaRating, getMediaType } from '../utils/media';
import { getBookings } from './bookingService';
import { getRecentlyViewed } from './recentlyViewedService';
import { getAllReviews } from './reviewService';

const COLLECTION_STORAGE_KEY = 'cinephile_collection';

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeType = (value = '') => {
  const type = value.toLowerCase();
  if (!type) return 'movie';
  if (type.includes('anime')) return 'anime';
  if (type.includes('series') || type.includes('tv')) return 'series';
  return 'movie';
};

const genreById = new Map(
  GENRE_OPTIONS.map((entry) => [Number.parseInt(entry.id, 10), entry.name])
);

const parseGenres = (item = {}) => {
  if (typeof item.Genre === 'string' && item.Genre.trim()) {
    return item.Genre.split(',').map((genre) => genre.trim()).filter(Boolean);
  }
  if (Array.isArray(item.genre_ids)) {
    return item.genre_ids
      .map((id) => genreById.get(Number(id)))
      .filter(Boolean);
  }
  return [];
};

const increment = (map, key, weight = 1) => {
  if (!key) return;
  const next = (map.get(key) || 0) + weight;
  map.set(key, next);
};

const mapToSortedEntries = (map) => (
  Array.from(map.entries()).sort((a, b) => b[1] - a[1])
);

const getCollectionEntries = () => {
  const raw = localStorage.getItem(COLLECTION_STORAGE_KEY);
  return safeParse(raw);
};

const dedupeById = (list) => {
  const byId = new Map();
  list.forEach((item) => {
    const id = getMediaId(item) || item.id;
    if (!id || byId.has(id)) return;
    byId.set(id, item);
  });
  return Array.from(byId.values());
};

export const buildTasteProfile = ({
  recentlyViewed = getRecentlyViewed(),
  collectionEntries = getCollectionEntries(),
  reviews = getAllReviews(),
  bookings = getBookings(),
  catalog = [],
} = {}) => {
  const watchlistItems = collectionEntries.filter((entry) => entry.watchlist);
  const favoriteItems = collectionEntries.filter((entry) => entry.favorite);
  const catalogById = new Map();
  catalog.forEach((item) => {
    const id = getMediaId(item) || item.id;
    if (id) catalogById.set(id, item);
  });

  const interactionIds = new Set([
    ...recentlyViewed.map((entry) => entry.id),
    ...watchlistItems.map((entry) => entry.id),
    ...favoriteItems.map((entry) => entry.id),
    ...bookings.map((entry) => entry.movieId),
    ...reviews.map((entry) => entry.movieId),
  ]);

  const interactionItems = Array.from(interactionIds)
    .map((id) => catalogById.get(id))
    .filter(Boolean);

  const typeWeights = new Map();
  recentlyViewed.forEach((entry) => increment(typeWeights, normalizeType(entry.type), 2));
  favoriteItems.forEach((entry) => increment(typeWeights, normalizeType(entry.type), 2));
  watchlistItems.forEach((entry) => increment(typeWeights, normalizeType(entry.type), 1));
  bookings.forEach(() => increment(typeWeights, 'movie', 2));
  reviews.forEach(() => increment(typeWeights, 'movie', 1));

  const genreWeights = new Map();
  interactionItems.forEach((item) => {
    const rating = Number(getMediaRating(item)) || 0;
    const weight = rating >= 8 ? 2 : 1;
    parseGenres(item).forEach((genre) => increment(genreWeights, genre, weight));
  });

  const topGenres = mapToSortedEntries(genreWeights).slice(0, 3).map(([genre]) => genre);
  const mostViewedType = mapToSortedEntries(typeWeights)[0]?.[0] || '';
  const averageRating = reviews.length
    ? reviews.reduce((sum, entry) => sum + Number(entry.rating || 0), 0) / reviews.length
    : 0;

  const summaryParts = [];
  if (topGenres.length) summaryParts.push(topGenres.join(', '));
  if (mostViewedType) summaryParts.push(`${mostViewedType} picks`);
  const tasteSummary = summaryParts.length
    ? `You seem to enjoy ${summaryParts.join(' and ')}.`
    : 'Watch more titles to build your personalized taste profile.';

  return {
    topGenres,
    favoriteGenre: topGenres[0] || '',
    mostViewedType,
    averageRating,
    watchlistCount: watchlistItems.length,
    favoriteCount: favoriteItems.length,
    recentlyViewedCount: recentlyViewed.length,
    bookingsCount: bookings.length,
    reviewsWritten: reviews.length,
    tasteSummary,
    interactionItems: dedupeById(interactionItems),
    watchedIds: Array.from(interactionIds),
    hasEnoughSignals: (
      recentlyViewed.length > 0
      || favoriteItems.length > 0
      || watchlistItems.length > 0
      || reviews.length > 0
      || bookings.length > 0
    ),
  };
};

export const getPersonalizedShelfItems = ({
  catalogPools = {},
  tasteProfile,
  limit = 12,
} = {}) => {
  const pools = Object.values(catalogPools).flat();
  const uniqueItems = dedupeById(pools);
  if (!uniqueItems.length) return [];

  const profile = tasteProfile || buildTasteProfile({ catalog: uniqueItems });
  const watchedIdSet = new Set(profile.watchedIds);

  const scored = uniqueItems.map((item) => {
    const id = getMediaId(item);
    const genres = parseGenres(item);
    const type = normalizeType(getMediaType(item));
    let score = Number(getMediaRating(item)) || 0;

    if (profile.mostViewedType && type === profile.mostViewedType) score += 3;
    const genreMatches = genres.filter((genre) => profile.topGenres.includes(genre)).length;
    score += genreMatches * 2;
    if (watchedIdSet.has(id)) score -= 3;

    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
};
