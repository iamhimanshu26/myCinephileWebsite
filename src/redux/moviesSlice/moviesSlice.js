import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieApi from '../../api/movieApi';
import APIKey from '../../api/movieApiKey';
import tmdbApi from '../../api/tmdbApi';
import { filterFamilyFriendly } from '../../utils/contentFilter';

export const fetchAsyncMovies = createAsyncThunk(
  'movies/fetchAsyncMovies',
  async (term) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${term}&type=movie`
    );
    return response.data;
  }
);

export const fetchAsyncShows = createAsyncThunk(
  'movies/fetchAsyncShows',
  async (term) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${term}&type=series`
    );
    return response.data;
  }
);

export const fetchAsyncAnimeMovies = createAsyncThunk(
  'movies/fetchAsyncAnimeMovies',
  async () => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=Studio Ghibli&type=movie`
    );
    return response.data;
  }
);

export const fetchAsyncAnimeShows = createAsyncThunk(
  'movies/fetchAsyncAnimeShows',
  async () => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=animation&type=series`
    );
    return response.data;
  }
);

export const fetchAsyncMoviesOrShowsDetails = createAsyncThunk(
  'movies/fetchAsyncMoviesOrShowsDetails',
  async (id) => {
    const response = await movieApi.get(`?apiKey=${APIKey}&i=${id}&Plot=full`);
    return response.data;
  }
);

export const fetchAsyncDetailByTmdbId = createAsyncThunk(
  'movies/fetchAsyncDetailByTmdbId',
  async (tmdbId) => {
    try {
      const movieRes = await tmdbApi.get(`/movie/${tmdbId}`);
      if (movieRes.data && movieRes.data.imdb_id) {
        const res = await movieApi.get(
          `?apiKey=${APIKey}&i=${movieRes.data.imdb_id}&Plot=full`
        );
        return res.data;
      }
    } catch (_) {
      // not a movie, try tv
    }
    try {
      const tvRes = await tmdbApi.get(`/tv/${tmdbId}/external_ids`);
      if (tvRes.data && tvRes.data.imdb_id) {
        const res = await movieApi.get(
          `?apiKey=${APIKey}&i=${tvRes.data.imdb_id}&Plot=full`
        );
        return res.data;
      }
    } catch (_) {
      // ignore
    }
    return {};
  }
);

const initialState = {
  status: 'idle',
  movies: {},
  shows: {},
  animeMovies: {},
  animeShows: {},
  selectedMovieOrShow: {},
};

/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovies: (state, { payload }) => {
      state.movies = payload;
    },
  },
  extraReducers: {
    [fetchAsyncMovies.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchAsyncMovies.fulfilled]: (state, { payload }) => {
      if (payload.Response === 'True' && payload.Search) {
        return {
          ...state,
          movies: { ...payload, Search: filterFamilyFriendly(payload.Search) },
        };
      }
      return { ...state, movies: payload };
    },
    [fetchAsyncShows.fulfilled]: (state, { payload }) => {
      if (payload.Response === 'True' && payload.Search) {
        return {
          ...state,
          shows: { ...payload, Search: filterFamilyFriendly(payload.Search) },
        };
      }
      return { ...state, shows: payload };
    },
    [fetchAsyncAnimeMovies.fulfilled]: (state, { payload }) => {
      if (payload.Response === 'True' && payload.Search) {
        return {
          ...state,
          animeMovies: { ...payload, Search: filterFamilyFriendly(payload.Search) },
        };
      }
      return { ...state, animeMovies: payload };
    },
    [fetchAsyncAnimeShows.fulfilled]: (state, { payload }) => {
      if (payload.Response === 'True' && payload.Search) {
        return {
          ...state,
          animeShows: { ...payload, Search: filterFamilyFriendly(payload.Search) },
        };
      }
      return { ...state, animeShows: payload };
    },
    [fetchAsyncMoviesOrShowsDetails.fulfilled]: (state, { payload }) => {
      return { ...state, selectedMovieOrShow: payload };
    },
    [fetchAsyncDetailByTmdbId.fulfilled]: (state, { payload }) => {
      return { ...state, selectedMovieOrShow: payload };
    },
    [fetchAsyncMovies.rejected]: (state) => {
      state.status = 'failed';
    },
  },
});

/* eslint-disable implicit-arrow-linebreak */
export const { addMovies } = moviesSlice.actions;
export const getAllMovies = (state) => state.movies.movies;
export const getAllShows = (state) => state.movies.shows;
export const getAnimeMovies = (state) => state.movies.animeMovies;
export const getAnimeShows = (state) => state.movies.animeShows;
export const getSelectedMovieOrShow = (state) =>
  state.movies.selectedMovieOrShow;
export default moviesSlice.reducer;
