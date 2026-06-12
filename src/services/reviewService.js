export const REVIEWS_STORAGE_KEY = 'cinephile_reviews';

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveReviews = (reviews) => {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  return reviews;
};

const createReviewId = () => `review-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const getAllReviews = () => {
  const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
  return safeParse(raw);
};

export const getReviewsByMovieId = (movieId) => (
  getAllReviews()
    .filter((review) => review.movieId === movieId)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
);

const upsertReview = ({
  id,
  movieId,
  movieTitle,
  rating,
  reviewText,
}) => {
  const now = new Date().toISOString();
  const all = getAllReviews();
  const normalized = {
    id: id || createReviewId(),
    movieId,
    movieTitle,
    rating: Number(rating) || 0,
    reviewText: reviewText?.trim() || '',
    createdAt: id ? (all.find((entry) => entry.id === id)?.createdAt || now) : now,
    updatedAt: now,
  };

  const next = id
    ? all.map((entry) => (entry.id === id ? normalized : entry))
    : [normalized, ...all];
  return saveReviews(next);
};

export const addReview = ({
  movieId,
  movieTitle,
  rating,
  reviewText,
}) => upsertReview({
  movieId,
  movieTitle,
  rating,
  reviewText,
});

export const updateReview = ({
  id,
  movieId,
  movieTitle,
  rating,
  reviewText,
}) => upsertReview({
  id,
  movieId,
  movieTitle,
  rating,
  reviewText,
});

export const saveReview = ({
  id,
  movieId,
  movieTitle,
  rating,
  reviewText,
}) => upsertReview({
  id,
  movieId,
  movieTitle,
  rating,
  reviewText,
});

export const deleteReview = (reviewId) => {
  const next = getAllReviews().filter((entry) => entry.id !== reviewId);
  return saveReviews(next);
};

export const getAverageRatingByMovieId = (movieId) => {
  const ratings = getReviewsByMovieId(movieId)
    .map((entry) => Number(entry.rating))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!ratings.length) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
};

// Future migration note:
// Keep this service API stable and replace localStorage with backend persistence later.
