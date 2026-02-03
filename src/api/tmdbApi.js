import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_KEY || '';

export const hasTMDbKey = () => Boolean(API_KEY);

export default axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: API_KEY },
});
