import React, { useMemo, useRef, useState } from 'react';
import {
  FiCheckCircle,
  FiEdit2,
  FiFlag,
  FiFolderPlus,
  FiLayers,
  FiSave,
  FiSearch,
  FiTarget,
  FiTrash2,
} from 'react-icons/fi';
import PageTransition from '../components/ui/PageTransition';
import StateBlock from '../components/ui/StateBlock';
import {
  createIdea,
  deleteIdea,
  getAllIdeas,
  updateIdea,
} from '../services/ideaService';
import './anyIdea.scss';

const CATEGORIES = [
  'UI/UX',
  'Movie Discovery',
  'Search & Filters',
  'Watchlist',
  'Collections',
  'Booking Flow',
  'User Profile',
  'AI Features',
  'Database',
  'Performance',
  'Accessibility',
  'Documentation',
  'Portfolio Presentation',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Saved', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Deferred'];
const SORT_OPTIONS = ['Latest', 'Oldest', 'Priority', 'Status'];

const PRIORITY_WEIGHT = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};
const STATUS_WEIGHT = {
  'In Progress': 5,
  Planned: 4,
  'Under Review': 3,
  Saved: 2,
  Deferred: 1,
  Completed: 0,
};

const initialFormState = {
  title: '',
  category: 'UI/UX',
  priority: 'Medium',
  status: 'Saved',
  description: '',
  whyHelpful: '',
  implementationNotes: '',
};

