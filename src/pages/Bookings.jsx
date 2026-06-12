import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import ImageWithFallback from '../components/media/ImageWithFallback';
import { cancelBooking, getBookings } from '../services/bookingService';
import { addActivity } from '../services/activityService';
import './bookings.scss';

const Bookings = () => {
  const [bookings, setBookings] = useState(() => getBookings());

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((entry) => entry.status === 'Confirmed').length,
    cancelled: bookings.filter((entry) => entry.status === 'Cancelled').length,
  }), [bookings]);

  const handleCancel = (bookingId) => {
    const updated = cancelBooking(bookingId);
    if (updated) {
      addActivity({
        type: 'booking',
        title: `Cancelled booking ${bookingId}`,
      });
    }
    setBookings(getBookings());
  };

  return (
    <PageTransition className="bookings-page page-shell">
      <div className="bookings-page__container">
        <header className="page-header">
          <h1 className="page-title">Booking History</h1>
          <p className="page-subtitle">
            {stats.total}
            {' '}
            booking(s) tracked.
            {' '}
            {stats.confirmed}
            {' '}
            confirmed,
            {' '}
            {stats.cancelled}
            {' '}
            cancelled.
          </p>
        </header>

        {bookings.length === 0 ? (
          <StateBlock
            title="No booking history yet"
            description="Complete a reservation from a movie details page to see it here."
            actionLabel="Explore Movies"
            actionTo="/"
          />
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <article key={booking.id || booking.bookingId} className="booking-card surface-card">
                <div className="booking-card__poster">
                  <ImageWithFallback
                    src={booking.poster}
                    alt={`${booking.movieTitle} poster`}
                    title={booking.movieTitle}
                  />
                </div>
                <div className="booking-card__info">
                  <h2>{booking.movieTitle}</h2>
                  <p><strong>Booking ID:</strong> {booking.id || booking.bookingId}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Theatre:</strong> {booking.theatre}</p>
                  <p><strong>Screen:</strong> {booking.screen}</p>
                  <p><strong>Showtime:</strong> {booking.showtime}</p>
                  <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                  <p><strong>Total:</strong> ${Number(booking.totalAmount).toFixed(2)}</p>
                  <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                  <span className={`badge booking-card__status booking-card__status--${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                  <div className="booking-card__actions">
                    <Link className="btn btn--ghost" to={`/movie/${booking.movieId}`}>Movie Details</Link>
                    {booking.status !== 'Cancelled' && (
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => handleCancel(booking.id || booking.bookingId)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Bookings;
