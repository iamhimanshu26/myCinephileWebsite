import React from 'react';
import PropTypes from 'prop-types';

const SeatMap = ({ seats, selectedSeats, onToggleSeat }) => (
  <div className="seat-map">
    <div className="seat-map__screen" aria-label="Theatre screen direction">SCREEN</div>
    <div className="seat-map__grid" aria-label="Seat selection map">
      {seats.map((row, rowIndex) => (
        <div key={`row-${rowIndex + 1}`} className="seat-map__row">
          {row.map((seat) => {
            const isSelected = selectedSeats.includes(seat.code);
            const isDisabled = seat.state !== 'available';
            const className = [
              'seat-map__seat',
              `seat-map__seat--${seat.state}`,
              seat.isPremium ? 'seat-map__seat--premium' : '',
              isSelected ? 'is-selected' : '',
            ].join(' ');
            let seatStatus = 'available';
            if (isDisabled) {
              seatStatus = seat.state;
            } else if (isSelected) {
              seatStatus = 'selected';
            }

            return (
              <button
                key={seat.code}
                type="button"
                className={className}
                onClick={() => onToggleSeat(seat)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
                aria-label={`Seat ${seat.code}, ${seatStatus}${seat.isPremium ? ', premium' : ''}`}
              >
                {seat.code}
              </button>
            );
          })}
        </div>
      ))}
    </div>

    <div className="seat-map__legend" aria-label="Seat map legend">
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
