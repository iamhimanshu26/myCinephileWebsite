import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { getCollectionItems, removeFromCollection } from '../redux/collectionSlice/collectionSlice';
import MovieCard from '../components/movieCard/MovieCard';
import StateBlock from '../components/ui/StateBlock';
import './collection.scss';

const Collection = () => {
  const dispatch = useDispatch();
  const items = useSelector(getCollectionItems);

  const toCardData = (item) => ({
    imdbID: item.id,
    id: item.id,
    Title: item.title,
    Year: item.year,
    Poster: item.poster || '',
  });

  return (
    <div className="collection-page page-shell">
      <div className="collection-page-header page-header">
        <h1 className="page-title">My Collection</h1>
        <p className="collection-page-sub page-subtitle">
          {items.length === 0
            ? 'Save movies and series here to find them quickly.'
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
                onClick={() => dispatch(removeFromCollection(item.id))}
                aria-label={`Remove ${item.title} from collection`}
                title="Remove from collection"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
