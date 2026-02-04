import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'cinephile_collection';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
    id, title, year, poster, type,
  };
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToCollection: (state, action) => {
      const item = action.payload;
      const exists = state.items.some((i) => i.id === item.id);
      if (!exists) {
        state.items.push(item);
        saveToStorage(state.items);
      }
    },
    removeFromCollection: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      saveToStorage(state.items);
    },
  },
});

export const { addToCollection, removeFromCollection } = collectionSlice.actions;

export const getCollectionItems = (state) => state.collection.items;
export const isInCollection = (id) => (state) => state.collection.items.some((i) => i.id === id);

export default collectionSlice.reducer;
