import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice/moviesSlice';
import tmdbReducer from './tmdbSlice/tmdbSlice';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    tmdb: tmdbReducer,
  },
});

export default store;
