const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getMediaTitle = (item = {}) => (
  item.Title || item.title || item.name || 'Untitled'
);

export const getMediaYear = (item = {}) => (
  item.Year
  || item.year
  || item.release_date?.slice(0, 4)
  || item.first_air_date?.slice(0, 4)
  || ''
);

export const getMediaType = (item = {}) => {
  const rawType = (
    item.Type
    || item.type
    || item.media_type
    || item._type
    || ''
  ).toString().toLowerCase();
  if (!rawType) return '';
  if (rawType.includes('series') || rawType === 'tv' || rawType === 'show') return 'Series';
  if (rawType.includes('anime')) return 'Anime';
  return 'Movie';
};

export const getMediaRating = (item = {}) => {
  const rating = Number.parseFloat(item.imdbRating || item.vote_average || item.rating || '');
  if (!Number.isFinite(rating) || rating <= 0) return '';
  return rating.toFixed(1);
};

const isValidPosterValue = (value) => (
  typeof value === 'string'
  && value.trim().length > 0
  && value !== 'N/A'
);

export const getPosterUrl = (item = {}, size = 'w500') => {
  if (isValidPosterValue(item.Poster)) return item.Poster;
  if (isValidPosterValue(item.poster)) return item.poster;
  if (isValidPosterValue(item.backdrop)) return item.backdrop;
  if (isValidPosterValue(item.poster_path)) {
    return item.poster_path.startsWith('http')
      ? item.poster_path
      : `${TMDB_IMAGE_BASE}/${size}${item.poster_path}`;
  }
  if (isValidPosterValue(item.profile_path)) {
    return item.profile_path.startsWith('http')
      ? item.profile_path
      : `${TMDB_IMAGE_BASE}/${size}${item.profile_path}`;
  }
  return '';
};

export const hasRenderablePoster = (item = {}) => Boolean(getPosterUrl(item));

export const getMediaId = (item = {}) => item.imdbID || item.id || '';
