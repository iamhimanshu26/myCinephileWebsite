import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi, { hasTMDbKey } from '../../api/tmdbApi';

export const findMovieByImdbId = createAsyncThunk(
  'tmdb/findByImdbId',
  async (imdbId) => {
    const { data } = await tmdbApi.get(`/find/${imdbId}`, {
      params: { external_source: 'imdb_id' },
    });
    return data;
  }
);

export const fetchMovieCredits = createAsyncThunk(
  'tmdb/movieCredits',
  async (movieId) => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/credits`);
    return data;
  }
);

export const fetchPersonDetails = createAsyncThunk(
  'tmdb/personDetails',
  async (personId) => {
    const { data } = await tmdbApi.get(`/person/${personId}`);
    return data;
  }
);

export const fetchPersonMovieCredits = createAsyncThunk(
  'tmdb/personMovieCredits',
  async (personId) => {
    const { data } = await tmdbApi.get(`/person/${personId}/movie_credits`);
    return data;
  }
);

export const fetchPersonTvCredits = createAsyncThunk(
  'tmdb/personTvCredits',
  async (personId) => {
    const { data } = await tmdbApi.get(`/person/${personId}/tv_credits`);
    return data;
  }
);

export const searchPerson = createAsyncThunk(
  'tmdb/searchPerson',
  async (query) => {
    const { data } = await tmdbApi.get('/search/person', { params: { query } });
    return data;
  }
);

export const fetchWatchProviders = createAsyncThunk(
  'tmdb/watchProviders',
  async ({
    id, mediaType,
  }) => {
    const { data } = await tmdbApi.get(`/${mediaType}/${id}/watch/providers`);
    return data;
  }
);

const initialState = {
  movieCredits: null,
  personDetails: null,
  personMovieCredits: null,
  personTvCredits: null,
  personSearchResults: null,
  findResult: null,
  watchProviders: null,
  status: 'idle',
};

const tmdbSlice = createSlice({
  name: 'tmdb',
  initialState,
  reducers: {
    clearCredits: (state) => {
      state.movieCredits = null;
    },
    clearPerson: (state) => {
      state.personDetails = null;
      state.personMovieCredits = null;
      state.personTvCredits = null;
      state.personSearchResults = null;
    },
    clearFind: (state) => {
      state.findResult = null;
    },
    clearWatchProviders: (state) => {
      state.watchProviders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findMovieByImdbId.fulfilled, (state, { payload }) => {
        state.findResult = payload;
      })
      .addCase(fetchMovieCredits.fulfilled, (state, { payload }) => {
        state.movieCredits = payload;
      })
      .addCase(fetchPersonDetails.fulfilled, (state, { payload }) => {
        state.personDetails = payload;
      })
      .addCase(fetchPersonMovieCredits.fulfilled, (state, { payload }) => {
        state.personMovieCredits = payload;
      })
      .addCase(fetchPersonTvCredits.fulfilled, (state, { payload }) => {
        state.personTvCredits = payload;
      })
      .addCase(searchPerson.fulfilled, (state, { payload }) => {
        state.personSearchResults = payload;
      })
      .addCase(fetchWatchProviders.fulfilled, (state, { payload }) => {
        state.watchProviders = payload;
      });
  },
});

export const {
  clearCredits, clearPerson, clearFind, clearWatchProviders,
} = tmdbSlice.actions;
export const getMovieCredits = (state) => state.tmdb.movieCredits;
export const getPersonDetails = (state) => state.tmdb.personDetails;
export const getPersonMovieCredits = (state) => state.tmdb.personMovieCredits;
export const getPersonTvCredits = (state) => state.tmdb.personTvCredits;
export const getFindResult = (state) => state.tmdb.findResult;
export const getWatchProviders = (state) => state.tmdb.watchProviders;
export const getPersonSearchResults = (state) => state.tmdb.personSearchResults;
export { hasTMDbKey };
export default tmdbSlice.reducer;
