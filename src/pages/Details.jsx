import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
  FiBookmark, FiCalendar, FiClock, FiExternalLink, FiSearch, FiStar, FiThumbsUp,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsyncMoviesOrShowsDetails,
  fetchAsyncDetailByTmdbId,
  getSelectedMovieOrShow,
} from '../redux/moviesSlice/moviesSlice';
import {
  findMovieByImdbId,
  fetchMovieCredits,
  fetchWatchProviders,
  getMovieCredits,
  getFindResult,
  getWatchProviders,
  hasTMDbKey,
  clearCredits,
  clearFind,
  clearWatchProviders,
} from '../redux/tmdbSlice/tmdbSlice';
import {
  addToCollection,
  removeFromCollection,
  normalizeCollectionItem,
  isInCollection,
} from '../redux/collectionSlice/collectionSlice';
import { isAdultContent } from '../utils/contentFilter';
import StateBlock from '../components/ui/StateBlock';
import './details.scss';

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  const credits = useSelector(getMovieCredits);
  const findResult = useSelector(getFindResult);
  const watchProviders = useSelector(getWatchProviders);
  const tmdbAvailable = hasTMDbKey();
  const inCollection = useSelector(isInCollection(id));

  useEffect(() => {
    if (!id) return;
    dispatch(clearCredits());
    dispatch(clearFind());
    dispatch(clearWatchProviders());
    if (id.startsWith('tt')) {
      dispatch(fetchAsyncMoviesOrShowsDetails(id));
    } else {
      dispatch(fetchAsyncDetailByTmdbId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!data || !data.imdbID || !tmdbAvailable) return;
    dispatch(findMovieByImdbId(data.imdbID));
  }, [data?.imdbID, dispatch, tmdbAvailable]);

  useEffect(() => {
    if (!findResult) return;
    const movie = findResult.movie_results?.[0];
    const tv = findResult.tv_results?.[0];
    const tmdbId = movie?.id ?? tv?.id;
    const mediaType = movie ? 'movie' : 'tv';
    if (tmdbId) {
      dispatch(fetchMovieCredits(tmdbId));
      dispatch(fetchWatchProviders({ id: tmdbId, mediaType }));
    }
  }, [findResult, dispatch]);

  const directors = credits?.crew?.filter((c) => c.job === 'Director') || [];
  const cast = credits?.cast?.slice(0, 15) || [];

  const renderNames = (namesStr, type) => {
    if (!namesStr) return null;
    const list = namesStr.split(',').map((s) => s.trim());
    if (type === 'director' && directors.length > 0) {
      return list.map((name, i) => {
        const person = directors.find(
          (d) => d.name.toLowerCase() === name.toLowerCase()
        );
        if (person) {
          return (
            <React.Fragment key={person.id}>
              {i > 0 && ', '}
              <Link to={`/person/${person.id}`} className="person-link">
                {name}
              </Link>
            </React.Fragment>
          );
        }
        return (
          <span key={name}>
            {i > 0 && ', '}
            {name}
          </span>
        );
      });
    }
    if (type === 'cast' && cast.length > 0) {
      return list.map((name, i) => {
        const person = cast.find(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        );
        if (person) {
          return (
            <React.Fragment key={person.id}>
              {i > 0 && ', '}
              <Link to={`/person/${person.id}`} className="person-link">
                {name}
              </Link>
            </React.Fragment>
          );
        }
        return (
          <span key={name}>
            {i > 0 && ', '}
            {name}
          </span>
        );
      });
    }
    return <span>{namesStr}</span>;
  };

  return (
    <div className="details-page page-shell">
      <div className="back-container">
        <Link to="/" className="details-back-btn">
          <IoMdArrowRoundBack />
          <span>Back to home</span>
        </Link>
      </div>
      <div className="movie-section">
        {Object.keys(data).length === 0 && (
          <StateBlock
            variant="loading"
            title="Loading title details"
            description="Fetching cast, ratings, and streaming providers."
          />
        )}
        {Object.keys(data).length > 0 && isAdultContent(data) && (
          <StateBlock
            variant="empty"
            title="This title is hidden"
            description="This content is not displayed to keep the platform family-friendly."
            actionLabel="Back to home"
            actionTo="/"
          />
        )}
        {Object.keys(data).length > 0 && !isAdultContent(data) && (
          <>
            <div className="section-left">
              <div className="movie-title">{data.Title}</div>
              <div className="details-collection">
                {inCollection ? (
                  <button
                    type="button"
                    className="details-collection-btn details-collection-btn--remove"
                    onClick={() => dispatch(removeFromCollection(id))}
                  >
                    <FiBookmark />
                    Remove from collection
                  </button>
                ) : (
                  <button
                    type="button"
                    className="details-collection-btn"
                    onClick={() => dispatch(
                      addToCollection(normalizeCollectionItem({ ...data, id })),
                    )}
                  >
                    <FiBookmark />
                    Add to collection
                  </button>
                )}
              </div>
              <div className="movie-rating">
                <span>
                  IMDB Rating
                  <FiStar />
                  {' '}
                  :
                  {' '}
                  {data.imdbRating}
                </span>
                <span>
                  IMDB Votes
                  <FiThumbsUp />
                  {' '}
                  :
                  {' '}
                  {data.imdbVotes}
                </span>
                <span>
                  Runtime
                  <FiClock />
                  {' '}
                  :
                  {' '}
                  {data.Runtime}
                </span>
                <span>
                  Year
                  <FiCalendar />
                  {' '}
                  :
                  {' '}
                  {data.Year}
                </span>
              </div>
              <div className="movie-plot">{data.Plot}</div>
              <div className="movie-info">
                <div>
                  <span>Director</span>
                  <span>{renderNames(data.Director, 'director')}</span>
                </div>
                <div>
                  <span>Stars</span>
                  <span>{renderNames(data.Actors, 'cast')}</span>
                </div>
                <div>
                  <span>Genres</span>
                  <span>{data.Genre}</span>
                </div>
                <div>
                  <span>Languages</span>
                  <span>{data.Language}</span>
                </div>
                <div>
                  <span>Awards</span>
                  <span>{data.Awards}</span>
                </div>
              </div>
              {tmdbAvailable && (watchProviders || findResult) && (
                <div className="details-watch">
                  <span className="details-watch-label">Where to watch</span>
                  <div className="details-watch-links">
                    {(() => {
                      const first = watchProviders?.results
                        && Object.entries(watchProviders.results).find(
                          ([, info]) => info?.link
                        );
                      const link = first?.[1]?.link;
                      return link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="details-watch-link"
                        >
                          <FiExternalLink />
                          Watch / find streaming options on TMDb
                        </a>
                      ) : (
                        <a
                          href={`https://www.themoviedb.org/search?query=${encodeURIComponent(data.Title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="details-watch-link"
                        >
                          <FiSearch />
                          Search for this title on TMDb
                        </a>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            <div className="section-right">
              <img src={data.Poster} alt={data.Title} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Details;
