<div align="center">
  <img src="https://raw.githubusercontent.com/subrata-code/AlgoMaster/main/frontend/public/logo.png" alt="AlgoMaster Logo" width="120" />
  <h1>🚀 AlgoMaster</h1>
  <p><strong>A Modern, Data-Centric Platform for DSA & Programming Mastery</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)](./frontend)
  [![Backend](https://img.shields.io/badge/Backend-Node%20%2B%20Express-green?style=for-the-badge&logo=node.js)](./backend)
  [![Admin](https://img.shields.io/badge/Admin-Dashboard-purple?style=for-the-badge)](./admin-frontend)
</div>

---

## 🌟 Introduction

**AlgoMaster** is a complete, scalable ecosystem designed to help developers track their coding journey, prepare for technical interviews, and master Data Structures & Algorithms. It features a stunning Bento Grid-style Dashboard, a robust Express backend with JWT authentication, and a powerful Admin Panel for managing content dynamically.

## 🏗️ Architecture

AlgoMaster is built using a microservices-inspired monolithic structure split into three main workspaces:

- **[`/frontend`](./frontend):** The user-facing portal built with React, Vite, and TailwindCSS.
- **[`/backend`](./backend):** The API powerhouse built with Express.js and MongoDB.
- **[`/admin-frontend`](./admin-frontend):** A secure control panel for admins to manage problems, users, and content.

## ✨ Key Features

- **Auth System:** Secure JWT-based authentication with email verification and Google OAuth support.
- **Data-Driven Dashboard:** A stunning, cartoon-professional UI displaying live stats, streaks, and progress.
- **Dynamic Study Plans:** Track 100-day challenges, specific DSA topics, and aptitude logic.
- **Admin Control:** Full CRUD operations for questions, topics, roadmaps, and user management.
- **Modern UI/UX:** Glassmorphism, animations, and highly responsive components.

## 🚀 Quick Start

To run AlgoMaster locally, you'll need to spin up the backend and the frontend of your choice.

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*(Requires a `.env` file with MongoDB URI and JWT secrets. See `/backend/README.md`)*

### 2. User Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```bash
cd admin-frontend
npm install
npm run dev
```

## 🌍 Live Deployment

The system is currently configured for robust deployment:
- **Backend:** Hosted securely on Render (configured for CORS).
- **Frontends:** Deployed on Vercel for lightning-fast Edge delivery.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/subrata-code/AlgoMaster/issues).

---

<div align="center">
  <i>Built with ❤️ for developers by developers.</i>
</div>
