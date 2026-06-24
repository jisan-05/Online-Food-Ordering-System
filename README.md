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
