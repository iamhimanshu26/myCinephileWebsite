import axios from 'axios';

const TRAKT_BASE = 'https://api.trakt.tv';
const clientId = process.env.REACT_APP_TRAKT_CLIENT_ID || '';

export const hasTraktKey = () => Boolean(clientId);

const traktClient = axios.create({
  baseURL: TRAKT_BASE,
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId,
  },
});

export const getTrendingMovies = () => traktClient.get('/movies/trending').then((res) => res.data);
export const getTrendingShows = () => traktClient.get('/shows/trending').then((res) => res.data);

export default traktClient;
