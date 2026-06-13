# Cinephile

**AI-powered movie discovery, booking, watchlist, and recommendation platform.**

---

## 1) Project Overview

Cinephile is a product-style frontend platform for discovering movies, series, and anime with a polished cinematic UI.  
It combines discovery, personalization, booking simulation, review tracking, profile insights, and AI-style recommendation flows in one cohesive experience.

---

## 2) Why I Built This

I built Cinephile to move beyond a basic "search movies" app and design a full user journey:

- Discover content through curated sections
- Save and organize titles
- Explore rich detail pages
- Simulate booking with seat selection and digital confirmation
- Add ratings/reviews and profile activity
- Get AI-style recommendations and watch plans

The goal was to demonstrate product thinking, architecture discipline, and scalable frontend engineering decisions suitable for portfolio, recruiter, and interview review.

---

## 3) Live Demo

- **Vercel:** https://cinephile.vercel.app  
  _(If your production URL differs, update this link to your project-specific Vercel domain.)_

---

## 4) Key Features

- Cinematic homepage with hero and discovery rails
- Movie / TV / Anime discovery tabs
- Search and filter workflows
- Movie details with metadata, similar titles, and actions
- Watchlist and favorites
- Recently viewed shelf
- Booking flow (date, theatre, screen, showtime, seats)
- Seat selection map
- Digital ticket confirmation
- Booking history with status updates
- Reviews and ratings
- Profile insights and activity timeline
- Cinephile AI recommendations and watch planner
- Any Idea development tracker (internal backlog)
- How We Built It case-study page

---

## 5) Tech Stack

- **React** (SPA UI architecture)
- **Redux Toolkit** (application state)
- **SCSS** (token-based styling and theme consistency)
- **Framer Motion** (lightweight transitions and motion)
- **OMDb + multi-source catalog integrations**
- **LocalStorage services** (booking/review/activity/recently-viewed/ideas)
- **Vercel** (deployment)
- **Future AI:** OpenAI / Gemini integration
- **Future database:** Neon PostgreSQL

---

## 6) Architecture Overview

### Page Layer
Route-level pages (`Home`, `Search`, `Details`, `Profile`, `CinephileAI`, `AnyIdea`, booking routes, etc.).

### Component Layer
Reusable UI modules for cards, states, sections, booking widgets, profile widgets, and case-study tabs/cards.

### Service Layer
Dedicated local services for domain behavior and persistence:

- `ideaService`
- `recentlyViewedService`
- `bookingService`
- `reviewService`
- `activityService`
- `recommendationService`
- `personalizationService`

### Utility Layer
Normalization, filtering, recommendation scoring, seat-map generation, and discovery section strategy utilities.

### Persistence Layer (Current)
Client-side localStorage persistence through service abstractions.

### Future Backend Layer
Neon PostgreSQL-backed persistence and API services.

### Future AI Integration Layer
External OpenAI/Gemini providers for semantic recommendation intelligence.

---

## 7) Project Phases

- **Phase 1:** Foundation & design system
- **Phase 2:** Cinematic homepage & discovery
- **Phase 3:** Movie details, reviews, booking flow
- **Phase 4:** Cinephile AI & personalization
- **Phase 5:** Final polish, accessibility, performance, documentation, portfolio readiness

---

## 8) Feature Walkthrough

1. **Discovery Flow**  
   Home -> browse curated rails -> open details -> save to watchlist/favorites.

2. **Search Flow**  
   Search from header -> refine -> open details.

3. **Booking Flow (Demo)**  
   Details -> book ticket -> choose date/theatre/showtime/seats -> confirm reservation -> view digital ticket -> see booking history.

4. **Review + Profile Flow**  
   Add rating/review on details page -> review appears in profile activity and contributes to personalization signals.

5. **Cinephile AI Flow**  
   Use prompt chips or custom text -> get recommendation cards -> open details -> save/book directly.

6. **Any Idea Flow**  
   Capture product ideas -> filter/sort by status/priority/category -> edit/delete as roadmap evolves.

---

## 9) Demo Limitations

- Booking is simulated (demo flow).
- Payments are not real.
- AI recommendations currently use fallback/local logic.
- OpenAI/Gemini integration is planned for a future phase.
- Database migration (Neon PostgreSQL) is planned for a future phase.

---

## 10) Future Improvements

- Authentication and user accounts
- Neon PostgreSQL integration and backend APIs
- Real AI provider integration (OpenAI/Gemini)
- Streaming availability integrations
- Rich social features (sharing, follow, lists)
- Admin/ops panel for moderation and analytics
- Dedicated mobile application

---

## 11) Local Setup

```bash
npm install
npm start
npm run build
```

---

## 12) Environment Variables

Use a `.env` file with placeholders only:

```env
REACT_APP_OMDB_API_KEY=your_omdb_key
REACT_APP_TMDB_API_KEY=your_tmdb_key
REACT_APP_TRAKT_CLIENT_ID=your_trakt_client_id
REACT_APP_TRAKT_CLIENT_SECRET=your_trakt_client_secret
REACT_APP_GEMINI_API_KEY=your_gemini_key
REACT_APP_OPENAI_API_KEY=your_openai_key
```

Do not commit real secrets.

---

## 13) Screenshots

_Add screenshots in this section when assets are ready:_

- Home discovery view
- Details page
- Booking flow seat map
- Booking confirmation ticket
- Profile insights
- Cinephile AI recommendations
- How We Built It case-study tab view

---

## 14) Author

- **Cinephile Maintainer**  
- GitHub: `@your-github-handle`
