import { applyCatalogFilters } from './catalogFilters';
import {
  getMediaId,
  getMediaRating,
  getMediaType,
  getMediaYear,
  hasRenderablePoster,
} from './media';

export const DISCOVERY_MEDIA_TABS = [
  { id: 'all', label: 'All' },
  { id: 'movies', label: 'Movies' },
  { id: 'series', label: 'TV Series' },
  { id: 'anime', label: 'Anime' },
];

export const DISCOVERY_SECTION_CONFIG = [
  {
    id: 'trending-now',
    title: 'Trending Now',
    subtitle: 'What audiences are exploring today.',
    categories: ['all'],
    limit: 14,
  },
  {
    id: 'popular-movies',
    title: 'Popular Movies',
    subtitle: 'Current movie favorites with strong poster quality.',
    categories: ['all', 'movies'],
    limit: 14,
  },
  {
    id: 'top-rated',
    title: 'Top Rated',
    subtitle: 'High-rated picks across movies and series.',
    categories: ['all'],
    limit: 14,
  },
  {
    id: 'anime-picks',
    title: 'Anime Picks',
    subtitle: 'Fresh anime discoveries and standout titles.',
    categories: ['all', 'anime'],
    limit: 14,
  },
  {
    id: 'tv-series',
    title: 'TV Series',
    subtitle: 'Binge-ready series and currently airing picks.',
    categories: ['all', 'series'],
    limit: 14,
  },
  {
    id: 'weekend-picks',
    title: 'Weekend Picks',
    subtitle: 'Easy-watch options for relaxed viewing sessions.',
    categories: ['all'],
    limit: 12,
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    subtitle: 'Underrated titles worth adding to your watchlist.',
    categories: ['all'],
    limit: 12,
  },
  {
    id: 'editors-choice',
    title: 'Editor’s Choice',
    subtitle: 'Curated handpicked selections from the Cinephile desk.',
    categories: ['all'],
    limit: 12,
  },
  {
    id: 'recently-viewed',
    title: 'Recently Viewed',
    subtitle: 'Jump back into titles you opened recently.',
    categories: ['all'],
    limit: 12,
  },
];

const toNumberYear = (item) => {
  const year = Number.parseInt(getMediaYear(item), 10);
  return Number.isFinite(year) ? year : 0;
};

const dedupeById = (list) => {
  const byId = new Map();
  list.forEach((item) => {
    const id = getMediaId(item);
    if (!id || byId.has(id)) return;
    byId.set(id, item);
  });
  return Array.from(byId.values());
};

const sortWithPosterPriority = (list) => (
  [...list].sort((a, b) => {
    const posterDelta = Number(hasRenderablePoster(b)) - Number(hasRenderablePoster(a));
    if (posterDelta !== 0) return posterDelta;
    const ratingDelta = getMediaRating(b) - getMediaRating(a);
    if (ratingDelta !== 0) return ratingDelta;
    return toNumberYear(b) - toNumberYear(a);
  })
);

const inferCategory = (item = {}) => {
  if (item.__category) return item.__category;
  const type = getMediaType(item).toLowerCase();
  if (type.includes('anime')) return 'anime';
  if (type.includes('series')) return 'series';
  return 'movies';
};

const filterByTab = (list, tab) => {
  if (!tab || tab === 'all') return list;
  return list.filter((item) => inferCategory(item) === tab);
};

const pickSectionItems = (id, pools) => {
  const {
    movies,
    shows,
    anime,
    trending,
    recentlyViewed,
  } = pools;
  const mixed = dedupeById([...movies, ...shows, ...anime, ...trending]);

  if (id === 'trending-now') return dedupeById([...trending, ...movies, ...shows, ...anime]);
  if (id === 'popular-movies') return movies;
  if (id === 'top-rated') return [...mixed].sort((a, b) => getMediaRating(b) - getMediaRating(a));
  if (id === 'anime-picks') return dedupeById([...anime, ...trending.filter((item) => inferCategory(item) === 'anime')]);
  if (id === 'tv-series') return dedupeById([...shows, ...trending.filter((item) => inferCategory(item) === 'series')]);
  if (id === 'weekend-picks') {
    return mixed.filter((item) => toNumberYear(item) >= new Date().getFullYear() - 8);
  }
  if (id === 'hidden-gems') {
    return [...mixed]
      .filter((item) => getMediaRating(item) >= 6)
      .sort((a, b) => getMediaRating(b) - getMediaRating(a))
      .slice(10);
  }
  if (id === 'editors-choice') {
    const topMovies = sortWithPosterPriority(movies).slice(0, 4);
    const topShows = sortWithPosterPriority(shows).slice(0, 4);
    const topAnime = sortWithPosterPriority(anime).slice(0, 4);
    return dedupeById([...topMovies, ...topShows, ...topAnime]);
  }
  if (id === 'recently-viewed') return recentlyViewed;
  return [];
};

export const buildDiscoverySections = ({
  browse = 'all',
  filters = {},
  movies = [],
  shows = [],
  anime = [],
  trending = [],
  recentlyViewed = [],
}) => {
  const pools = {
    movies: dedupeById(movies),
    shows: dedupeById(shows),
    anime: dedupeById(anime),
    trending: dedupeById(trending),
    recentlyViewed: dedupeById(recentlyViewed),
  };

  return DISCOVERY_SECTION_CONFIG
    .filter((section) => section.categories.includes('all') || section.categories.includes(browse))
    .map((section) => {
      const sourceItems = pickSectionItems(section.id, pools);
      const browseFiltered = filterByTab(sourceItems, browse);
      const filteredItems = applyCatalogFilters(browseFiltered, filters);
      const selected = sortWithPosterPriority(filteredItems).slice(0, section.limit);
      return {
        ...section,
        items: selected,
      };
    });
};
