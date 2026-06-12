const BOOKING_STORAGE_KEY = 'cinephile_bookings';

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveBookings = (bookings) => {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
  return bookings;
};

const createBookingId = () => (
  `CPH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
);

export const getAllBookings = () => {
  const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
  return safeParse(raw).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getBookingById = (bookingId) => (
  getAllBookings().find((entry) => entry.bookingId === bookingId)
);

export const createBooking = (payload) => {
  const now = new Date().toISOString();
  const nextBooking = {
    bookingId: createBookingId(),
    movieId: payload.movieId,
    movieTitle: payload.movieTitle || 'Untitled',
    poster: payload.poster || '',
    date: payload.date || '',
    theatre: payload.theatre || '',
    screen: payload.screen || '',
    showtime: payload.showtime || '',
    seats: Array.isArray(payload.seats) ? payload.seats : [],
    ticketCount: Number(payload.ticketCount || 0),
    pricePerTicket: Number(payload.pricePerTicket || 0),
    totalAmount: Number(payload.totalAmount || 0),
    status: payload.status || 'Confirmed',
    createdAt: now,
    updatedAt: now,
  };
  const current = getAllBookings();
  saveBookings([nextBooking, ...current]);
  return nextBooking;
};

export const updateBookingStatus = (bookingId, status) => {
  const now = new Date().toISOString();
  const current = getAllBookings();
  const next = current.map((entry) => (
    entry.bookingId === bookingId
      ? { ...entry, status, updatedAt: now }
      : entry
  ));
  saveBookings(next);
  return next.find((entry) => entry.bookingId === bookingId) || null;
};

export const clearBookings = () => saveBookings([]);

// Future migration note:
// Keep this interface stable and replace localStorage with backend API calls later.
