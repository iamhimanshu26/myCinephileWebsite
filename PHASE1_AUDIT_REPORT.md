# Phase 1 Internal Audit Report — Cinephile

## 1) Current folder structure

- `src/App.js`, `src/index.js` (entry and routing shell)
- `src/pages/` (`Home`, `Search`, `Details`, `Person`, `Collection`)
- `src/components/` (`header`, `footer`, `movieCard`, `contentSection`, `movieList`)
- `src/redux/` (`moviesSlice`, `tmdbSlice`, `collectionSlice`, `store`)
- `src/api/` (OMDb, TMDb, Trakt, TVMaze, AniList clients)
- `src/utils/` (`contentFilter`)
- `src/sass/` (`_variables`, `_mixin`, `_breakpoint`, `_index`)
- `src/constants/filters.js` (genre/country filters)

## 2) Current architecture

- React SPA with client-side routing (`react-router-dom`).
- Global state in Redux Toolkit slices.
- Async data flows through `createAsyncThunk` and Axios.
- No backend service in repository; API calls happen directly from browser.
- Persistent user data is localStorage only (`cinephile_collection`).

## 3) Component hierarchy

- App shell: `Header` + route page + `Footer`.
- Home composed of filters, top grid, sidebar, and reusable `ContentSection`.
- `MovieCard` reused across Home/Search/Collection and list sections.
- Detail and Person pages are feature-specific pages with direct Redux selectors.

## 4) Redux/store analysis

- `moviesSlice`: broad slice handling search, recents, trending, anime, and selected detail.
- `tmdbSlice`: TMDb-specific enrichment (find, credits, person, providers).
- `collectionSlice`: normalized saved items + localStorage persistence.
- Strength: all side effects centralized in thunks.
- Debt: inconsistent UI status modeling (no uniform loading/error surface by section).

## 5) Routing structure

- `/`, `/search`, `/collection`, `/movie/:id`, `/person/:personId`.
- Route definitions are straightforward and clean.
- Deep-link support configured by SPA rewrite in `vercel.json`.

## 6) API integration analysis

- OMDb: primary search + details.
- TMDb (optional key): recents discovery, person, credits, provider enrichment.
- Trakt (optional key): trending movies and shows.
- TVMaze: airing today list.
- AniList GraphQL: trending anime.
- Data shape normalization exists but is scattered across thunks.

## 7) Existing reusable components

- `MovieCard` (core reusable visual card).
- `ContentSection` (section + carousel wrapper).
- Header and Footer used globally.
- Gap identified: no reusable loading/empty/error state components.

## 8) Existing design patterns

- BEM-like class naming used in many styles.
- Shared SASS variables/mixins exist but not comprehensive.
- Multiple isolated page styles define local scales/spacing/color values.

## 9) Existing animations

- Framer Motion on Home and cards.
- CSS keyframe animations in some pages/components.
- Duration/easing values vary across files (no unified animation language).

## 10) Existing utility functions

- `contentFilter` with keyword/rating filtering.
- collection normalization in `collectionSlice`.
- missing cross-cutting UI utilities for status rendering and skeletons.

## 11) Existing hooks

- React hooks (`useEffect`, `useMemo`, `useState`) used correctly in pages/components.
- No custom hooks currently implemented.

## 12) Existing styles

- SASS-based styling across pages/components.
- Hardcoded values and inconsistent token usage are widespread.
- Icon styling depends on mixed external libraries and class-based icon CSS.

## 13) Existing pages

- Home, Search, Details, Person, Collection are implemented and functioning.

## 14) Existing technical debt

- Mixed icon systems (Font Awesome classes + Boxicons + `react-icons`).
- Duplicate styling patterns for cards, buttons, spacing, and page headers.
- Unused/legacy component path (`MovieList`) not wired into app route shell.
- Dead/partial dark theme styles in `home.scss` with no runtime toggle usage.

## 15) Existing UI inconsistencies

- Typography scale differs by page/component.
- Buttons and input controls use different radius, paddings, and hover behavior.
- Surface/background colors and text contrast differ across pages.
- Loading/empty/error states are inconsistent in tone and layout.

## 16) Existing responsiveness issues

- Several fixed width card layouts can become cramped on narrow widths.
- Header and page spacing vary by viewport and are not tokenized.
- Some pages rely on absolute positioning patterns that can be fragile.

## 17) Existing performance bottlenecks

- Repeated inline style and transition values reduce maintainability.
- Lack of skeleton placeholders creates abrupt content shifts.
- Legacy/unused visual assets remain imported or referenced.

## 18) Phase 1 implementation direction (approved scope)

1. Introduce centralized design tokens (color, typography, spacing, radius, shadow, motion).
2. Standardize page shell, containers, and global accessibility/focus states.
3. Unify iconography to one library (`react-icons`) across current pages/components.
4. Add reusable loading/empty/error UI state components and skeleton placeholders.
5. Refactor existing pages/components only (no duplicate routes/pages/APIs).
6. Improve responsive behavior and alignment while preserving current features.
