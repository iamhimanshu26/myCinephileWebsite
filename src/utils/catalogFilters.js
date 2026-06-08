const getItemYear = (item) => (
  item.Year || item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || ''
);

const getItemTitle = (item) => (item.Title || item.title || item.name || '').toLowerCase();

const getItemRating = (item) => Number.parseFloat(item.imdbRating || item.vote_average || 0) || 0;

const getItemLanguageSource = (item) => (
  `${item.Language || ''} ${item.language || ''} ${item.original_language || ''}`.toLowerCase().trim()
);

const hasLanguageMetadata = (item) => Boolean(getItemLanguageSource(item));

const matchesLanguage = (item, language) => {
  if (!language || language === 'All') return true;
  const source = getItemLanguageSource(item);
  if (!source) return true; // Keep unsupported items visible until richer metadata is available.
  if (language === 'en') return source.includes('english') || source.includes('en');
  if (language === 'ja') return source.includes('japanese') || source.includes('ja');
  return true;
};

const matchesYear = (item, year) => !year || year === 'All' || getItemYear(item) === year;

const matchesGenre = (item, genreId) => {
  if (!genreId || genreId === 'All') return true;
  const genreIdNum = Number(genreId);
  if (!Array.isArray(item.genre_ids)) return true;
  return item.genre_ids.includes(genreIdNum);
};

const matchesCountry = (item, countryCode) => {
  if (!countryCode || countryCode === 'All') return true;
  if (!Array.isArray(item.origin_country)) return true;
  return item.origin_country.includes(countryCode);
};

const sortItems = (list, sortBy, sortOrder) => {
  const sorted = [...list];
  if (sortBy === 'Release Date') {
    sorted.sort((a, b) => {
      const ya = getItemYear(a);
      const yb = getItemYear(b);
      if (sortOrder === 'Descending') return (yb || '').localeCompare(ya || '');
      return (ya || '').localeCompare(yb || '');
    });
  } else if (sortBy === 'Title') {
    sorted.sort((a, b) => {
      const ta = getItemTitle(a);
      const tb = getItemTitle(b);
      return sortOrder === 'Descending' ? tb.localeCompare(ta) : ta.localeCompare(tb);
    });
  } else if (sortBy === 'Rating') {
    sorted.sort((a, b) => {
      const ra = getItemRating(a);
      const rb = getItemRating(b);
      return sortOrder === 'Descending' ? rb - ra : ra - rb;
    });
  }
  return sorted;
};

export const applyCatalogFilters = (
  list,
  {
    year,
    genre,
    country,
    language,
    sortBy = 'Release Date',
    sortOrder = 'Descending',
  } = {}
) => {
  const filtered = list
    .filter((item) => matchesYear(item, year))
    .filter((item) => matchesGenre(item, genre))
    .filter((item) => matchesCountry(item, country))
    .filter((item) => matchesLanguage(item, language));
  return sortItems(filtered, sortBy, sortOrder);
};

export const getLanguageFilterCoverage = (list) => {
  const supportedCount = list.filter(hasLanguageMetadata).length;
  return {
    totalCount: list.length,
    supportedCount,
    unsupportedCount: Math.max(0, list.length - supportedCount),
  };
};
