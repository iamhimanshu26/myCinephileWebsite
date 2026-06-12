import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAsyncMoviesOrShowsDetails,
  fetchAsyncDetailByTmdbId,
  getSelectedMovieOrShow,
} from '../redux/moviesSlice/moviesSlice';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import BookingStepper from '../components/booking/BookingStepper';
import SeatMap from '../components/booking/SeatMap';
import BookingSummaryCard from '../components/booking/BookingSummaryCard';
import { buildSeatLayout, isSeatSelectable } from '../utils/seatMap';
import {
  DEFAULT_TICKET_PRICE,
  PREMIUM_TICKET_PRICE,
  THEATRE_OPTIONS,
  getNextBookingDates,
} from '../utils/showtimeData';
import { createBooking } from '../services/bookingService';
import { addActivity } from '../services/activityService';
import { getMediaTitle, getPosterUrl } from '../utils/media';
import './bookingFlow.scss';

const STEP_LABELS = [
  'Select Date',
  'Select Theatre',
  'Select Showtime',
  'Select Seats',
  'Review Booking',
];

const BookingFlow = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movie = useSelector(getSelectedMovieOrShow);

  const [activeStep, setActiveStep] = useState(0);
  const [date, setDate] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [screen, setScreen] = useState('');
  const [showtime, setShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const availableDates = useMemo(() => getNextBookingDates(7), []);
  const seatLayout = useMemo(() => buildSeatLayout(), []);
  const selectedTheatre = useMemo(
    () => THEATRE_OPTIONS.find((entry) => entry.id === theatreId) || null,
    [theatreId]
  );

  useEffect(() => {
    if (!movieId) return;
    if (movieId.startsWith('tt')) dispatch(fetchAsyncMoviesOrShowsDetails(movieId));
    else dispatch(fetchAsyncDetailByTmdbId(movieId));
  }, [dispatch, movieId]);

  const movieTitle = getMediaTitle(movie);
  const moviePoster = getPosterUrl(movie, 'w500');

  const selectedSeatObjects = useMemo(
    () => seatLayout.flat().filter((seat) => selectedSeats.includes(seat.code)),
    [seatLayout, selectedSeats]
  );
  const ticketCount = selectedSeats.length;
  const totalAmount = selectedSeatObjects.reduce(
    (sum, seat) => sum + (seat.isPremium ? PREMIUM_TICKET_PRICE : DEFAULT_TICKET_PRICE),
    0
  );
  const averagePrice = ticketCount ? totalAmount / ticketCount : DEFAULT_TICKET_PRICE;

  const validateStep = () => {
    if (activeStep === 0 && !date) return 'Please select a date to continue.';
    if (activeStep === 1 && (!theatreId || !screen)) return 'Select theatre and screen first.';
    if (activeStep === 2 && !showtime) return 'Choose a showtime before proceeding.';
    if (activeStep === 3 && selectedSeats.length === 0) return 'Please select at least one seat.';
    return '';
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage('');
    if (activeStep === STEP_LABELS.length - 1) {
      const booking = createBooking({
        movieId,
        movieTitle,
        poster: moviePoster,
        date,
        theatre: selectedTheatre?.name,
        screen,
        showtime,
        seats: selectedSeats,
        ticketCount,
        pricePerTicket: averagePrice,
        totalAmount,
        status: 'Confirmed',
      });
      addActivity({
        type: 'booking',
        title: `Booked ${movieTitle} for ${showtime}`,
        metadata: { bookingId: booking.bookingId },
      });
      navigate(`/booking-confirmation/${booking.bookingId}`);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const toggleSeat = (seat) => {
    if (!isSeatSelectable(seat)) return;
    setSelectedSeats((prev) => (
      prev.includes(seat.code)
        ? prev.filter((entry) => entry !== seat.code)
        : [...prev, seat.code]
    ));
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <section className="booking-step surface-card">
          <h2>Select Date</h2>
          <div className="booking-chip-grid">
            {availableDates.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={`booking-chip ${date === entry.key ? 'is-active' : ''}`}
                onClick={() => setDate(entry.key)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (activeStep === 1) {
      return (
        <section className="booking-step surface-card">
          <h2>Select Theatre & Screen</h2>
          <div className="booking-theatre-grid">
            {THEATRE_OPTIONS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`booking-theatre-card ${theatreId === entry.id ? 'is-active' : ''}`}
                onClick={() => {
                  setTheatreId(entry.id);
                  setScreen('');
                  setShowtime('');
                }}
              >
                <h3>{entry.name}</h3>
                <p>{entry.screens.length} screen options</p>
              </button>
            ))}
          </div>
          {!!selectedTheatre && (
            <div className="booking-sub-grid">
              {selectedTheatre.screens.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  className={`booking-chip ${screen === entry ? 'is-active' : ''}`}
                  onClick={() => setScreen(entry)}
                >
                  {entry}
                </button>
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activeStep === 2) {
      return (
        <section className="booking-step surface-card">
          <h2>Select Showtime</h2>
          {!selectedTheatre ? (
            <StateBlock
              title="Select theatre first"
              description="Go back and choose theatre/screen before choosing showtime."
              compact
            />
          ) : (
            <div className="booking-chip-grid">
              {selectedTheatre.showtimes.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  className={`booking-chip ${showtime === entry ? 'is-active' : ''}`}
                  onClick={() => setShowtime(entry)}
                >
                  {entry}
                </button>
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activeStep === 3) {
      return (
        <section className="booking-step surface-card">
          <h2>Select Seats</h2>
          <SeatMap seats={seatLayout} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          <div className="booking-seat-summary">
            <p><strong>Selected seats:</strong> {selectedSeats.length ? selectedSeats.join(', ') : 'None'}</p>
            <p><strong>Ticket count:</strong> {ticketCount}</p>
            <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
          </div>
        </section>
      );
    }

    return (
      <section className="booking-step">
        <BookingSummaryCard
          movieTitle={movieTitle}
          poster={moviePoster}
          date={date}
          theatre={selectedTheatre?.name || ''}
          screen={screen}
          showtime={showtime}
          seats={selectedSeats}
          ticketCount={ticketCount}
          pricePerTicket={averagePrice}
          totalAmount={totalAmount}
        />
      </section>
    );
  };

  return (
    <PageTransition className="booking-page page-shell">
      <div className="booking-page__container">
        <header className="booking-page__header page-header">
          <h1 className="page-title">Book Ticket</h1>
          <p className="page-subtitle">
            Complete your reservation flow for
            {' '}
            <strong>{movieTitle || 'selected title'}</strong>
            .
          </p>
        </header>

        {!movieId ? (
          <StateBlock
            variant="error"
            title="Movie not selected"
            description="Please open a movie details page first and start booking there."
            actionLabel="Back to Home"
            actionTo="/"
          />
        ) : (
          <>
            <BookingStepper steps={STEP_LABELS} activeStep={activeStep} />
            {renderStep()}
            {!!errorMessage && (
              <p className="booking-page__error">{errorMessage}</p>
            )}
            <div className="booking-page__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Go Back
              </button>
              <button type="button" className="btn btn--primary" onClick={handleNext}>
                {activeStep === STEP_LABELS.length - 1 ? 'Confirm Reservation' : 'Continue'}
              </button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default BookingFlow;
