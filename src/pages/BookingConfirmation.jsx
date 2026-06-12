import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import ConfirmationTicket from '../components/booking/ConfirmationTicket';
import { getBookingById } from '../services/bookingService';
import './bookingConfirmation.scss';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const booking = bookingId ? getBookingById(bookingId) : null;

  if (!booking) {
    return (
      <PageTransition className="booking-confirmation page-shell">
        <StateBlock
          variant="error"
          title="Booking not found"
          description="The booking confirmation could not be loaded."
          actionLabel="View Bookings"
          actionTo="/bookings"
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="booking-confirmation page-shell">
      <div className="booking-confirmation__container">
        <ConfirmationTicket booking={booking} />
        <p className="booking-confirmation__note">
          Demo reservation only — no real payment was processed.
        </p>
        <div className="booking-confirmation__actions">
          <Link className="btn btn--primary" to="/bookings">View Booking History</Link>
          <Link className="btn btn--ghost" to="/">Back to Home</Link>
          <Link className="btn btn--ghost" to={`/movie/${booking.movieId}`}>View Movie Details</Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookingConfirmation;
