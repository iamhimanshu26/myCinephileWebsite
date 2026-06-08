import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieApi from '../../api/movieApi';
import APIKey from '../../api/movieApiKey';
import tmdbApi from '../../api/tmdbApi';
import {
  getTrendingMovies as traktTrendingMovies,
  getTrendingShows as traktTrendingShows,
} from '../../api/traktApi';
import { getSchedule } from '../../api/tvmazeApi';
import { getTrendingAnime as fetchAnilistTrending } from '../../api/anilistApi';
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

const toSearchItem = (r) => ({
  id: r.id,
  imdbID: r.imdb_id || null,
  Title: r.title || r.name,
  title: r.title || r.name,
  name: r.name || r.title,
  Year: (r.release_date || r.first_air_date || '').slice(0, 4),
  imdbRating: typeof r.vote_average === 'number' ? String(r.vote_average.toFixed(1)) : '',
  release_date: r.release_date,
  first_air_date: r.first_air_date,
  original_language: r.original_language,
  poster_path: r.poster_path,
  Poster: r.poster_path
    ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
    : '',
  genre_ids: r.genre_ids || [],
  origin_country: r.origin_country || [],
});

export const fetchRecentMovies = createAsyncThunk(
  'movies/fetchRecentMovies',
  async () => {
    const { data } = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'primary_release_date.desc',
        'primary_release_date.lte': new Date().toISOString().slice(0, 10),
        page: 1,
      },
    });
    const Search = (data.results || []).map((r) => toSearchItem(r));
    return { Response: 'True', Search };
  }
);

export const fetchRecentShows = createAsyncThunk(
  'movies/fetchRecentShows',
  async () => {
    const { data } = await tmdbApi.get('/discover/tv', {
      params: {
        sort_by: 'first_air_date.desc',
        'first_air_date.lte': new Date().toISOString().slice(0, 10),
        page: 1,
      },
    });
    const Search = (data.results || []).map((r) => toSearchItem(r));
    return { Response: 'True', Search };
  }
);

export const fetchRecentAnimeMovies = createAsyncThunk(
  'movies/fetchRecentAnimeMovies',
  async () => {
    const { data } = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 16,
        sort_by: 'primary_release_date.desc',
        page: 1,
      },
    });
    const Search = (data.results || []).map((r) => toSearchItem(r));
    return { Response: 'True', Search };
  }
);

export const fetchRecentAnimeShows = createAsyncThunk(
  'movies/fetchRecentAnimeShows',
  async () => {
    const { data } = await tmdbApi.get('/discover/tv', {
      params: {
        with_genres: 16,
        sort_by: 'first_air_date.desc',
        page: 1,
      },
    });
    const Search = (data.results || []).map((r) => toSearchItem(r));
    return { Response: 'True', Search };
  }
);

const currentYear = new Date().getFullYear();

const fetchOMDbSearch = async (term, type, year, page = 1) => {
  const res = await movieApi.get(
    `?apiKey=${APIKey}&s=${encodeURIComponent(term)}&type=${type}&y=${year}&page=${page}`
  );
  return res.data;
};

const mergeOMDbSearchResults = (responses) => {
  const seen = new Set();
  const Search = [];
  responses.forEach((data) => {
    if (data.Response === 'True' && data.Search) {
      data.Search.forEach((item) => {
        if (item.imdbID && !seen.has(item.imdbID)) {
          seen.add(item.imdbID);
          Search.push(item);
        }
      });
    }
  });
  return Search.length ? { Response: 'True', Search } : { Response: 'False', Error: 'No results' };
};

export const fetchRecentMoviesOMDb = createAsyncThunk(
  'movies/fetchRecentMoviesOMDb',
  async () => {
    const [dataCurrent, dataPrev] = await Promise.all([
      fetchOMDbSearch('the', 'movie', currentYear),
      fetchOMDbSearch('the', 'movie', currentYear - 1),
    ]);
    let merged = mergeOMDbSearchResults([dataCurrent, dataPrev]);
    if (merged.Response !== 'True' || !merged.Search.length) {
      const fallback = await fetchOMDbSearch('action', 'movie', currentYear);
      merged = mergeOMDbSearchResults([fallback]);
    }
    if (merged.Response === 'True' && merged.Search) {
      merged.Search = filterFamilyFriendly(merged.Search);
    }
    return merged;
  }
);

export const fetchRecentShowsOMDb = createAsyncThunk(
  'movies/fetchRecentShowsOMDb',
  async () => {
    const [dataCurrent, dataPrev] = await Promise.all([
      fetchOMDbSearch('the', 'series', currentYear),
      fetchOMDbSearch('the', 'series', currentYear - 1),
    ]);
    let merged = mergeOMDbSearchResults([dataCurrent, dataPrev]);
    if (merged.Response !== 'True' || !merged.Search.length) {
      const fallback = await fetchOMDbSearch('drama', 'series', currentYear);
      merged = mergeOMDbSearchResults([fallback]);
    }
    if (merged.Response === 'True' && merged.Search) {
      merged.Search = filterFamilyFriendly(merged.Search);
    }
    return merged;
  }
);

export const fetchRecentAnimeMoviesOMDb = createAsyncThunk(
  'movies/fetchRecentAnimeMoviesOMDb',
  async () => {
    const [dataCurrent, dataPrev] = await Promise.all([
      fetchOMDbSearch('animation', 'movie', currentYear),
      fetchOMDbSearch('anime', 'movie', currentYear - 1),
    ]);
    const merged = mergeOMDbSearchResults([dataCurrent, dataPrev]);
    if (merged.Response === 'True') {
      merged.Search = filterFamilyFriendly(merged.Search);
    }
    return merged;
  }
);

