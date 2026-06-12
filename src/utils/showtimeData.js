export const DEFAULT_TICKET_PRICE = 14;
export const PREMIUM_TICKET_PRICE = 18;

export const THEATRE_OPTIONS = [
  {
    id: 'cinephile-central-tokyo',
    name: 'Cinephile Central Tokyo',
    screens: ['Screen 1', 'Screen 2', 'IMAX Demo'],
    showtimes: ['10:30', '13:45', '16:30', '19:15', '21:40'],
  },
  {
    id: 'emerald-grand-cinema',
    name: 'Emerald Grand Cinema',
    screens: ['Screen 1', 'Premium Lounge'],
    showtimes: ['11:00', '14:10', '17:20', '20:30'],
  },
  {
    id: 'sakura-screen-house',
    name: 'Sakura Screen House',
    screens: ['Screen 1', 'Screen 2'],
    showtimes: ['10:15', '13:00', '15:50', '18:40', '21:15'],
  },
  {
    id: 'metro-premium-theatre',
    name: 'Metro Premium Theatre',
    screens: ['Screen 1', 'IMAX Demo', 'Premium Lounge'],
    showtimes: ['09:45', '12:20', '15:10', '18:00', '21:00'],
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
