const ACTIVITY_STORAGE_KEY = 'cinephile_activity_feed';
const MAX_ACTIVITY_ITEMS = 80;

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveActivity = (items) => {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(items));
  return items;
};

const createActivityId = () => `activity-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const getActivityFeed = () => {
  const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  return safeParse(raw);
};

export const addActivity = ({
  type,
  title,
  metadata,
}) => {
  const nextItem = {
    id: createActivityId(),
    type: type || 'general',
    title: title || 'Activity',
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };
  const current = getActivityFeed();
  return saveActivity([nextItem, ...current].slice(0, MAX_ACTIVITY_ITEMS));
};

export const clearActivityFeed = () => saveActivity([]);

// Future migration note:
// Replace localStorage implementation with API-backed activity stream later.
