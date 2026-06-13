# Deployment Guide

## 1. Current Hosting

**Platform:** Vercel  
**Live URL:** https://mycinephilewebsite.vercel.app/

---

## 2. Build Command

```bash
npm run build
```

---

## 3. Output Directory

```text
build
```

---

## 4. Environment Variables

Use `.env.example` as the reference for required/future variables:

- `REACT_APP_OMDB_API_KEY`
- `REACT_APP_TMDB_API_KEY`
- `REACT_APP_TRAKT_API_KEY`
- `REACT_APP_GEMINI_API_KEY` (future placeholder)
- `REACT_APP_OPENAI_API_KEY` (future placeholder)

Do not commit real secrets.

---

## 5. Vercel Configuration

The project uses `vercel.json` with:

- `buildCommand: npm run build`
- `outputDirectory: build`
- SPA rewrite support

---

## 6. SPA Routing

Vercel rewrites route all requests to `index.html` so React Router paths work on refresh/direct access.

Example rule (already configured):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 7. Deployment Steps

1. Push updates to GitHub `main` branch.
2. Vercel automatically starts a new build/deploy.
3. After deployment, verify major routes and product flows.

---

## 8. Manual Verification Routes

- `/`
- `/search`
- `/collection`
- `/any-idea`
- `/how-we-built-it`
- `/movie/:id`
- `/person/:personId`
- `/booking/:movieId`
- `/booking-confirmation/:bookingId`
- `/bookings`
- `/profile`
- `/cinephile-ai`

---

## 9. Demo Limitations

- Booking is demo-only.
- No real payment is processed.
- AI API integration is planned for future phases.
- LocalStorage data is browser-specific and not shared across devices/users.
