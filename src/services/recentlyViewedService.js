import {
  getMediaId,
  getMediaRating,
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getPosterUrl,
} from '../utils/media';

const RECENTLY_VIEWED_STORAGE_KEY = 'cinephile_recently_viewed_v1';
const MAX_RECENTLY_VIEWED_ITEMS = 18;

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveList = (items) => {
  localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(items));
  return items;
};

const normalizeViewedItem = (item = {}) => {
  const id = getMediaId(item);
  if (!id) return null;
  return {
    id,
    imdbID: item.imdbID || null,
    Title: getMediaTitle(item),
    Year: getMediaYear(item),
    Poster: getPosterUrl(item, 'w500'),
    type: getMediaType(item),
    imdbRating: getMediaRating(item),
    updatedAt: new Date().toISOString(),
  };
};

export const getRecentlyViewed = () => {
  const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
  return safeParse(raw);
};

export const addRecentlyViewed = (item) => {
  const normalized = normalizeViewedItem(item);
  if (!normalized) return getRecentlyViewed();
  const current = getRecentlyViewed();
  const withoutCurrent = current.filter((entry) => entry.id !== normalized.id);
  const next = [normalized, ...withoutCurrent].slice(0, MAX_RECENTLY_VIEWED_ITEMS);
  return saveList(next);
};

export const clearRecentlyViewed = () => saveList([]);

// Future migration note:
// Keep the interface stable and replace localStorage with API persistence later.
