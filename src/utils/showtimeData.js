export const DEFAULT_TICKET_PRICE = 14;
export const PREMIUM_TICKET_PRICE = 18;

export const SCREEN_OPTIONS = [
  'Screen 1',
  'Screen 2',
  'IMAX Demo',
  'Premium Lounge',
];

export const SHOWTIME_OPTIONS = [
  '10:30',
  '13:45',
  '16:30',
  '19:15',
  '21:40',
];

export const THEATRE_OPTIONS = [
  {
    id: 'cinephile-central-tokyo',
    name: 'Cinephile Central Tokyo',
    screens: [...SCREEN_OPTIONS],
    showtimes: [...SHOWTIME_OPTIONS],
  },
  {
    id: 'emerald-grand-cinema',
    name: 'Emerald Grand Cinema',
    screens: [...SCREEN_OPTIONS],
    showtimes: [...SHOWTIME_OPTIONS],
  },
  {
    id: 'sakura-screen-house',
    name: 'Sakura Screen House',
    screens: [...SCREEN_OPTIONS],
    showtimes: [...SHOWTIME_OPTIONS],
  },
  {
    id: 'metro-premium-theatre',
    name: 'Metro Premium Theatre',
    screens: [...SCREEN_OPTIONS],
    showtimes: [...SHOWTIME_OPTIONS],
  },
];

export const getNextBookingDates = (count = 6) => {
  const dates = [];
  for (let index = 0; index < count; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() + index);
    dates.push({
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });
  }
  return dates;
};
