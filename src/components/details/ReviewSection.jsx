import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEdit2, FiStar, FiTrash2 } from 'react-icons/fi';
import StateBlock from '../ui/StateBlock';
import {
  addReview,
  deleteReview,
  getAverageRatingByMovieId,
  getReviewsByMovieId,
  updateReview,
} from '../../services/reviewService';

const ratingOptions = [1, 2, 3, 4, 5];
const renderStars = (value) => (
  <span className="detail-reviews__stars" aria-label={`${value} stars`}>
    {Array.from({ length: 5 }, (_, index) => (
      <FiStar key={`${value}-star-${index}`} className={index < value ? 'is-active' : ''} />
    ))}
  </span>
);

const ReviewSection = ({ movieId, movieTitle, onReviewSaved }) => {
  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const [editingId, setEditingId] = useState('');
  const [reviews, setReviews] = useState(() => getReviewsByMovieId(movieId));

  const averageRating = useMemo(
    () => getAverageRatingByMovieId(movieId),
    [movieId, reviews]
  );

  const refresh = () => {
    setReviews(getReviewsByMovieId(movieId));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!reviewText.trim()) return;
    if (editingId) {
      updateReview({
        id: editingId,
        movieId,
        movieTitle,
        rating,
        reviewText,
      });
    } else {
      addReview({
        movieId,
        movieTitle,
        rating,
        reviewText,
      });
    }
    const actionType = editingId ? 'updated' : 'created';
    setReviewText('');
    setRating(4);
    setEditingId('');
    refresh();
    onReviewSaved({
      action: actionType,
      rating,
      reviewText,
    });
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating || 4);
    setReviewText(review.reviewText || '');
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId);
    if (editingId === reviewId) {
      setEditingId('');
      setReviewText('');
      setRating(4);
    }
    refresh();
    onReviewSaved({
      action: 'deleted',
      rating: reviewId === editingId ? rating : 0,
    });
  };

  return (
    <section className="detail-reviews">
      <div className="detail-reviews__header">
        <h2>Reviews & Ratings</h2>
        <p>
          Average user rating:
          {' '}
          <strong>{averageRating ? averageRating.toFixed(1) : 'N/A'}</strong>
          {' '}
          ·
          {' '}
          <strong>{reviews.length}</strong>
          {' '}
          review(s)
        </p>
      </div>

      <form className="detail-reviews__form surface-card" onSubmit={handleSubmit}>
        <label htmlFor="review-rating">
          Your Rating
          <select
            id="review-rating"
            className="select"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {ratingOptions.map((value) => (
              <option key={value} value={value}>
                {value} star{value > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="review-text">
          Your Review
          <textarea
            id="review-text"
            className="input detail-reviews__textarea"
            rows={4}
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Share your thoughts about this title..."
          />
        </label>

        <div className="detail-reviews__actions">
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Update Review' : 'Save Review'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditingId('');
                setReviewText('');
                setRating(4);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {reviews.length === 0 ? (
        <StateBlock
          title="No reviews yet"
          description="Be the first to rate and review this movie."
          compact
        />
      ) : (
        <div className="detail-reviews__list">
          {reviews.map((review) => (
            <article key={review.id} className="detail-reviews__card surface-card">
              <header>
                <strong>
                  {renderStars(review.rating || 0)}
                  <span>{review.rating}/5</span>
                </strong>
                <span>{new Date(review.updatedAt || review.createdAt).toLocaleString()}</span>
              </header>
              <p>{review.reviewText}</p>
              <div className="detail-reviews__card-actions">
                <button type="button" className="btn btn--ghost" onClick={() => handleEdit(review)}>
                  <FiEdit2 />
                  Edit
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => handleDelete(review.id)}>
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

ReviewSection.propTypes = {
  movieId: PropTypes.string.isRequired,
  movieTitle: PropTypes.string,
  onReviewSaved: PropTypes.func,
};

ReviewSection.defaultProps = {
  movieTitle: '',
  onReviewSaved: () => {},
};

export default ReviewSection;