export const fetchRecentAnimeShowsOMDb = createAsyncThunk(
  'movies/fetchRecentAnimeShowsOMDb',
  async () => {
    const [dataCurrent, dataPrev] = await Promise.all([
      fetchOMDbSearch('animation', 'series', currentYear),
      fetchOMDbSearch('anime', 'series', currentYear - 1),
    ]);
    const merged = mergeOMDbSearchResults([dataCurrent, dataPrev]);
    if (merged.Response === 'True') {
      merged.Search = filterFamilyFriendly(merged.Search);
    }
    return merged;
  }
);

export const fetchTrendingMoviesTrakt = createAsyncThunk(
  'movies/fetchTrendingMoviesTrakt',
  async () => {
    try {
      const list = await traktTrendingMovies();
      const Search = (list || [])
        .filter((e) => e.movie && e.movie.ids && e.movie.ids.imdb)
        .slice(0, 20)
        .map((e) => ({
          imdbID: e.movie.ids.imdb,
          Title: e.movie.title,
          Year: e.movie.year ? String(e.movie.year) : '',
          Poster: '',
        }));
      return Search.length ? { Response: 'True', Search } : { Response: 'False' };
    } catch {
      return { Response: 'False' };
    }
  }
);

export const fetchTrendingShowsTrakt = createAsyncThunk(
  'movies/fetchTrendingShowsTrakt',
  async () => {
    try {
      const list = await traktTrendingShows();
      const Search = (list || [])
        .filter((e) => e.show && e.show.ids && e.show.ids.imdb)
        .slice(0, 20)
        .map((e) => ({
          imdbID: e.show.ids.imdb,
          Title: e.show.title,
          Year: e.show.year ? String(e.show.year) : '',
          Poster: '',
        }));
      return Search.length ? { Response: 'True', Search } : { Response: 'False' };
    } catch {
      return { Response: 'False' };
    }
  }
);

export const fetchAiringTodayTVMaze = createAsyncThunk(
  'movies/fetchAiringTodayTVMaze',
  async () => {
    try {
      const list = await getSchedule('US');
      const seen = new Set();
      const getShow = (ep) => ep.show || (ep._embedded && ep._embedded.show); // eslint-disable-line no-underscore-dangle,max-len
      const Search = (list || [])
        .map(getShow)
        .filter((show) => show && show.id && !seen.has(show.id))
        .slice(0, 25)
        .map((show) => {
          seen.add(show.id);
          return {
            id: `tvmaze-${show.id}`,
            Title: show.name,
            Poster: show.image?.medium || '',
            Year: '',
            externalUrl: show.url || `https://www.tvmaze.com/shows/${show.id}`,
          };
        });
      return Search.length ? { Response: 'True', Search } : { Response: 'False' };
    } catch {
      return { Response: 'False' };
    }
  }
);

export const fetchTrendingAnimeAniList = createAsyncThunk(
  'movies/fetchTrendingAnimeAniList',
  async () => {
    try {
      const media = await fetchAnilistTrending(1, 24);
      const Search = (media || []).map((m) => ({
        id: `anilist-${m.id}`,
        Title: m.title?.english || m.title?.romaji || 'Anime',
        Poster: m.coverImage?.large || m.coverImage?.medium || '',
        Year: m.startDate?.year ? String(m.startDate.year) : '',
        externalUrl: `https://anilist.co/anime/${m.id}`,
      }));
      return Search.length ? { Response: 'True', Search } : { Response: 'False' };
    } catch {
      return { Response: 'False' };
    }
  }
);

const initialState = {
  status: 'idle',
  movies: {},
  shows: {},
  animeMovies: {},
  animeShows: {},
  trendingMovies: {},
  trendingShows: {},
  airingToday: {},
  trendingAnime: {},
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
    [fetchRecentMovies.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, movies: payload };
      }
      return state;
    },
    [fetchRecentShows.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, shows: payload };
      }
      return state;
    },
    [fetchRecentAnimeMovies.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, animeMovies: payload };
      }
      return state;
    },
    [fetchRecentAnimeShows.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, animeShows: payload };
      }
      return state;
    },
    [fetchRecentMoviesOMDb.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, movies: payload };
      }
      return state;
    },
    [fetchRecentShowsOMDb.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, shows: payload };
      }
      return state;
    },
    [fetchRecentAnimeMoviesOMDb.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, animeMovies: payload };
      }
      return state;
    },
    [fetchRecentAnimeShowsOMDb.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, animeShows: payload };
      }
      return state;
    },
    [fetchTrendingMoviesTrakt.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, trendingMovies: payload };
      }
      return state;
    },
    [fetchTrendingShowsTrakt.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, trendingShows: payload };
      }
      return state;
    },
    [fetchAiringTodayTVMaze.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, airingToday: payload };
      }
      return state;
    },
    [fetchTrendingAnimeAniList.fulfilled]: (state, { payload }) => {
      if (payload.Search && payload.Search.length) {
        return { ...state, trendingAnime: payload };
      }
      return state;
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
export const getTrendingMovies = (state) => state.movies.trendingMovies;
export const getTrendingShows = (state) => state.movies.trendingShows;
export const getAiringToday = (state) => state.movies.airingToday;
export const getTrendingAnime = (state) => state.movies.trendingAnime;
export const getSelectedMovieOrShow = (state) =>
  state.movies.selectedMovieOrShow;
export default moviesSlice.reducer;
