import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiActivity,
  FiBookOpen,
  FiDatabase,
  FiGitBranch,
  FiLayers,
  FiMap,
  FiMonitor,
  FiNavigation,
  FiPackage,
  FiPlayCircle,
  FiServer,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import PageTransition from '../components/ui/PageTransition';
import CaseStudyTabs from '../components/caseStudy/CaseStudyTabs';
import CaseStudyCard from '../components/caseStudy/CaseStudyCard';
import PhaseCard from '../components/caseStudy/PhaseCard';
import RoadmapCard from '../components/caseStudy/RoadmapCard';
import TechStackCard from '../components/caseStudy/TechStackCard';
import WorkflowStep from '../components/caseStudy/WorkflowStep';
import '../components/caseStudy/caseStudy.scss';
import './howWeBuiltIt.scss';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'phase-tracker', label: 'Phase Tracker' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'discovery-workflow', label: 'Discovery Workflow' },
  { id: 'booking-flow', label: 'Booking Flow' },
  { id: 'any-idea-logic', label: 'Any Idea Logic' },
  { id: 'database', label: 'Database' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'future-improvements', label: 'Future Improvements' },
];

const OVERVIEW_METRICS = [
  { label: 'Product Type', value: 'Movie Discovery & Booking Platform' },
  { label: 'Core Purpose', value: 'Discover, save, explore, and plan what to watch' },
  { label: 'Current Stage', value: 'Active Development' },
  { label: 'Frontend', value: 'React' },
  { label: 'State Management', value: 'Redux' },
  { label: 'Styling', value: 'SCSS' },
  { label: 'Deployment', value: 'Vercel' },
  { label: 'Movie Data', value: 'OMDB API / catalog data' },
];

const ARCHITECTURE_LAYERS = [
  {
    title: 'Frontend Layer',
    text: 'Routes, pages, UI components, animations, and responsive layouts.',
    icon: <FiMonitor />,
  },
  {
    title: 'Routing Layer',
    text: 'Home, Search, Collection, Details, Person, Any Idea, and How We Built It.',
    icon: <FiNavigation />,
  },
  {
    title: 'State Management Layer',
    text: 'Redux stores movie data, watchlists, collections, and interactive UI states.',
    icon: <FiLayers />,
  },
  {
    title: 'API Service Layer',
    text: 'OMDB and catalog integrations with normalized payload handling.',
    icon: <FiServer />,
  },
  {
    title: 'Recommendation Layer',
    text: 'Any Idea assistant uses fallback logic now, future Gemini/OpenAI later.',
    icon: <FiTarget />,
  },
  {
    title: 'Booking Layer',
    text: 'Future-ready model for theatres, showtimes, seats, and confirmation tickets.',
    icon: <FiPlayCircle />,
  },
  {
    title: 'Data Persistence Layer',
    text: 'Client storage now with forward-compatible path to Neon PostgreSQL.',
    icon: <FiDatabase />,
  },
];

const PHASES = [
  {
    name: 'Phase 0 — Project Audit',
    problem: 'Legacy app had mixed styles and uneven architecture visibility.',
    solution: 'Completed full audit of routes, APIs, components, and UI consistency.',
    result: 'Clear baseline and scoped transformation plan.',
    status: 'Completed',
  },
  {
    name: 'Phase 1 — Foundation & UI Consistency',
    problem: 'Visual language was fragmented across pages.',
    solution: 'Standardized design tokens, spacing, components, and motion language.',
    result: 'Unified cinematic emerald interface.',
    status: 'Completed',
  },
  {
    name: 'Phase 2 — Cinematic Homepage',
    problem: 'Homepage needed stronger storytelling and module hierarchy.',
    solution: 'Plan includes hero, trending rails, anime/TV blocks, and discovery cues.',
    result: 'Cinematic home module direction is defined.',
    status: 'Planned',
  },
  {
    name: 'Phase 3 — Discovery System',
    problem: 'Filtering and browsing depth needed to scale.',
    solution: 'Planned richer tabs, filter combinations, and smarter result grouping.',
    result: 'Discovery blueprint ready for implementation.',
    status: 'Planned',
  },
  {
    name: 'Phase 4 — Movie Detail Experience',
    problem: 'Detail pages require richer context and engagement points.',
    solution: 'Planned cast, trailers, related titles, reviews, and ratings modules.',
    result: 'Feature-level detail experience mapped.',
    status: 'Planned',
  },
  {
    name: 'Phase 5 — Booking Flow',
    problem: 'No complete ticket booking journey exists yet.',
    solution: 'Planned multi-step booking with theatre/time/seat selection.',
    result: 'End-to-end demo booking architecture defined.',
    status: 'Future',
  },
  {
    name: 'Phase 6 — User Profile & Activity',
    problem: 'Persistent user identity and activity are limited.',
    solution: 'Planned profiles for favorites, bookings, reviews, and history.',
    result: 'Profile personalization roadmap documented.',
    status: 'Future',
  },
  {
    name: 'Phase 7 — Any Idea Assistant',
    problem: 'Users need suggestion help when they are unsure what to watch.',
    solution: 'Planned prompt-based assistant with mood/context matching and fallbacks.',
    result: 'Recommendation assistant logic model prepared.',
    status: 'In Progress',
  },
  {
    name: 'Phase 8 — Performance & Accessibility',
    problem: 'Need stronger loading, keyboard, and Lighthouse outcomes.',
    solution: 'Planned skeletons, perf tuning, and accessibility hardening.',
    result: 'Quality gate checklist established.',
    status: 'Planned',
  },
  {
    name: 'Phase 9 — Deployment & Portfolio Polish',
    problem: 'Portfolio presentation requires deeper product storytelling.',
    solution: 'Planned architecture showcase, demos, and release-quality docs.',
    result: 'Recruiter/client-ready narrative in progress.',
    status: 'In Progress',
  },
];

