import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiActivity,
  FiBookOpen,
  FiClock,
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
  FiUsers,
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
  { label: 'Product Type', value: 'Movie Discovery, AI Recommendation & Booking Platform' },
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
    text: 'Home, Search, Collection, Details, Person, Cinephile AI, Any Idea, and How We Built It.',
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
    title: 'Development Idea Tracking Layer',
    text: 'Any Idea stores, filters, sorts, edits, and manages internal product ideas with localStorage now and future database persistence later.',
    icon: <FiTarget />,
  },
  {
    title: 'AI Recommendation Layer',
    text: 'Responsible for prompt interpretation, mood-based suggestions, watch planning, and future Gemini/OpenAI integration.',
    icon: <FiActivity />,
  },
  {
    title: 'Personalization Layer',
    text: 'Responsible for deriving taste signals from recently viewed, favorites, watchlist, reviews, and bookings.',
    icon: <FiUsers />,
  },
  {
    title: 'Activity Layer',
    text: 'Responsible for recent actions, watchlist/favorite updates, booking events, review updates, and profile timeline output.',
    icon: <FiClock />,
  },
  {
    title: 'Booking Layer',
    text: 'Demo booking flow for theatres, showtimes, seats, and digital ticket confirmation.',
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
    solution: 'Implemented cinematic hero, lighter sage/emerald theme pass, discovery sections backed by a configurable discovery strategy, Movie/TV/Anime browsing tabs, poster fallback quality upgrades, and recently viewed integration.',
    result: 'Homepage now delivers curated discovery flows with stronger media quality, cleaner card alignment, and resilient poster loading behavior.',
    status: 'Completed',
  },
  {
    name: 'Phase 3 — Movie Detail Experience',
    problem: 'Detail pages needed richer storytelling, metadata, and actionable user flow.',
    solution: 'Implemented cinematic detail hero, metadata redesign, favorites/watchlist actions, user rating/review persistence, similar movies modules, and recently viewed card-size stability fixes.',
    result: 'Movie detail route now supports a stronger end-to-end engagement journey with compact and consistent discovery cards.',
    status: 'Completed',
  },
  {
    name: 'Phase 4 — AI Recommendations & Personalization',
    problem: 'Users needed intelligent, prompt-driven suggestions and stronger personalized discovery.',
    solution: 'Implemented Cinephile AI route with prompt chips, fallback recommendation engine, mood/situation intent parsing, watch planner, and personalized recommendation flows.',
    result: 'Cinephile now offers an AI-style recommendation journey while preserving existing discovery and booking experiences.',
    status: 'Completed',
  },
  {
    name: 'Phase 5 — Booking Flow',
    problem: 'Users needed a complete booking journey from details page to reservation confirmation.',
    solution: 'Implemented multi-step booking flow with date/theatre/screen/showtime selection, seat map interaction, booking summary, demo reservation confirmation, digital ticket, and booking history.',
    result: 'Booking now works as a realistic demo flow with local persistence and status updates.',
    status: 'Completed',
  },
  {
    name: 'Phase 6 — User Profile & Activity',
    problem: 'Profile needed richer insight and social-style engagement cues.',
    solution: 'Added personalization insights, taste summary, review activity cards, and enhanced timeline presentation.',
    result: 'Profile now communicates user taste and activity progression more clearly.',
    status: 'In Progress',
  },
  {
    name: 'Phase 7 — Cinephile AI Recommendation Layer',
    problem: 'Recommendation quality felt generic without prompt understanding and mood context.',
    solution: 'Built a separate Cinephile AI route with prompt-based recommendations, mood-based discovery, quick chips, fallback recommendation engine, personalized suggestions, and watch-planning support.',
    result: 'Cinephile AI now delivers recommendation experiences while Any Idea remains a development idea tracker, ready for future Gemini/OpenAI integration.',
    status: 'Completed',
  },
  {
    name: 'Phase 8 — Any Idea Development Tracker',
    problem: 'Strong product and UI improvement ideas appear during development and get lost.',
    solution: 'Created a development-focused idea tracker to save unplanned product improvements, UI ideas, technical enhancements, and future feature suggestions during the project lifecycle.',
    result: 'Lightweight internal backlog is available inside Cinephile for structured follow-up.',
    status: 'Completed',
  },
  {
    name: 'Phase 9 — Performance & Accessibility',
    problem: 'Need stronger loading, keyboard, and Lighthouse outcomes.',
    solution: 'Planned skeletons, perf tuning, and accessibility hardening.',
    result: 'Quality gate checklist established.',
    status: 'Planned',
  },
  {
    name: 'Phase 10 — Deployment & Portfolio Polish',
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
      'Any Idea development backlog',
      'Poster fallback and image quality improvements',
      'Cinematic movie detail redesign with reviews/similar titles',
      'Booking flow foundation with digital ticket confirmation',
      'Booking history with cancellation status updates',
      'Recently viewed discovery rails now use compact clamped card widths',
      'Cinephile AI prompt-based recommendation page',
      'Fallback AI-ready recommendation service',
      'Personalized Recommended For You section on Home',
      'Profile taste insights and social-style review activity',
      'How We Built It case-study page',
    ],
  },
  {
    title: 'Next',
    items: [
      'Trailer integration',
      'Cross-provider metadata enrichment',
      'Smarter similar-title ranking',
      'Server-side recommendation adapters',
    ],
  },
  {
    title: 'Later',
    items: [
      'Booking history enhancements',
      'Profile-level preferences and personalization',
      'Review moderation and quality prompts',
      'Neon PostgreSQL integration',
    ],
  },
  {
    title: 'Future',
    items: [
      'Gemini/OpenAI recommendation module',
      'Advanced personalization engine',
      'Streaming availability',
      'Smarter recommendation ranking',
      'Social recommendation sharing',
      'Multi-user profiles',
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
  { title: 'Capture product improvements in Any Idea', description: 'Saves UI, UX, and technical ideas for later planning and execution.' },
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

const ANY_IDEA_EXAMPLES = [
  'Improve movie card hover interaction',
  'Add trailer preview modal',
  'Add better empty states',
  'Add booking cancellation flow',
  'Add user profile statistics',
  'Add recently viewed section',
  'Add database-backed watchlist later',
  'Add animation improvements',
  'Add accessibility improvements',
  'Add portfolio presentation improvements',
];

const ANY_IDEA_LOGIC = [
  {
    title: 'Idea Capture',
    text: 'Allows adding new feature ideas, UI improvements, technical tasks, or future product enhancements.',
  },
  {
    title: 'Categorization',
    text: 'Each idea is grouped by category such as UI/UX, Movie Discovery, Booking Flow, AI Features, Database, Performance, Accessibility, Documentation, or Other.',
  },
  {
    title: 'Prioritization',
    text: 'Each idea can be marked as Low, Medium, High, or Critical priority.',
  },
  {
    title: 'Status Tracking',
    text: 'Each idea can move through statuses such as Saved, Under Review, Planned, In Progress, Completed, or Deferred.',
  },
  {
    title: 'Local Persistence',
    text: 'Ideas are stored locally for now using localStorage through ideaService.',
  },
  {
    title: 'Future Database Upgrade',
    text: 'The current structure supports future migration to Neon PostgreSQL or another database.',
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
    name: 'Recommendation Service',
    purpose: 'Prompt parsing and recommendation orchestration',
    note: 'Handles mood/similarity/weekend/personalized and fallback recommendation strategies.',
    status: 'Current',
  },
  {
    name: 'LocalStorage Personalization',
    purpose: 'Taste-signal extraction',
    note: 'Derives profile insights from recently viewed, watchlist, favorites, reviews, and bookings.',
    status: 'Current',
  },
  {
    name: 'Activity Service',
    purpose: 'Timeline and engagement feed',
    note: 'Stores lightweight local activity events for profile timeline and engagement context.',
    status: 'Current',
  },
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
    note: 'Page transitions, AI-page reveal states, and premium section-level micro interactions.',
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
    note: 'Planned semantic reasoning for a future recommendation module, separate from Any Idea.',
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
              watchlists, view details, and capture future improvements through the Any Idea
              development tracker.
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
              This project is under active development. Some movie and booking data may be
              simulated for demonstration purposes.
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
          <CaseStudyCard title="Any Idea Purpose" icon={<FiTarget />}>
            <p>
              Any Idea is a development-focused idea capture space where new product ideas, UI
              improvements, technical enhancements, future features, and unplanned development
              thoughts can be saved for later review.
            </p>
            <p>
              It works like a lightweight product backlog during the project lifecycle, so strong
              ideas are captured without interrupting current implementation priorities.
            </p>
          </CaseStudyCard>

          <CaseStudyCard title="Example Ideas" icon={<FiActivity />}>
            <ul className="prompt-list">
              {ANY_IDEA_EXAMPLES.map((idea) => (
                <li key={idea} className="badge">{idea}</li>
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
            movie discovery, watchlist, booking, and scalable product platform.
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
