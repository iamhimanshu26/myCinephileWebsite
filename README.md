# Cinephile

**AI-powered movie discovery, booking, watchlist, and recommendation platform.**

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-State%20Management-764ABC?logo=redux)
![SCSS](https://img.shields.io/badge/SCSS-Styling-CC6699?logo=sass)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animation-black)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)
![OMDB/TMDB API](https://img.shields.io/badge/OMDB%2FTMDB-Data%20Sources-0F766E)
![LocalStorage Demo](https://img.shields.io/badge/Persistence-LocalStorage%20Demo-4B5563)
![Future OpenAI/Gemini](https://img.shields.io/badge/Future-AI%20OpenAI%2FGemini-7C3AED)
![Future Neon PostgreSQL](https://img.shields.io/badge/Future-Neon%20PostgreSQL-10B981)

---

## 1. Project Overview

Cinephile is a cinematic movie discovery and booking platform where users can explore movies, TV series, and anime, view detailed title information, save favorites, manage watchlists, book demo movie tickets, write reviews, view profile insights, and get AI-style recommendations through **Cinephile AI**.

The goal is not just a movie website, but a polished product-style platform for discovering, saving, booking, reviewing, and planning what to watch.

---

## 2. Live Demo

**Live Demo:**  
https://mycinephilewebsite.vercel.app/

---

## 3. Why I Built This

I wanted to move beyond a basic movie search website and build a complete entertainment platform that demonstrates:

- Frontend architecture
- UI/UX design system
- Movie discovery flow
- Booking flow
- Local persistence
- AI-ready recommendation design
- Personalization
- Portfolio case-study presentation
- Real product thinking

---

## 4. Key Features

- Cinematic homepage
- Movie / TV / Anime discovery
- Trending, popular, top-rated, and curated sections
- Search and filters
- Professional movie detail pages
- Poster fallback and image handling
- Watchlist and favorites
- Recently viewed
- Reviews and ratings
- Booking flow
- Showtime selection
- Seat selection
- Demo reservation confirmation
- Digital ticket
- Booking history
- Profile insights
- Activity timeline
- Recommended For You
- Cinephile AI recommendations
- Watch planner
- Any Idea development tracker
- How We Built It case-study page
- Responsive UI
- Lighter sage/emerald cinematic design system

---

## 5. Feature Walkthrough

1. Discover content from homepage.
2. Search and filter movies.
3. Open movie details.
4. Save to watchlist/favorites.
5. Add review/rating.
6. Book demo ticket.
7. Select seats.
8. View digital ticket.
9. Check booking history.
10. Use Cinephile AI for recommendations.
11. Save development ideas in Any Idea.
12. Review project evolution in How We Built It.

---

## 6. Tech Stack

### Frontend
- React
- Redux Toolkit
- JavaScript
- SCSS
- Framer Motion

### APIs / Data
- OMDB API
- TMDB-style movie metadata where applicable
- Local catalog/fallback data

### Persistence
- LocalStorage services for demo persistence

### Deployment
- Vercel

### Future
- OpenAI / Gemini for advanced recommendations
- Neon PostgreSQL for database-backed persistence
- Backend API for production booking/profile/review data

---

## 7. Architecture Overview

The application follows a layered frontend architecture:

- **Page layer**: Route-level pages and product workflows.
- **Component layer**: Reusable UI sections, cards, state blocks, booking widgets, and case-study modules.
- **Service layer**: Isolated domain logic and persistence APIs.
- **Utility layer**: Shared helpers for filtering, media normalization, recommendation logic, and booking/seat computations.
- **Redux/state layer**: Centralized app state for movie/catalog and collection interactions.
- **LocalStorage persistence layer**: Demo persistence for user activity and product flows.
- **Movie API/data layer**: API integrations and fallback mapping.
- **Recommendation layer**: Prompt parsing and recommendation strategy.
- **Personalization layer**: Taste signal extraction and profile insights.
- **Future database layer**: Planned Neon PostgreSQL integration.
- **Future AI integration layer**: Planned OpenAI/Gemini recommendation adapters.

Important services used in the project include:

- `bookingService`
- `reviewService`
- `recentlyViewedService`
- `ideaService`
- `recommendationService`
- `activityService`

---

## 8. Project Phases

### Phase 1 — Foundation & Design System
- UI consistency
- Typography
- Spacing
- Header
- Theme
- Reusable components

### Phase 2 — Cinematic Homepage & Discovery
- Hero section
- Discovery sections
- Movie / TV / Anime browsing
- Poster fallback
- Recently viewed
- Lighter sage/emerald theme

### Phase 3 — Movie Details, Reviews & Booking
- Professional movie details
- Metadata layout
- Reviews/ratings
- Similar movies
- Booking flow
- Seat selection
- Digital ticket
- Booking history

### Phase 4 — Cinephile AI & Personalization
- Cinephile AI page
- Prompt-based recommendations
- Watch planner
- Recommended For You
- Profile insights
- Future OpenAI/Gemini support

### Phase 5 — Final Polish & Portfolio Readiness
- Documentation
- SEO/meta
- Accessibility
- Responsive polish
- Build verification
- Portfolio-ready README

---

## 9. Demo Limitations

- Booking is a demo/simulated reservation flow.
- No real payment is processed.
- Some movie data depends on third-party APIs.
- Some poster/fallback data may be curated for presentation quality.
- Cinephile AI currently uses fallback/local recommendation logic.
- OpenAI/Gemini integration is planned for future.
- User data is stored locally for demo purposes.
- Production database integration is planned for future.

---

## 10. Future Roadmap

- Authentication
- Neon PostgreSQL
- Backend API
- Real AI API integration with OpenAI/Gemini
- Better recommendation ranking
- Streaming availability
- Real booking backend
- Payment simulation layer
- Multi-user profiles
- Social features
- Admin panel
- Mobile app
- Performance analytics

---

## 11. Local Setup

```bash
npm install
npm start
npm run build
```

Create a `.env` file using `.env.example`.  
Do not commit real API keys.

---

## 12. Environment Variables

```env
REACT_APP_OMDB_API_KEY=
REACT_APP_TMDB_API_KEY=
REACT_APP_TRAKT_API_KEY=
REACT_APP_GEMINI_API_KEY=
REACT_APP_OPENAI_API_KEY=
```

`REACT_APP_GEMINI_API_KEY` and `REACT_APP_OPENAI_API_KEY` are future placeholders only and should never be committed with real secrets.

---

## 13. Screenshots

_Add/update screenshots here as the presentation deck evolves._

- Homepage
- Movie details
- Booking flow
- Cinephile AI
- Profile
- How We Built It

---

## 14. Author

**Himanshu Kumar Sharma**

GitHub:  
https://github.com/iamhimanshu26

Project:  
Cinephile