const ROADMAP_SECTIONS = [
  {
    title: 'Now',
    items: [
      'Clean cinematic UI',
      'Improved navigation',
      'Working discovery filters',
      'Watchlist/favorites foundation',
      'Any Idea recommendation assistant',
      'How We Built It case-study page',
    ],
  },
  {
    title: 'Next',
    items: [
      'Cinematic homepage',
      'Better movie sections',
      'Improved movie details',
      'Trailer integration',
      'Similar movies',
      'Recently viewed',
    ],
  },
  {
    title: 'Later',
    items: [
      'Booking system',
      'Seat selection',
      'Booking history',
      'User profile',
      'Reviews and ratings',
      'Neon PostgreSQL integration',
    ],
  },
  {
    title: 'Future',
    items: [
      'Gemini/OpenAI recommendations',
      'Streaming availability',
      'Social features',
      'Mobile app',
      'Admin panel',
    ],
  },
];

const DISCOVERY_STEPS = [
  { title: 'User lands on Cinephile', description: 'Starts at a cinematic discovery surface.' },
  { title: 'Browse content rails', description: 'Moves through movies, TV series, and anime.' },
  { title: 'Apply filters', description: 'Refines results by genre, language, year, and priority.' },
  { title: 'Open movie details', description: 'Checks metadata, context, and watch options.' },
  { title: 'Save to watchlist or favorites', description: 'Stores options for later decisions.' },
  { title: 'View related suggestions', description: 'Receives contextual title recommendations.' },
  { title: 'Use Any Idea assistant', description: 'Gets prompt-driven suggestions when uncertain.' },
];

const BOOKING_STEPS = [
  { title: 'Select movie', description: 'Pick the title to watch in theatre.' },
  { title: 'Select date', description: 'Choose preferred day for attendance.' },
  { title: 'Select theatre/screen', description: 'Pick location and screening type.' },
  { title: 'Select showtime', description: 'Choose timing based on availability.' },
  { title: 'Select seats', description: 'Reserve seats with visual seat map.' },
  { title: 'Review booking', description: 'Check seats, time, and total cost summary.' },
  { title: 'Confirm reservation', description: 'Finalize booking and reserve the ticket.' },
  { title: 'Show digital ticket', description: 'Generate booking confirmation ticket view.' },
  { title: 'Save booking history', description: 'Persist entry in profile booking log.' },
];

const ANY_IDEA_PROMPTS = [
  'I want something emotional but not too slow.',
  'Suggest movies like Interstellar.',
  'Anime movies for the weekend.',
  'Thriller under 2 hours.',
  'Something good for a date night.',
  'Something dark and suspenseful.',
];

const ANY_IDEA_LOGIC = [
  {
    title: 'Input Understanding',
    text: 'Reads user mood, genre, situation, runtime, and context from natural prompts.',
  },
  {
    title: 'Recommendation Matching',
    text: 'Maps prompts to tags, genres, runtime windows, and similar-title heuristics.',
  },
  {
    title: 'Fallback Engine',
    text: 'Works without AI API by using local rule sets and available catalog metadata.',
  },
  {
    title: 'Future AI Layer',
    text: 'Can connect to Gemini/OpenAI for stronger semantic recommendation quality.',
  },
  {
    title: 'Result Explanation',
    text: 'Each suggestion includes why it matches the submitted idea.',
  },
];

