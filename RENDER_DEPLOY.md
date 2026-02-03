# Deploying to Render.com

## 1. Create a Web Service

- Connect your GitHub repo: `mirnabadr/MERN-ThinkFlow-Notes-`
- **Type:** Web Service
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Root Directory:** leave blank (use repo root)

## 2. Environment Variables

In Render dashboard: **Environment** → **Add Environment Variable**.

Add these **exact** names and your real values (no spaces after `=`):

| Key | Value | Notes |
|-----|--------|--------|
| `MONGO_URI` | `mongodb+srv://...` | Your full MongoDB Atlas connection string (no space after `=`) |
| `UPSTASH_REDIS_REST_URL` | `https://...` | From Upstash Redis dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | `...` | From Upstash Redis dashboard |
| `NODE_ENV` | `production` | Required so the app serves the frontend and disables CORS for same-origin |

**Do not** set `PORT` — Render sets it automatically.

## 3. Variable format

- No spaces: use `MONGO_URI=value` not `MONGO_URI= value`
- Paste values without extra quotes unless the value itself contains spaces

## 4. After deploy

- Your app URL will be like `https://your-service-name.onrender.com`
- First request can be slow (free tier spins down after inactivity)
- Frontend and API are served from the same URL; the frontend already uses `/api` in production

## 5. If build fails

- Ensure **Build Command** is exactly: `npm run build`
- Ensure **Start Command** is exactly: `npm run start`
- Root `package.json` should have:
  - `"build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend"`
  - `"start": "npm run start --prefix backend"`
