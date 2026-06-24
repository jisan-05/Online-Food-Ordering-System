# Online Food Ordering System

Professional MERN-style food ordering platform with customer, restaurant owner, and admin dashboards.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- TanStack Query
- Recharts
- Axios
- Firebase Authentication
- Node.js + Express
- MongoDB + Mongoose
- JWT authorization

## Features

- Responsive commercial home page
- Food browsing with search, category filtering, pagination, and details
- Customer dashboard with cart, checkout, order history, and order details
- Restaurant owner dashboard with food management, order management, and analytics
- Admin dashboard with user, restaurant, food, order, and analytics management
- Role-protected backend routes for customer, owner, and admin workflows
- MongoDB-backed foods, carts, orders, users, and restaurants

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and provide Firebase, MongoDB, JWT, and client URL values.

Run the backend:

```bash
npm.cmd run dev:server
```

Run the frontend in a second terminal:

```bash
npm.cmd run dev
```

Backend health check:

```text
http://localhost:5000/api/health
```

## Environment

Required backend variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Required frontend variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Verification

```bash
npm.cmd run lint
npm.cmd run build
```

## Deployment

Recommended deployment:

- Backend: Vercel (serverless Express API)
- Frontend: Netlify
- Database: MongoDB Atlas
- Auth: Firebase Authentication

### Backend on Vercel

1. Push this project to GitHub.
2. In [Vercel](https://vercel.com), import the repository.
3. Leave **Root Directory** as the repo root (do not point it at `server/`).
4. Vercel reads `vercel.json` and deploys the Express API from `api/index.js`.
5. Add backend environment variables in Vercel → Project → Settings → Environment Variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-app.netlify.app
```

`CLIENT_URL` also supports multiple comma-separated frontend URLs (e.g. Netlify preview URLs).

6. After deploy, note your API URL (e.g. `https://your-project.vercel.app`). Health check:

```text
https://your-project.vercel.app/api/health
```

### Frontend on Netlify

1. In [Netlify](https://www.netlify.com), import the same GitHub repository.
2. Netlify reads `netlify.toml` automatically. Confirm these settings:

```text
Build command: npm run build
Publish directory: dist
```

3. Add frontend environment variables in Netlify → Site configuration → Environment variables:

```env
VITE_API_URL=https://your-project.vercel.app/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

4. In Firebase Authentication, add your Netlify domain (e.g. `your-app.netlify.app`) to **Authorized domains**.
5. In MongoDB Atlas, allow Vercel to access the database. For quick testing you can allow `0.0.0.0/0`; for production use a stricter network rule when possible.
6. Update `CLIENT_URL` on Vercel with your final Netlify URL if it changed after the first deploy.

### Local development

Keep using separate terminals for backend and frontend (see Setup above). No changes are required for local dev.
