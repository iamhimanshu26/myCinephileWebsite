const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 10;
const PREMIUM_ROWS = new Set(['A', 'B']);
const RESERVED_SEATS = new Set(['A3', 'A4', 'B6', 'C7', 'D2', 'E9', 'F1']);
const UNAVAILABLE_SEATS = new Set(['C3', 'D8']);

export const buildSeatLayout = () => (
  ROWS.map((row) => (
    Array.from({ length: SEATS_PER_ROW }, (_, index) => {
      const seatNumber = index + 1;
      const code = `${row}${seatNumber}`;
      const isPremium = PREMIUM_ROWS.has(row);
      const isReserved = RESERVED_SEATS.has(code);
      const isUnavailable = UNAVAILABLE_SEATS.has(code);
      let state = 'available';
      if (isUnavailable) state = 'unavailable';
      else if (isReserved) state = 'reserved';
      return {
        code,
        row,
        seatNumber,
        isPremium,
        state,
      };
    })
  ))
);

export const isSeatSelectable = (seat) => seat.state === 'available';
