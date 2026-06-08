import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPersonDetails,
  fetchPersonMovieCredits,
  fetchPersonTvCredits,
  getPersonDetails,
  getPersonMovieCredits,
  getPersonTvCredits,
  clearPerson,
  hasTMDbKey,
} from '../redux/tmdbSlice/tmdbSlice';
import StateBlock from '../components/ui/StateBlock';
import './person.scss';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

const Person = () => {
  const { personId } = useParams();
  const dispatch = useDispatch();
  const person = useSelector(getPersonDetails);
  const movieCredits = useSelector(getPersonMovieCredits);
  const tvCredits = useSelector(getPersonTvCredits);
  const tmdbAvailable = hasTMDbKey();

  useEffect(() => {
    dispatch(clearPerson());
    if (personId) {
      dispatch(fetchPersonDetails(personId));
      dispatch(fetchPersonMovieCredits(personId));
      dispatch(fetchPersonTvCredits(personId));
    }
  }, [dispatch, personId]);

  if (!tmdbAvailable) {
    return (
      <div className="person-page page-shell">
        <StateBlock
          variant="error"
          title="TMDb key required"
          description="Person profiles require a TMDb API key. Add REACT_APP_TMDB_KEY to enable this page."
          actionLabel="Back to Home"
          actionTo="/"
        />
      </div>
    );
  }

  if (!person || !person.id) {
    return (
      <div className="person-page page-shell">
        <Link to="/" className="person-back-btn">
          <IoMdArrowRoundBack /> Back
        </Link>
        <StateBlock
          variant="loading"
          title="Loading person profile"
          description="Fetching biography and filmography details."
          compact
        />
      </div>
    );
  }

  const movies = (movieCredits && movieCredits.cast) || [];
  const shows = (tvCredits && tvCredits.cast) || [];
  const combined = [...movies.slice(0, 12), ...shows.slice(0, 12)];

  return (
    <div className="person-page page-shell">
      <Link to="/" className="person-back-btn">
        <IoMdArrowRoundBack /> Back
      </Link>
      <div className="person-hero">
        <div className="person-poster">
          {person.profile_path ? (
            <img
              src={`${IMAGE_BASE}${person.profile_path}`}
              alt={person.name}
            />
          ) : (
            <div className="person-poster-placeholder" />
          )}
        </div>
        <div className="person-info">
          <h1>{person.name}</h1>
          {person.birthday && (
            <p className="meta">Born: {person.birthday}</p>
          )}
          {person.place_of_birth && (
            <p className="meta">{person.place_of_birth}</p>
          )}
          {person.biography && (
            <div className="person-bio">
              <h3>Biography</h3>
              <p>{person.biography}</p>
            </div>
          )}
        </div>
      </div>
      <div className="person-filmography">
        <h2>Filmography</h2>
        <div className="filmography-grid">
          {combined.map((item) => {
            const title = item.title || item.name;
            const date = (item.release_date || item.first_air_date) || '';
            const year = date.slice(0, 4);
            const poster = item.poster_path
              ? `${IMAGE_BASE}${item.poster_path}`
              : null;
            const isMovie = !!item.title;
            const type = isMovie ? 'movie' : 'series';
            return (
              <Link
                key={`${type}-${item.id}`}
                to={`/movie/${item.id}`}
                className="filmography-card"
              >
                {poster ? (
                  <img src={poster} alt={title} />
                ) : (
                  <div className="poster-placeholder" />
                )}
                <div className="filmography-info">
                  <span className="title">{title}</span>
                  <span className="year">{year}</span>
                  <span className="type">{type}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Person;
