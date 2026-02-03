# CinePhile – Git & Vercel Deployment

## 1. Create a new repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. Set **Repository name** (e.g. `CinePhile` or `cinephile`).
3. Choose **Public**, leave "Add a README" **unchecked** (you already have one).
4. Click **Create repository**.

## 2. Push this project to your new repo

In a terminal, from the project folder (`C:\Users\LENOVO\OneDrive\Desktop\My_Projects\CineVerse-main`), run (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Example:

```bash
git remote add origin https://github.com/johndoe/CinePhile.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Vercel (new deployment)

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** the GitHub repo you just created (e.g. `CinePhile`).
4. Vercel will detect the React app. Settings should be:
   - **Framework Preset:** Create React App  
   - **Build Command:** `npm run build` (or use `vercel.json`)  
   - **Output Directory:** `build`  
   (These are already set in `vercel.json`.)
5. Click **Deploy**.  
   After the build finishes, you’ll get a live URL (e.g. `https://cinephile-xxx.vercel.app`).

Later: every push to `main` will trigger a new deployment automatically.

## Optional: API key (movie data)

If the app uses an API key (e.g. in `src/api/movieApiKey.js`), add it in Vercel:

1. Project → **Settings** → **Environment Variables**.
2. Add the variable name and value (e.g. `REACT_APP_OMDB_API_KEY`).
3. Redeploy so the new env is applied.