const DATABASE_TABLES = [
  'users',
  'movies',
  'favorites',
  'watchlists',
  'bookings',
  'booking_seats',
  'reviews',
  'ratings',
  'recently_viewed',
  'recommendation_history',
];

const DEPLOYMENT_CARDS = [
  {
    title: 'Frontend Hosting',
    text: 'Vercel deployment with SPA routing and optimized static output.',
    icon: <FiTrendingUp />,
  },
  {
    title: 'Environment Variables',
    text: 'API keys and runtime configuration are managed in deployment settings.',
    icon: <FiTarget />,
  },
  {
    title: 'Build Process',
    text: 'React production build with minification and bundle optimization.',
    icon: <FiPackage />,
  },
  {
    title: 'Future Improvements',
    text: 'Backend runtime, database env, observability, and CI/CD hardening.',
    icon: <FiGitBranch />,
  },
];

const TECH_STACK = [
  {
    name: 'React',
    purpose: 'Frontend UI and page rendering',
    note: 'Component-driven rendering across all product modules.',
    status: 'Current',
  },
  {
    name: 'Redux',
    purpose: 'State management',
    note: 'Centralized handling of content data and UI interactions.',
    status: 'Current',
  },
  {
    name: 'SCSS',
    purpose: 'Design system styling',
    note: 'Token-based cinematic theme with reusable spacing/typography.',
    status: 'Current',
  },
  {
    name: 'JavaScript',
    purpose: 'Application logic',
    note: 'Feature logic, transformations, and interaction behavior.',
    status: 'Current',
  },
  {
    name: 'OMDB API / Movie Catalog API',
    purpose: 'Movie metadata source',
    note: 'Core data source for discovery and detail experiences.',
    status: 'Current',
  },
  {
    name: 'Framer Motion',
    purpose: 'Animations and transitions',
    note: 'Page transitions, micro interactions, and section reveals.',
    status: 'Current',
  },
  {
    name: 'Vercel',
    purpose: 'Frontend deployment',
    note: 'Fast static hosting with route rewrite support.',
    status: 'Current',
  },
  {
    name: 'Neon PostgreSQL',
    purpose: 'Persistent app database',
    note: 'Planned persistence for watchlists, bookings, and user data.',
    status: 'Future',
  },
  {
    name: 'Gemini/OpenAI',
    purpose: 'Advanced recommendation intelligence',
    note: 'Planned semantic reasoning for Any Idea assistant.',
    status: 'Future',
  },
  {
    name: 'GitHub',
    purpose: 'Version control and collaboration',
    note: 'Source control, review flow, and deployment traceability.',
    status: 'Current',
  },
];

const FUTURE_GROUPS = [
  {
    title: 'Product',
    items: ['Authentication', 'User profile', 'Social watchlists', 'Mobile app'],
  },
  {
    title: 'Engineering',
    items: ['Booking backend', 'Seat availability logic', 'Admin panel', 'Analytics'],
  },
  {
    title: 'AI',
    items: ['Recommendation personalization', 'Prompt memory', 'Ranking feedback loop'],
  },
  {
    title: 'User Experience',
    items: ['Real payment simulation', 'Movie review system', 'Streaming availability'],
  },
];