const AnyIdea = () => {
  const [ideas, setIdeas] = useState(() => getAllIdeas());
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const formRef = useRef(null);

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingId(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.title.trim()) return;

    if (editingId) {
      const updated = updateIdea(editingId, formState);
      setIdeas(updated);
    } else {
      const created = createIdea(formState);
      setIdeas(created);
    }
    resetForm();
  };

  const handleEdit = (idea) => {
    setEditingId(idea.id);
    setFormState({
      title: idea.title,
      category: idea.category,
      priority: idea.priority,
      status: idea.status,
      description: idea.description,
      whyHelpful: idea.whyHelpful,
      implementationNotes: idea.implementationNotes,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = (ideaId) => {
    const next = deleteIdea(ideaId);
    setIdeas(next);
    if (editingId === ideaId) resetForm();
  };

  const updateIdeaStatus = (ideaId, status) => {
    const next = updateIdea(ideaId, { status });
    setIdeas(next);
    if (editingId === ideaId) {
      setFormState((prev) => ({ ...prev, status }));
    }
  };

  const filteredIdeas = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = ideas.filter((idea) => {
      const matchesCategory = categoryFilter === 'All' || idea.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' || idea.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || idea.status === statusFilter;
      const matchesSearch = !query || (
        `${idea.title} ${idea.description} ${idea.whyHelpful} ${idea.implementationNotes}`
      ).toLowerCase().includes(query);
      return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
    });

    if (sortBy === 'Latest') {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Oldest') {
      list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'Priority') {
      list = [...list].sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
    } else if (sortBy === 'Status') {
      list = [...list].sort((a, b) => STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status]);
    }

    return list;
  }, [ideas, search, categoryFilter, priorityFilter, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: ideas.length,
    planned: ideas.filter((idea) => idea.status === 'Planned').length,
    inProgress: ideas.filter((idea) => idea.status === 'In Progress').length,
    completed: ideas.filter((idea) => idea.status === 'Completed').length,
    highPriority: ideas.filter((idea) => ['High', 'Critical'].includes(idea.priority)).length,
  }), [ideas]);

  return (
    <PageTransition className="any-idea-page page-shell">
      <div className="any-idea-page__container">
        <section className="any-idea-hero surface-card">
          <h1 className="page-title">Any Idea?</h1>
          <p className="page-subtitle">
            Capture new improvement ideas during development and save them
            {' '}
            for future implementation.
          </p>
          <p className="any-idea-hero__description">
            Not every good idea is part of the original roadmap. Use this space to capture future
            {' '}
            improvements, product thoughts, UI changes, technical upgrades,
            {' '}
            and feature ideas for Cinephile.
          </p>
        </section>

        <section className="any-idea-stats">
          <article className="any-idea-stat surface-card">
            <FiLayers />
            <div>
              <h3>Total Ideas</h3>
              <p>{stats.total}</p>
            </div>
          </article>
          <article className="any-idea-stat surface-card">
            <FiTarget />
            <div>
              <h3>Planned Ideas</h3>
              <p>{stats.planned}</p>
            </div>
          </article>
          <article className="any-idea-stat surface-card">
            <FiFolderPlus />
            <div>
              <h3>In Progress Ideas</h3>
              <p>{stats.inProgress}</p>
            </div>
          </article>
          <article className="any-idea-stat surface-card">
            <FiCheckCircle />
            <div>
              <h3>Completed Ideas</h3>
              <p>{stats.completed}</p>
            </div>
          </article>
          <article className="any-idea-stat surface-card">
            <FiFlag />
            <div>
              <h3>High Priority Ideas</h3>
              <p>{stats.highPriority}</p>
            </div>
          </article>
        </section>

        <section ref={formRef} className="any-idea-form surface-card">
          <div className="any-idea-form__header">
            <h2>{editingId ? 'Edit Idea' : 'Add New Idea'}</h2>
            {editingId && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="any-idea-form__grid">
              <label htmlFor="idea-title">
                Idea Title
                <input
                  id="idea-title"
                  name="title"
                  className="input"
                  placeholder="Short title of the idea"
                  value={formState.title}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label htmlFor="idea-category">
                Category
                <select
                  id="idea-category"
                  name="category"
                  className="select"
                  value={formState.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label htmlFor="idea-priority">
                Priority
                <select
                  id="idea-priority"
                  name="priority"
                  className="select"
                  value={formState.priority}
                  onChange={handleInputChange}
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </label>

              <label htmlFor="idea-status">
                Status
                <select
                  id="idea-status"
                  name="status"
                  className="select"
                  value={formState.status}
                  onChange={handleInputChange}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <label htmlFor="idea-description" className="any-idea-form__textarea">
              Description
              <textarea
                id="idea-description"
                name="description"
                rows={4}
                className="input any-idea-form__text-area"
                placeholder="Explain the idea"
                value={formState.description}
                onChange={handleInputChange}
                required
              />
            </label>

            <label htmlFor="idea-why-helpful" className="any-idea-form__textarea">
              Why This Could Help
              <textarea
                id="idea-why-helpful"
                name="whyHelpful"
                rows={3}
                className="input any-idea-form__text-area"
                placeholder="How this idea could improve Cinephile"
                value={formState.whyHelpful}
                onChange={handleInputChange}
                required
              />
            </label>

            <label htmlFor="idea-notes" className="any-idea-form__textarea">
              Implementation Notes (Optional)
              <textarea
                id="idea-notes"
                name="implementationNotes"
                rows={3}
                className="input any-idea-form__text-area"
                placeholder="Technical notes, architectural hints, migration considerations"
                value={formState.implementationNotes}
                onChange={handleInputChange}
              />
            </label>

            <button type="submit" className="btn btn--primary any-idea-form__submit">
              <FiSave />
              {editingId ? 'Update Idea' : 'Save Idea'}
            </button>
          </form>
        </section>

        <section className="any-idea-board">
          <div className="any-idea-board__controls surface-card">
            <div className="any-idea-board__search">
              <FiSearch />
              <input
                className="input"
                type="search"
                placeholder="Search saved ideas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="any-idea-board__filters">
              <select className="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select className="select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <StateBlock
              title="No ideas saved yet"
              description="When a new improvement idea comes up during development, save it here so it can be reviewed later."
              actionLabel="Add First Idea"
              onAction={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
          ) : (
            <div className="any-idea-board__grid">
              {filteredIdeas.map((idea) => (
                <article key={idea.id} className="any-idea-card surface-card">
                  <header className="any-idea-card__header">
                    <h3>{idea.title}</h3>
                    <span className="any-idea-card__date">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </header>

                  <div className="any-idea-card__badges">
                    <span className="badge badge--category">{idea.category}</span>
                    <span className={`badge badge--priority badge--${idea.priority.toLowerCase()}`}>
                      {idea.priority}
                    </span>
                    <span className={`badge badge--status badge--${idea.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {idea.status}
                    </span>
                  </div>

                  <div className="any-idea-card__section">
                    <h4>Description</h4>
                    <p>{idea.description}</p>
                  </div>
                  <div className="any-idea-card__section">
                    <h4>Why this helps</h4>
                    <p>{idea.whyHelpful}</p>
                  </div>
                  {idea.implementationNotes && (
                    <div className="any-idea-card__section">
                      <h4>Implementation notes</h4>
                      <p>{idea.implementationNotes}</p>
                    </div>
                  )}

                  <div className="any-idea-card__actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleEdit(idea)}
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleDelete(idea.id)}
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                    {idea.status !== 'Planned' && (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => updateIdeaStatus(idea.id, 'Planned')}
                      >
                        Mark as Planned
                      </button>
                    )}
                    {idea.status !== 'Completed' && (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => updateIdeaStatus(idea.id, 'Completed')}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default AnyIdea;
