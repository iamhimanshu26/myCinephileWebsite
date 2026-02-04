import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsyncMoviesOrShowsDetails,
  fetchAsyncDetailByTmdbId,
  getSelectedMovieOrShow,
} from '../redux/moviesSlice/moviesSlice';
import {
  findMovieByImdbId,
  fetchMovieCredits,
  getMovieCredits,
  getFindResult,
  hasTMDbKey,
  clearCredits,
  clearFind,
} from '../redux/tmdbSlice/tmdbSlice';
import { isAdultContent } from '../utils/contentFilter';
import './details.scss';

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  const credits = useSelector(getMovieCredits);
  const findResult = useSelector(getFindResult);
  const tmdbAvailable = hasTMDbKey();

  useEffect(() => {
    if (!id) return;
    dispatch(clearCredits());
    dispatch(clearFind());
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
    const tmdbId =
      findResult.movie_results?.[0]?.id ?? findResult.tv_results?.[0]?.id;
    if (tmdbId) dispatch(fetchMovieCredits(tmdbId));
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
    <div>
      <div className="back-container">
        <Link to="/" className="back-btn">
          <IoMdArrowRoundBack />
        </Link>
      </div>
      <div className="movie-section">
        {Object.keys(data).length === 0 && (
          <div className="details-loading">Loading...</div>
        )}
        {Object.keys(data).length > 0 && isAdultContent(data) && (
          <div className="details-unavailable">
            <p>This content is not displayed to keep the site family-friendly.</p>
            <Link to="/">Back to home</Link>
          </div>
        )}
        {Object.keys(data).length > 0 && !isAdultContent(data) && (
          <>
            <div className="section-left">
              <div className="movie-title">{data.Title}</div>
              <div className="movie-rating">
                <span>
                  IMDB Rating
                  <i className="fa fa-star" />
                  {' '}
                  :
                  {' '}
                  {data.imdbRating}
                </span>
                <span>
                  IMDB Votes
                  <i className="fa fa-thumbs-up" />
                  {' '}
                  :
                  {' '}
                  {data.imdbVotes}
                </span>
                <span>
                  Runtime
                  <i className="fa fa-film" />
                  {' '}
                  :
                  {' '}
                  {data.Runtime}
                </span>
                <span>
                  Year
                  <i className="fa fa-calendar" />
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
