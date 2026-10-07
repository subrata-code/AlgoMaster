<div align="center">
  <h1>🛡️ AlgoMaster - Admin Dashboard</h1>
  <p><strong>The secure control center for platform managers and creators.</strong></p>
</div>

## 📌 Overview

The **Admin Frontend** is a dedicated React application built exclusively for administrative tasks. It provides a secure environment to manage users, update DSA problems, and dynamically configure the site's content like FAQS, Testimonials, and Roadmaps.

## ⚡ Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Routing:** React Router v6

## ✨ Highlights

- **Strict Access Control:** Rejects non-admin users instantly.
- **CRUD Mastery:** Easy-to-use interfaces to Create, Read, Update, and Delete platform content.
- **Real-Time Data Table:** View users' longest streaks, total solved problems, and manage their roles dynamically.
- **Theme Consistency:** Follows the same beautiful dark-mode glassmorphism aesthetics as the main user portal.

## 🛠️ Environment Variables

Create a `.env` file in the root of `/admin-frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Run Locally

```bash
# Install all dependencies
npm install

# Start the Vite development server
npm run dev

# Build for production
npm run build
```

## 📦 Deployment (Vercel)

1. Connect the repository to Vercel as a **new project**.
2. Select the `admin-frontend` folder as the Root Directory.
3. Add the `VITE_API_URL` pointing to your live backend.
4. Deploy! Ensure you update the backend's `ADMIN_URL` to point to this new Vercel domain to prevent CORS errors.

5. https://algo-master-mii2.vercel.app/
