import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice/moviesSlice';
import tmdbReducer from './tmdbSlice/tmdbSlice';
import collectionReducer from './collectionSlice/collectionSlice';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    tmdb: tmdbReducer,
    collection: collectionReducer,
  },
});

export default store;
