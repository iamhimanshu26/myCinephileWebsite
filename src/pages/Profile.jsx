import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import {
  getAllCollectionEntries,
  getCollectionStats,
  getCollectionItems,
  getFavoriteItems,
} from '../redux/collectionSlice/collectionSlice';
import { getRecentlyViewed } from '../services/recentlyViewedService';
import { getBookings } from '../services/bookingService';
import { getAllReviews } from '../services/reviewService';
import { getActivityFeed } from '../services/activityService';
import { buildTasteProfile } from '../services/personalizationService';
import './profile.scss';

const Profile = () => {
  const collectionStats = useSelector(getCollectionStats);
  const watchlistItems = useSelector(getCollectionItems);
  const favoriteItems = useSelector(getFavoriteItems);
  const collectionEntries = useSelector(getAllCollectionEntries);

  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);
  const bookings = useMemo(() => getBookings(), []);
  const reviews = useMemo(() => getAllReviews(), []);
  const activityFeed = useMemo(
    () => getActivityFeed()
      .slice(0, 12)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    []
  );
  const recentReviewActivity = useMemo(
    () => [...reviews]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 4),
    [reviews]
  );

  const tasteProfile = useMemo(() => buildTasteProfile({
    recentlyViewed,
    reviews,
    bookings,
    collectionEntries,
  }), [recentlyViewed, reviews, bookings, collectionEntries]);

  const insightCards = [
    { label: 'Favorite Genre', value: tasteProfile.favoriteGenre || 'Warming up' },
    { label: 'Most Viewed Type', value: tasteProfile.mostViewedType || 'Not enough data' },
    {
      label: 'Average Rating',
      value: tasteProfile.averageRating ? `${tasteProfile.averageRating.toFixed(1)} / 5` : 'No ratings yet',
    },
    { label: 'Total Bookings', value: String(bookings.length) },
    { label: 'Watchlist Count', value: String(collectionStats.watchlistCount) },
    { label: 'Reviews Written', value: String(reviews.length) },
    { label: 'Recently Viewed', value: String(recentlyViewed.length) },
    { label: 'Suggested Mood', value: tasteProfile.suggestedMood || 'Balanced Discovery' },
    {
      label: 'Current Taste Profile',
      value: tasteProfile.currentTasteProfile || 'Not enough signals yet',
    },
  ];

  return (
    <PageTransition className="profile-page page-shell">
      <div className="profile-page__container">
        <header className="page-header">
          <h1 className="page-title">Profile & Activity</h1>
          <p className="page-subtitle">
            Overview of your Cinephile journey across saves, reviews, bookings, and recent views.
          </p>
        </header>

        <section className="profile-stats" aria-label="Profile stats">
          <article className="surface-card profile-stat">
            <h3>Watchlist</h3>
            <p>{collectionStats.watchlistCount}</p>
          </article>
          <article className="surface-card profile-stat">
            <h3>Favorites</h3>
            <p>{collectionStats.favoriteCount}</p>
          </article>
          <article className="surface-card profile-stat">
            <h3>Recently Viewed</h3>
            <p>{recentlyViewed.length}</p>
          </article>
          <article className="surface-card profile-stat">
            <h3>Bookings</h3>
            <p>{bookings.length}</p>
          </article>
          <article className="surface-card profile-stat">
            <h3>Reviews</h3>
            <p>{reviews.length}</p>
          </article>
        </section>

        <motion.section
          className="surface-card profile-insights"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="profile-insights__header">
            <h2>Personalization Insights</h2>
            <Link className="btn btn--ghost" to="/cinephile-ai">Open Cinephile AI</Link>
          </div>
          <div className="profile-insights__grid">
            {insightCards.map((entry) => (
              <article key={entry.label} className="profile-insight-card">
                <h3>{entry.label}</h3>
                <p>{entry.value}</p>
              </article>
            ))}
          </div>
          {tasteProfile.hasEnoughSignals ? (
            <p className="profile-insights__summary">{tasteProfile.tasteSummary}</p>
          ) : (
            <StateBlock
              title="Profile is still learning your taste"
              description="Start exploring, reviewing, saving, and booking movies to build your Cinephile taste profile."
              compact
            />
          )}
        </motion.section>

        <section className="profile-lists">
          <article className="surface-card profile-list">
            <h2>Saved Movies</h2>
            {watchlistItems.length === 0 ? (
              <StateBlock
                title="No saved movies yet"
                description="Use watchlist actions to save titles."
                compact
              />
            ) : (
              <ul>
                {watchlistItems.slice(0, 8).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            )}
          </article>

          <article className="surface-card profile-list">
            <h2>Favorite Movies</h2>
            {favoriteItems.length === 0 ? (
              <StateBlock
                title="No favorites yet"
                description="Mark favorite titles from details pages."
                compact
              />
            ) : (
              <ul>
                {favoriteItems.slice(0, 8).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <section className="surface-card profile-reviews-activity">
          <div className="profile-reviews-activity__header">
            <h2>Recent Review Activity</h2>
            <span className="badge">
              {reviews.length}
              {' '}
              total review(s)
            </span>
          </div>
          {recentReviewActivity.length === 0 ? (
            <StateBlock
              title="No reviews yet"
              description="Rate and review titles from the details page to build social-style activity."
              compact
            />
          ) : (
            <div className="profile-review-cards">
              {recentReviewActivity.map((review) => (
                <article key={review.id} className="profile-review-card">
                  <header>
                    <h3>{review.movieTitle || 'Untitled'}</h3>
                    <span>
                      {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                    </span>
                  </header>
                  <p className="profile-review-card__stars">
                    {'★'.repeat(Math.max(0, Number(review.rating) || 0))}
                    {'☆'.repeat(Math.max(0, 5 - (Number(review.rating) || 0)))}
                  </p>
                  <p>{review.reviewText}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <motion.section
          className="surface-card profile-activity"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Recent Activity Timeline</h2>
          {activityFeed.length === 0 ? (
            <StateBlock
              title="No activity yet"
              description="Your actions will appear here once you interact with the platform."
              compact
            />
          ) : (
            <ul>
              {activityFeed.map((entry) => (
                <li key={entry.id}>
                  <p>{entry.title}</p>
                  <em className="badge">{entry.type}</em>
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </PageTransition>
  );
};

export default Profile;
