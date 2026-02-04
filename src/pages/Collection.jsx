import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCollectionItems, removeFromCollection } from '../redux/collectionSlice/collectionSlice';
import MovieCard from '../components/movieCard/MovieCard';
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
    <div className="collection-page">
      <div className="collection-page-header">
        <h1>My Collection</h1>
        <p className="collection-page-sub">
          {items.length === 0
            ? 'Save movies and series here to find them quickly.'
            : `${items.length} item${items.length === 1 ? '' : 's'} saved`}
        </p>
      </div>
      {items.length === 0 ? (
        <div className="collection-empty">
          <i className="fa fa-bookmark-o" aria-hidden />
          <p>No items yet. Add movies or series from the home page, search, or detail pages.</p>
        </div>
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
                <i className="fa fa-times" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
