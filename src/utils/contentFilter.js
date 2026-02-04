/**
 * Filters out adult/erotic content from OMDB search results.
 * Uses title and optional poster/rating hints to exclude inappropriate items.
 */
const ADULT_KEYWORDS = [
  'adult',
  'erotic',
  'xxx',
  'porn',
  'sex tape',
  'playboy',
  'penthouse',
  'nude',
  'hardcore',
  'softcore',
];

function isFamilyFriendly(item) {
  if (!item || !item.Title) return false;
  const title = String(item.Title).toLowerCase();
  const hasAdultKeyword = ADULT_KEYWORDS.some((kw) => title.includes(kw));
  return !hasAdultKeyword;
}

/**
 * Filter an array of OMDB Search results to exclude adult content.
 * @param {Array} searchList - data.Search from OMDB response
 * @returns {Array} filtered array
 */
export function filterFamilyFriendly(searchList) {
  if (!Array.isArray(searchList)) return [];
  return searchList.filter(isFamilyFriendly);
}

const RESTRICTED_RATINGS = ['R', 'NC-17', 'X', 'TV-MA'];

/**
 * Returns true if OMDB detail data suggests adult content (should not be shown).
 * @param {Object} data - OMDB movie/show detail response
 * @returns {boolean}
 */
export function isAdultContent(data) {
  if (!data) return false;
  const rated = (data.Rated || '').toUpperCase();
  if (RESTRICTED_RATINGS.some((r) => rated.includes(r))) return true;
  const genre = (data.Genre || '').toLowerCase();
  if (genre.includes('adult')) return true;
  return false;
}
