<div align="center">
  <h1>🎨 AlgoMaster - User Portal</h1>
  <p><strong>The modern, gamified learning dashboard for aspiring developers.</strong></p>
</div>

## 📌 Overview

The **Frontend** application serves as the primary interface for users to learn, track progress, and conquer Data Structures & Algorithms. Built entirely on **React 18** and **Vite**, it delivers exceptional performance and a highly polished UI.

## ⚡ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Routing:** React Router v6
- **State Management:** React Hooks & API Context
- **API Client:** Native Fetch / Custom API wrappers

## ✨ Highlights

- **Bento Grid Dashboard:** A highly customized, data-centric interface showing streaks, progress, and upcoming topics.
- **Persistent Sidebar:** A smooth sliding navigation system keeping users focused on their journey.
- **Authentication Forms:** Clean and responsive Sign In, Sign Up, and Forgot Password flows.
- **Problem Tracking:** Seamlessly integrated UI to track solved questions and interact with code environments.

## 🛠️ Environment Variables

Create a `.env` file in the root of `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
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

1. Connect the repository to Vercel.
2. Select the `frontend` folder as the Root Directory.
3. Add the required Environment Variables.
4. Deploy!
