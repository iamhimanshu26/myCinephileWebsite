import React from 'react';
import PropTypes from 'prop-types';
import ImageWithFallback from '../media/ImageWithFallback';

const BookingSummaryCard = ({
  movieTitle,
  poster,
  date,
  theatre,
  screen,
  showtime,
  seats,
  ticketCount,
  pricePerTicket,
  totalAmount,
}) => (
  <article className="booking-summary-card surface-card">
    <div className="booking-summary-card__poster">
      <ImageWithFallback
        src={poster}
        alt={`${movieTitle} poster`}
        title={movieTitle}
        aspectRatio="2 / 3"
      />
    </div>
    <div className="booking-summary-card__info">
      <h3>{movieTitle}</h3>
      <p><strong>Date:</strong> {date || 'Not selected'}</p>
      <p><strong>Theatre:</strong> {theatre || 'Not selected'}</p>
      <p><strong>Screen:</strong> {screen || 'Not selected'}</p>
      <p><strong>Showtime:</strong> {showtime || 'Not selected'}</p>
      <p><strong>Seats:</strong> {seats.length ? seats.join(', ') : 'No seats selected'}</p>
      <p><strong>Tickets:</strong> {ticketCount}</p>
      <p><strong>Price per ticket:</strong> ${pricePerTicket.toFixed(2)}</p>
      <p className="booking-summary-card__total"><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
      <p className="booking-summary-card__note">
        This is a demo reservation flow. No real payment will be processed.
      </p>
    </div>
  </article>
);

BookingSummaryCard.propTypes = {
  movieTitle: PropTypes.string,
  poster: PropTypes.string,
  date: PropTypes.string,
  theatre: PropTypes.string,
  screen: PropTypes.string,
  showtime: PropTypes.string,
  seats: PropTypes.arrayOf(PropTypes.string),
  ticketCount: PropTypes.number,
  pricePerTicket: PropTypes.number,
  totalAmount: PropTypes.number,
};

BookingSummaryCard.defaultProps = {
  movieTitle: '',
  poster: '',
  date: '',
  theatre: '',
  screen: '',
  showtime: '',
  seats: [],
  ticketCount: 0,
  pricePerTicket: 0,
  totalAmount: 0,
};

export default BookingSummaryCard;
