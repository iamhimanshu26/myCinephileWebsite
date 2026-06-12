import {
  getMediaId,
  getMediaTitle,
  getMediaYear,
  hasRenderablePoster,
} from './media';

const normalizeWords = (value = '') => (
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2)
);

export const getSimilarTitles = ({
  currentItem,
  candidatePools = [],
  limit = 12,
}) => {
  if (!currentItem) return [];
  const currentId = getMediaId(currentItem);
  const currentWords = normalizeWords(getMediaTitle(currentItem));
  const currentGenres = Array.isArray(currentItem.genre_ids) ? currentItem.genre_ids : [];
  const currentYear = Number.parseInt(getMediaYear(currentItem), 10) || 0;

  const allCandidates = candidatePools.flat().filter(Boolean);
  const byId = new Map();
  allCandidates.forEach((item) => {
    const id = getMediaId(item);
    if (!id || id === currentId || byId.has(id)) return;
    byId.set(id, item);
  });

  const scored = Array.from(byId.values()).map((item) => {
    let score = 0;
    const titleWords = normalizeWords(getMediaTitle(item));
    const wordOverlap = titleWords.filter((word) => currentWords.includes(word)).length;
    score += wordOverlap * 3;

    const candidateGenres = Array.isArray(item.genre_ids) ? item.genre_ids : [];
    const genreOverlap = candidateGenres.filter((genreId) => currentGenres.includes(genreId)).length;
    score += genreOverlap * 4;

    const year = Number.parseInt(getMediaYear(item), 10) || 0;
    if (currentYear && year) {
      const yearDistance = Math.abs(currentYear - year);
      if (yearDistance <= 2) score += 3;
      else if (yearDistance <= 5) score += 2;
      else if (yearDistance <= 8) score += 1;
    }

    if (hasRenderablePoster(item)) score += 5;

    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
};
