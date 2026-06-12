import React from 'react';
import PropTypes from 'prop-types';

const SeatMap = ({ seats, selectedSeats, onToggleSeat }) => (
  <div className="seat-map">
    <div className="seat-map__screen">SCREEN</div>
    <div className="seat-map__grid">
      {seats.flat().map((seat) => {
        const isSelected = selectedSeats.includes(seat.code);
        const className = [
          'seat-map__seat',
          `seat-map__seat--${seat.state}`,
          seat.isPremium ? 'seat-map__seat--premium' : '',
          isSelected ? 'is-selected' : '',
        ].join(' ');

        return (
          <button
            key={seat.code}
            type="button"
            className={className}
            onClick={() => onToggleSeat(seat)}
            disabled={seat.state !== 'available'}
            aria-label={`Seat ${seat.code}`}
          >
            {seat.code}
          </button>
        );
      })}
    </div>

    <div className="seat-map__legend">
      <span><i className="seat-map__dot seat-map__dot--available" /> Available</span>
      <span><i className="seat-map__dot seat-map__dot--selected" /> Selected</span>
      <span><i className="seat-map__dot seat-map__dot--reserved" /> Reserved</span>
      <span><i className="seat-map__dot seat-map__dot--premium" /> Premium</span>
      <span><i className="seat-map__dot seat-map__dot--unavailable" /> Unavailable</span>
    </div>
  </div>
);

SeatMap.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        isPremium: PropTypes.bool,
      })
    )
  ).isRequired,
  selectedSeats: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleSeat: PropTypes.func.isRequired,
};

export default SeatMap;
