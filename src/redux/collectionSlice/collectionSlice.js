import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'cinephile_collection';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      watchlist: item.watchlist !== undefined ? Boolean(item.watchlist) : true,
      favorite: item.favorite !== undefined ? Boolean(item.favorite) : false,
    }));
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

/**
 * Normalize movie/series data from OMDB or TMDb into a collection item.
 * @param {Object} data - Raw item (from MovieCard or Details)
 * @returns {{ id: string, title: string, year: string, poster: string, type: string }}
 */
export const normalizeCollectionItem = (data) => {
  const id = data.imdbID || String(data.id);
  const title = data.Title || data.title || data.name || 'Unknown';
  const year =
    data.Year ||
    data.release_date?.slice(0, 4) ||
    data.first_air_date?.slice(0, 4) ||
    '';
  let poster = '';
  if (data.Poster && data.Poster !== 'N/A') {
    poster = data.Poster;
  } else if (data.poster_path) {
    poster = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
  }
  const type = data.Type || (data.media_type === 'tv' ? 'series' : 'movie');
  return {
    id,
    title,
    year,
    poster,
    type,
    watchlist: true,
    favorite: false,
  };
};

const upsertItem = (items, item, listKey) => {
  const exists = items.find((entry) => entry.id === item.id);
  if (exists) {
    return items.map((entry) => (
      entry.id === item.id
        ? { ...entry, ...item, [listKey]: true }
        : entry
    ));
  }
  return [...items, { ...item, [listKey]: true }];
};

const removeFromList = (items, id, listKey) => {
  const next = items.map((entry) => (
    entry.id === id
      ? { ...entry, [listKey]: false }
      : entry
  ));
  return next.filter((entry) => entry.watchlist || entry.favorite);
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToCollection: (state, action) => {
      const item = action.payload;
      state.items = upsertItem(state.items, item, 'watchlist');
      saveToStorage(state.items);
    },
    removeFromCollection: (state, action) => {
      const id = action.payload;
      state.items = removeFromList(state.items, id, 'watchlist');
      saveToStorage(state.items);
    },
    addToFavorites: (state, action) => {
      const item = action.payload;
      state.items = upsertItem(state.items, item, 'favorite');
      saveToStorage(state.items);
    },
    removeFromFavorites: (state, action) => {
      const id = action.payload;
      state.items = removeFromList(state.items, id, 'favorite');
      saveToStorage(state.items);
    },
  },
});

export const {
  addToCollection,
  removeFromCollection,
  addToFavorites,
  removeFromFavorites,
} = collectionSlice.actions;

export const getAllCollectionEntries = (state) => state.collection.items;
export const getCollectionItems = (state) => state.collection.items.filter((i) => i.watchlist);
export const getFavoriteItems = (state) => state.collection.items.filter((i) => i.favorite);
export const isInCollection = (id) => (state) => (
  state.collection.items.some((i) => i.id === id && i.watchlist)
);
export const isInFavorites = (id) => (state) => (
  state.collection.items.some((i) => i.id === id && i.favorite)
);
export const getCollectionStats = (state) => ({
  watchlistCount: state.collection.items.filter((entry) => entry.watchlist).length,
  favoriteCount: state.collection.items.filter((entry) => entry.favorite).length,
});

export default collectionSlice.reducer;
