# AlgoMaster Platform Documentation

Welcome to the AlgoMaster full-stack documentation. This document covers the architecture, setup instructions, backend APIs, and the standalone admin panel deployment.

## Architecture

AlgoMaster is divided into three distinct modules to allow decoupled deployment and maintainability:

1. **Backend API (`/backend`)**: 
   - Built with Node.js, Express, and MongoDB.
   - Handles authentication (JWT in secure cookies), problem management, user progression (streaks, achievements), and content management (testimonials, FAQs, etc.).
   - Uses a central seeder to populate realistic initial data.
2. **Main Frontend (`/frontend`)**: 
   - Built with React, Vite, Tailwind CSS (v3), and Framer Motion.
   - Focused on the user experience: exploring problems, the 100-day journey, solving algorithms, and viewing analytics.
3. **Admin Frontend (`/admin-frontend`)**: 
   - A standalone site built with React, Vite, and Tailwind CSS (v4).
   - Entirely separate from the main frontend so it can be deployed to a separate domain or subdomain.
   - Provides analytics, content management, and user role management.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)

### 1. Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`
3. Configure the `.env` file based on `.env.example`. Ensure you set the `ADMIN_PASSWORD` (default: `Admin@1234`).
4. Run the database seeder to populate content and create the admin user:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   *The backend runs on `http://localhost:5000`.*

### 2. Main Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`.*

### 3. Admin Frontend Setup
1. Navigate to `/admin-frontend`.
2. Install dependencies: `npm install`
3. Start the admin server:
   ```bash
   npm run dev
   ```
   *The admin panel runs on `http://localhost:5174`.*

## Admin Panel Features

Because the Admin Panel is built as a separate site, you can deploy it independently (e.g., to Vercel or Netlify) and configure the backend CORS to accept requests from its production domain via the `ADMIN_URL` environment variable.

### Accessing the Admin Panel
- **URL**: `http://localhost:5174`
- **Email**: `bagsubrata193@gmail.com` (configurable via `ADMIN_EMAIL` in backend `.env`)
- **Password**: `Admin@1234` (configurable via `ADMIN_PASSWORD` in backend `.env`)

*Note: Access to admin APIs is strictly protected by the `authorize(ROLES.ADMIN)` middleware on the backend.*

## User Interface & Experience
- **Navigation**: The main site features a dynamic, scrolling-responsive floating navbar that gracefully shrinks and expands depending on the scroll position. It features a rich dropdown for the "Explore" menu.
- **Mobile Responsiveness**: The mobile menu uses a clean, top-down drawer animation, and testimonials utilize a compact, auto-playing card slider to prevent text overflow.
- **Dark Mode**: Fully supported using CSS variables and Tailwind classes.