const HowWeBuiltIt = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const tabContent = useMemo(() => {
    if (activeTab === 'overview') {
      return (
        <div className="how-built-grid">
          <CaseStudyCard
            title="Platform Overview"
            subtitle="Cinephile is a movie discovery and booking platform."
            icon={<FiActivity />}
          >
            <p>
              Cinephile helps users explore movies, TV series, anime, save favorites, build
              watchlists, view details, and receive recommendations through the Any Idea assistant.
            </p>
          </CaseStudyCard>

          <section className="how-built-metrics surface-card">
            {OVERVIEW_METRICS.map((metric) => (
              <article key={metric.label}>
                <h4>{metric.label}</h4>
                <p>{metric.value}</p>
              </article>
            ))}
          </section>

          <CaseStudyCard title="Demo Notice" icon={<FiBookOpen />}>
            <p>
              This project is under active development. Some movie, booking, and recommendation
              data may be simulated for demonstration purposes.
            </p>
          </CaseStudyCard>
        </div>
      );
    }

    if (activeTab === 'architecture') {
      return (
        <div className="how-built-grid how-built-grid--cards">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <CaseStudyCard
              key={layer.title}
              title={layer.title}
              icon={layer.icon}
            >
              <p>{layer.text}</p>
            </CaseStudyCard>
          ))}
        </div>
      );
    }

    if (activeTab === 'phase-tracker') {
      return (
        <div className="how-built-grid how-built-grid--cards">
          {PHASES.map((phase) => (
            <PhaseCard key={phase.name} phase={phase} />
          ))}
        </div>
      );
    }

    if (activeTab === 'roadmap') {
      return (
        <div className="how-built-grid how-built-grid--cards">
          {ROADMAP_SECTIONS.map((section) => (
            <RoadmapCard key={section.title} section={section} />
          ))}
        </div>
      );
    }

    if (activeTab === 'discovery-workflow') {
      return (
        <div className="workflow-grid">
          {DISCOVERY_STEPS.map((step, index) => (
            <WorkflowStep key={step.title} step={step} index={index} />
          ))}
        </div>
      );
    }

    if (activeTab === 'booking-flow') {
      return (
        <div className="how-built-grid">
          <div className="workflow-grid">
            {BOOKING_STEPS.map((step, index) => (
              <WorkflowStep key={step.title} step={step} index={index} />
            ))}
          </div>
          <CaseStudyCard title="Booking Data Notice" icon={<FiPlayCircle />}>
            <p>
              Booking is planned as a demo product flow and may use simulated showtime/payment
              data until backend integration is added.
            </p>
          </CaseStudyCard>
        </div>
      );
    }

    if (activeTab === 'any-idea-logic') {
      return (
        <div className="how-built-grid">
          <CaseStudyCard title="Any Idea Assistant Purpose" icon={<FiTarget />}>
            <p>
              Any Idea is a movie suggestion assistant. Users describe what they feel like
              watching and Cinephile proposes titles that fit the context.
            </p>
          </CaseStudyCard>

          <CaseStudyCard title="Example Prompts" icon={<FiActivity />}>
            <ul className="prompt-list">
              {ANY_IDEA_PROMPTS.map((prompt) => (
                <li key={prompt} className="badge">{prompt}</li>
              ))}
            </ul>
          </CaseStudyCard>

          <div className="how-built-grid how-built-grid--cards">
            {ANY_IDEA_LOGIC.map((item) => (
              <CaseStudyCard key={item.title} title={item.title}>
                <p>{item.text}</p>
              </CaseStudyCard>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'database') {
      return (
        <div className="how-built-grid">
          <CaseStudyCard title="Current State" icon={<FiDatabase />}>
            <p>
              Client-side state and movie API/catalog data currently power demo functionality.
            </p>
          </CaseStudyCard>
          <CaseStudyCard title="Future Database" icon={<FiServer />}>
            <p>Neon PostgreSQL is planned for persistent user and product data.</p>
            <div className="table-chip-grid">
              {DATABASE_TABLES.map((table) => (
                <span key={table} className="badge">{table}</span>
              ))}
            </div>
          </CaseStudyCard>
          <CaseStudyCard title="Migration Note" icon={<FiGitBranch />}>
            <p>
              Favorites, watchlists, bookings, profiles, and reviews should move from client-side
              storage to database-backed persistence.
            </p>
          </CaseStudyCard>
        </div>
      );
    }

    if (activeTab === 'deployment') {
      return (
        <div className="how-built-grid how-built-grid--cards">
          {DEPLOYMENT_CARDS.map((card) => (
            <CaseStudyCard key={card.title} title={card.title} icon={card.icon}>
              <p>{card.text}</p>
            </CaseStudyCard>
          ))}
        </div>
      );
    }

    if (activeTab === 'tech-stack') {
      return (
        <div className="how-built-grid how-built-grid--cards">
          {TECH_STACK.map((item) => (
            <TechStackCard key={item.name} item={item} />
          ))}
        </div>
      );
    }

    return (
      <div className="how-built-grid how-built-grid--cards">
        {FUTURE_GROUPS.map((group) => (
          <CaseStudyCard key={group.title} title={group.title} icon={<FiMap />}>
            <ul className="roadmap-card__list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CaseStudyCard>
        ))}
      </div>
    );
  }, [activeTab]);

  return (
    <PageTransition className="how-built-page page-shell">
      <div className="how-built-page__container">
        <section className="how-built-hero surface-card">
          <span className="how-built-hero__label">HOW WE BUILT IT</span>
          <h1 className="page-title">How We Built Cinephile</h1>
          <p className="page-subtitle">
            Walk through how Cinephile evolved from a simple movie search app into a cinematic
            movie discovery, watchlist, booking, and AI recommendation platform.
          </p>
        </section>

        <CaseStudyTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <section className="how-built-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {tabContent}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </PageTransition>
  );
};

export default HowWeBuiltIt;
