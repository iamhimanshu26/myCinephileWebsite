import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import {
  getCollectionStats,
  getCollectionItems,
  getFavoriteItems,
} from '../redux/collectionSlice/collectionSlice';
import { getRecentlyViewed } from '../services/recentlyViewedService';
import { getAllBookings } from '../services/bookingService';
import { getAllReviews } from '../services/reviewService';
import { getActivityFeed } from '../services/activityService';
import './profile.scss';

const Profile = () => {
  const collectionStats = useSelector(getCollectionStats);
  const watchlistItems = useSelector(getCollectionItems);
  const favoriteItems = useSelector(getFavoriteItems);

  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);
  const bookings = useMemo(() => getAllBookings(), []);
  const reviews = useMemo(() => getAllReviews(), []);
  const activityFeed = useMemo(() => getActivityFeed().slice(0, 12), []);

  return (
    <PageTransition className="profile-page page-shell">
      <div className="profile-page__container">
        <header className="page-header">
          <h1 className="page-title">Profile & Activity</h1>
          <p className="page-subtitle">
            Overview of your Cinephile journey across saves, reviews, bookings, and recent views.
          </p>
        </header>

        <section className="profile-stats">
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

        <section className="profile-lists">
          <article className="surface-card profile-list">
            <h2>Saved Movies</h2>
            {watchlistItems.length === 0 ? (
              <StateBlock title="No saved movies yet" description="Use watchlist actions to save titles." compact />
            ) : (
              <ul>{watchlistItems.slice(0, 8).map((item) => <li key={item.id}>{item.title}</li>)}</ul>
            )}
          </article>

          <article className="surface-card profile-list">
            <h2>Favorite Movies</h2>
            {favoriteItems.length === 0 ? (
              <StateBlock title="No favorites yet" description="Mark favorite titles from details pages." compact />
            ) : (
              <ul>{favoriteItems.slice(0, 8).map((item) => <li key={item.id}>{item.title}</li>)}</ul>
            )}
          </article>
        </section>

        <section className="surface-card profile-activity">
          <h2>Recent Activity Timeline</h2>
          {activityFeed.length === 0 ? (
            <StateBlock title="No activity yet" description="Your actions will appear here once you interact with the platform." compact />
          ) : (
            <ul>
              {activityFeed.map((entry) => (
                <li key={entry.id}>
                  <p>{entry.title}</p>
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default Profile;
