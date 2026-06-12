import React from 'react';
import PropTypes from 'prop-types';
import ImageWithFallback from '../media/ImageWithFallback';

const ConfirmationTicket = ({ booking }) => (
  <article className="confirmation-ticket surface-card">
    <header className="confirmation-ticket__header">
      <h1>Reservation Confirmed</h1>
      <span className="confirmation-ticket__status">{booking.status}</span>
    </header>
    <div className="confirmation-ticket__body">
      <div className="confirmation-ticket__poster">
        <ImageWithFallback
          src={booking.poster}
          alt={`${booking.movieTitle} poster`}
          title={booking.movieTitle}
        />
      </div>
      <div className="confirmation-ticket__details">
        <p><strong>Booking ID:</strong> {booking.bookingId}</p>
        <p><strong>Movie:</strong> {booking.movieTitle}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Theatre:</strong> {booking.theatre}</p>
        <p><strong>Screen:</strong> {booking.screen}</p>
        <p><strong>Showtime:</strong> {booking.showtime}</p>
        <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
        <p><strong>Total:</strong> ${Number(booking.totalAmount || 0).toFixed(2)}</p>
      </div>
      <div className="confirmation-ticket__qr" aria-hidden>
        <div className="confirmation-ticket__qr-box">QR DEMO</div>
      </div>
    </div>
  </article>
);

ConfirmationTicket.propTypes = {
  booking: PropTypes.shape({
    bookingId: PropTypes.string,
    movieTitle: PropTypes.string,
    poster: PropTypes.string,
    date: PropTypes.string,
    theatre: PropTypes.string,
    screen: PropTypes.string,
    showtime: PropTypes.string,
    seats: PropTypes.arrayOf(PropTypes.string),
    totalAmount: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
};

export default ConfirmationTicket;
