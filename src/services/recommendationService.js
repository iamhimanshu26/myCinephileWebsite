import { GENRE_OPTIONS } from '../constants/filters';
import {
  getMediaId,
  getMediaRating,
  getMediaTitle,
  getMediaType,
  hasRenderablePoster,
} from '../utils/media';
import { buildTasteProfile, getPersonalizedShelfItems } from './personalizationService';

const genreById = new Map(
  GENRE_OPTIONS.map((entry) => [Number.parseInt(entry.id, 10), entry.name])
);

const MOOD_KEYWORDS = {
  emotional: ['emotional', 'heartfelt', 'touching', 'feel'],
  happy: ['happy', 'feel-good', 'uplifting', 'fun'],
  dark: ['dark', 'grim', 'intense', 'serious'],
  romantic: ['romantic', 'romance', 'date'],
  motivational: ['motivational', 'inspiring', 'inspiration'],
  suspenseful: ['suspense', 'suspenseful', 'thriller', 'mystery'],
  funny: ['funny', 'comedy', 'laugh'],
  mindBending: ['mind-bending', 'mind bending', 'twist', 'sci-fi'],
};

const SITUATION_KEYWORDS = {
  dateNight: ['date night', 'date'],
  familyNight: ['family', 'kids', 'family night'],
  weekend: ['weekend', 'binge'],
  relaxing: ['relax', 'peaceful', 'calm'],
  alone: ['alone', 'solo'],
};

const TYPE_KEYWORDS = {
  anime: ['anime'],
  series: ['series', 'tv show', 'show', 'binge'],
  movie: ['movie', 'film'],
};

const RUNTIME_KEYWORDS = {
  short: ['short', 'under 2 hours', 'under two hours', 'quick'],
  long: ['long', 'epic'],
};

const MOOD_GENRE_HINTS = {
  emotional: ['Drama', 'Romance'],
  happy: ['Comedy', 'Animation'],
  dark: ['Thriller', 'Crime', 'Horror'],
  romantic: ['Romance', 'Drama'],
  motivational: ['Drama', 'Adventure'],
  suspenseful: ['Thriller', 'Crime'],
  funny: ['Comedy'],
  mindBending: ['Science Fiction', 'Thriller', 'Fantasy'],
};

const parseGenres = (item = {}) => {
  if (typeof item.Genre === 'string' && item.Genre.trim()) {
    return item.Genre.split(',').map((genre) => genre.trim()).filter(Boolean);
  }
  if (Array.isArray(item.genre_ids)) {
    return item.genre_ids.map((id) => genreById.get(Number(id))).filter(Boolean);
  }
  return [];
};

const parseRuntimeMinutes = (item = {}) => {
  const runtimeText = item.Runtime || item.runtime;
  if (typeof runtimeText === 'number') return runtimeText;
  if (typeof runtimeText !== 'string') return 0;
  const match = runtimeText.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
};

const normalizeType = (value = '') => {
  const type = value.toLowerCase();
  if (!type) return 'movie';
  if (type.includes('anime')) return 'anime';
  if (type.includes('series') || type.includes('tv')) return 'series';
  return 'movie';
};

const normalizePrompt = (prompt = '') => prompt.trim().toLowerCase();

const includesAny = (input, words = []) => words.some((word) => input.includes(word));

const dedupeById = (list) => {
  const byId = new Map();
  list.forEach((item) => {
    const id = getMediaId(item);
    if (!id || byId.has(id)) return;
    byId.set(id, item);
  });
  return Array.from(byId.values());
};

const flattenPools = (catalogPools = {}) => dedupeById(Object.values(catalogPools).flat());

