import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import {
  getAllCollectionEntries,
  getCollectionItems,
  getFavoriteItems,
  removeFromCollection,
  removeFromFavorites,
} from '../redux/collectionSlice/collectionSlice';
import { addActivity } from '../services/activityService';
import MovieCard from '../components/movieCard/MovieCard';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import './collection.scss';

const Collection = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const watchlistItems = useSelector(getCollectionItems);
  const favoriteItems = useSelector(getFavoriteItems);
  const allEntries = useSelector(getAllCollectionEntries);
  const view = searchParams.get('view');
  const isWatchlistView = view === 'watchlist';
  const isFavoritesView = view === 'favorites';

  const items = isFavoritesView
    ? favoriteItems
    : (isWatchlistView ? watchlistItems : allEntries);
  const title = isFavoritesView ? 'My Favorites' : (isWatchlistView ? 'My Watchlist' : 'My Collection');

  const toCardData = (item) => ({
    imdbID: item.id,
    id: item.id,
    Title: item.title,
    Year: item.year,
    Poster: item.poster || '',
    Type: item.type || '',
  });

  return (
    <PageTransition className="collection-page page-shell">
      <div className="collection-page-header page-header">
        <h1 className="page-title">{title}</h1>
        <div className="collection-view-switch">
          <Link className={`badge ${isWatchlistView ? 'is-active' : ''}`} to="/collection?view=watchlist">
            Watchlist
          </Link>
          <Link className={`badge ${isFavoritesView ? 'is-active' : ''}`} to="/collection?view=favorites">
            Favorites
          </Link>
          <Link className={`badge ${!isWatchlistView && !isFavoritesView ? 'is-active' : ''}`} to="/collection">
            All Saved
          </Link>
        </div>
        <p className="collection-page-sub page-subtitle">
          {items.length === 0
            ? `${isFavoritesView ? 'Favorite' : isWatchlistView ? 'Bookmark' : 'Save'} movies and series here to find them quickly.`
            : `${items.length} item${items.length === 1 ? '' : 's'} saved`}
        </p>
      </div>
      {items.length === 0 ? (
        <StateBlock
          title="Your collection is empty"
          description="Save movies and series from Home, Search, or Details to build your watchlist."
          actionLabel="Discover titles"
          actionTo="/"
        />
      ) : (
        <div className="collection-grid">
          {items.map((item) => (
            <div key={item.id} className="collection-card-wrap">
              <MovieCard data={toCardData(item)} />
              <button
                type="button"
                className="collection-remove"
                onClick={() => {
                  if (isFavoritesView) {
                    dispatch(removeFromFavorites(item.id));
                    addActivity({
                      type: 'favorite',
                      title: `Removed ${item.title} from Favorites`,
                    });
                  } else {
                    dispatch(removeFromCollection(item.id));
                    addActivity({
                      type: 'watchlist',
                      title: `Removed ${item.title} from Watchlist`,
                    });
                  }
                }}
                aria-label={`Remove ${item.title} from ${isFavoritesView ? 'favorites' : 'watchlist'}`}
                title={`Remove from ${isFavoritesView ? 'favorites' : 'watchlist'}`}
              >
                <FiX />
              </button>
              <Link to={`/booking/${item.id}`} className="collection-book btn btn--ghost">
                Book Ticket
              </Link>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default Collection;
