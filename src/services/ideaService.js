const IDEAS_STORAGE_KEY = 'cinephile_development_ideas';

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createIdeaId = () => `idea-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const normalizeIdea = (idea) => ({
  id: idea.id || createIdeaId(),
  title: idea.title || '',
  category: idea.category || 'Other',
  priority: idea.priority || 'Medium',
  status: idea.status || 'Saved',
  description: idea.description || '',
  whyHelpful: idea.whyHelpful || '',
  implementationNotes: idea.implementationNotes || '',
  createdAt: idea.createdAt || new Date().toISOString(),
  updatedAt: idea.updatedAt || new Date().toISOString(),
});

const saveIdeas = (ideas) => {
  localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  return ideas;
};

export const getAllIdeas = () => {
  const raw = localStorage.getItem(IDEAS_STORAGE_KEY);
  const ideas = safeParse(raw);
  return ideas.map(normalizeIdea);
};

export const createIdea = (payload) => {
  const ideas = getAllIdeas();
  const newIdea = normalizeIdea({
    ...payload,
    id: createIdeaId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return saveIdeas([newIdea, ...ideas]);
};

export const updateIdea = (ideaId, updates) => {
  const ideas = getAllIdeas();
  const next = ideas.map((idea) => (
    idea.id === ideaId
      ? normalizeIdea({
        ...idea,
        ...updates,
        id: idea.id,
        createdAt: idea.createdAt,
        updatedAt: new Date().toISOString(),
      })
      : idea
  ));
  return saveIdeas(next);
};

export const deleteIdea = (ideaId) => {
  const ideas = getAllIdeas();
  const next = ideas.filter((idea) => idea.id !== ideaId);
  return saveIdeas(next);
};

export const clearIdeas = () => saveIdeas([]);

// Future migration note:
// Replace these localStorage operations with API calls to `development_ideas`
// while keeping this service interface stable for pages/components.