export const parseUserPrompt = (prompt = '') => {
  const normalized = normalizePrompt(prompt);
  const moods = Object.keys(MOOD_KEYWORDS).filter((key) => (
    includesAny(normalized, MOOD_KEYWORDS[key])
  ));
  const situations = Object.keys(SITUATION_KEYWORDS).filter((key) => (
    includesAny(normalized, SITUATION_KEYWORDS[key])
  ));
  const requestedType = Object.keys(TYPE_KEYWORDS).find((key) => (
    includesAny(normalized, TYPE_KEYWORDS[key])
  )) || '';
  const runtime = Object.keys(RUNTIME_KEYWORDS).find((key) => (
    includesAny(normalized, RUNTIME_KEYWORDS[key])
  )) || '';
  const similarityMatch = normalized.match(/like\s+([a-z0-9\s:'-]+)/i);
  const similarToTitle = similarityMatch ? similarityMatch[1].trim() : '';
  const wantsAwards = normalized.includes('award');
  const wantsWeekend = situations.includes('weekend') || normalized.includes('weekend');

  return {
    rawPrompt: prompt,
    normalized,
    moods,
    situations,
    requestedType,
    runtime,
    similarToTitle,
    wantsAwards,
    wantsWeekend,
  };
};

const scoreByIntent = (item, intent, tasteProfile) => {
  let score = Number(getMediaRating(item)) || 0;
  const genres = parseGenres(item);
  const type = normalizeType(getMediaType(item));
  const runtime = parseRuntimeMinutes(item);
  const title = getMediaTitle(item).toLowerCase();

  if (intent.requestedType && type === intent.requestedType) score += 3;
  if (intent.runtime === 'short' && runtime > 0 && runtime <= 120) score += 3;
  if (intent.runtime === 'long' && runtime >= 130) score += 2;
  if (intent.wantsAwards && (Number(getMediaRating(item)) || 0) >= 7.8) score += 2;
  if (intent.similarToTitle) {
    const tokens = intent.similarToTitle.split(/\s+/).filter((token) => token.length > 2);
    const overlap = tokens.filter((token) => title.includes(token)).length;
    score += overlap * 2;
  }

  intent.moods.forEach((mood) => {
    const hintedGenres = MOOD_GENRE_HINTS[mood] || [];
    const overlap = genres.filter((genre) => hintedGenres.includes(genre)).length;
    score += overlap * 1.6;
  });

  if (intent.situations.includes('familyNight')) {
    if (genres.includes('Animation') || genres.includes('Comedy')) score += 2;
  }
  if (intent.situations.includes('dateNight')) {
    if (genres.includes('Romance') || genres.includes('Drama')) score += 2;
  }

  if (tasteProfile?.mostViewedType && tasteProfile.mostViewedType === type) score += 1.6;
  if (tasteProfile?.topGenres?.length) {
    const overlap = genres.filter((genre) => tasteProfile.topGenres.includes(genre)).length;
    score += overlap * 1.3;
  }

  if (hasRenderablePoster(item)) score += 1.4;

  return score;
};

export const explainRecommendation = ({
  prompt = '',
  intent = {},
  item = null,
  tasteProfile = null,
}) => {
  const reasons = [];
  if (intent.moods?.length) reasons.push(`${intent.moods.join(', ')} vibe`);
  if (intent.requestedType) reasons.push(`${intent.requestedType} preference`);
  if (intent.runtime) reasons.push(`${intent.runtime} runtime request`);
  if (intent.similarToTitle) reasons.push(`similarity to ${intent.similarToTitle}`);
  if (tasteProfile?.favoriteGenre) reasons.push(`your ${tasteProfile.favoriteGenre} interest`);

  if (!item) {
    if (!reasons.length) {
      return `Recommended because your prompt "${prompt}" suggests a discovery-focused watch session.`;
    }
    return `Recommended because your prompt aligns with ${reasons.join(', ')}.`;
  }

  const title = getMediaTitle(item);
  if (!reasons.length) return `${title} is a strong match for your current watch prompt.`;
  return `${title} matches your ${reasons.slice(0, 2).join(' and ')}.`;
};

export const getMoodBasedRecommendations = ({
  prompt = '',
  catalogPools = {},
  tasteProfile = null,
  limit = 8,
}) => {
  const intent = parseUserPrompt(prompt);
  const profile = tasteProfile || buildTasteProfile({ catalog: flattenPools(catalogPools) });
  const candidates = flattenPools(catalogPools);
  const watchedIds = new Set(profile.watchedIds || []);

  return candidates
    .map((item) => {
      let score = scoreByIntent(item, intent, profile);
      if (watchedIds.has(getMediaId(item))) score -= 2.2;
      return {
        item,
        score,
        reason: explainRecommendation({
          prompt,
          intent,
          item,
          tasteProfile: profile,
        }),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getSimilarTitleRecommendations = ({
  prompt = '',
  catalogPools = {},
  tasteProfile = null,
  limit = 8,
}) => {
  const intent = parseUserPrompt(prompt);
  const profile = tasteProfile || buildTasteProfile({ catalog: flattenPools(catalogPools) });
  if (!intent.similarToTitle) return [];
  return getMoodBasedRecommendations({
    prompt: `like ${intent.similarToTitle}`,
    catalogPools,
    tasteProfile: profile,
    limit,
  });
};

export const getWeekendSuggestions = ({
  prompt = '',
  catalogPools = {},
  tasteProfile = null,
  limit = 8,
}) => {
  const intent = parseUserPrompt(prompt);
  const profile = tasteProfile || buildTasteProfile({ catalog: flattenPools(catalogPools) });
  const candidates = flattenPools(catalogPools)
    .filter((item) => {
      const type = normalizeType(getMediaType(item));
      const rating = Number(getMediaRating(item)) || 0;
      return (
        type === 'series'
        || type === 'anime'
        || rating >= 7
      );
    });

  return candidates
    .map((item) => ({
      item,
      score: scoreByIntent(item, { ...intent, wantsWeekend: true }, profile) + 1.2,
      reason: `${getMediaTitle(item)} suits a relaxed weekend session with strong replay value.`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getPersonalizedRecommendations = ({
  prompt = '',
  catalogPools = {},
  tasteProfile = null,
  limit = 8,
}) => {
  const profile = tasteProfile || buildTasteProfile({ catalog: flattenPools(catalogPools) });
  const intent = parseUserPrompt(prompt);
  const baseItems = getPersonalizedShelfItems({
    catalogPools,
    tasteProfile: profile,
    limit: limit * 2,
  });

  return baseItems
    .map((item) => ({
      item,
      score: scoreByIntent(item, intent, profile),
      reason: explainRecommendation({
        prompt,
        intent,
        item,
        tasteProfile: profile,
      }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getFallbackRecommendations = ({
  prompt = '',
  catalogPools = {},
  tasteProfile = null,
  limit = 8,
}) => {
  const intent = parseUserPrompt(prompt);
  const profile = tasteProfile || buildTasteProfile({ catalog: flattenPools(catalogPools) });
  let strategy = 'personalized';
  let results = [];

  if (intent.similarToTitle) {
    strategy = 'similarity';
    results = getSimilarTitleRecommendations({
      prompt,
      catalogPools,
      tasteProfile: profile,
      limit,
    });
  } else if (intent.wantsWeekend || intent.situations.includes('weekend')) {
    strategy = 'weekend';
    results = getWeekendSuggestions({
      prompt,
      catalogPools,
      tasteProfile: profile,
      limit,
    });
  } else if (intent.moods.length || intent.runtime || intent.requestedType) {
    strategy = 'mood-based';
    results = getMoodBasedRecommendations({
      prompt,
      catalogPools,
      tasteProfile: profile,
      limit,
    });
  }

  if (!results.length) {
    strategy = 'personalized';
    results = getPersonalizedRecommendations({
      prompt,
      catalogPools,
      tasteProfile: profile,
      limit,
    });
  }

  return {
    strategy,
    intent,
    explanation: explainRecommendation({ prompt, intent, tasteProfile: profile }),
    results,
  };
};

// Placeholder integration flags for future server-side AI adapters.
// Never commit real keys to frontend source.
export const hasExternalAIProvider = () => Boolean(
  process.env.REACT_APP_GEMINI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY
);
