<div align="center">
  <h1>⚙️ AlgoMaster - Backend API</h1>
  <p><strong>The robust, secure, and scalable engine powering AlgoJourney.</strong></p>
</div>

## 📌 Overview

The **Backend** acts as the central brain of the platform. It handles everything from user authentication and streak management to serving dynamic DSA problems and content. It is built strictly on **Node.js** and **Express**, utilizing **MongoDB** for flexible data storage.

## ⚡ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Security:** Helmet, CORS, Rate Limiting, Mongo Sanitize
- **Mailing:** Nodemailer (SMTP integration)

## ✨ Highlights

- **Role-Based Access Control:** Differentiates between standard users and system administrators.
- **Automated Crons:** Background jobs that monitor streaks and handle email automation.
- **RESTful Architecture:** Clean, modularized controller and routing structures.
- **Secure by Default:** Advanced middleware implementations to prevent common web vulnerabilities.

## 🛠️ Environment Variables

Create a `.env` file in the root of `/backend`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/algojourney
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpassword123
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 🚀 Run Locally

```bash
# Install all dependencies
npm install

# Start the development server (with nodemon)
npm run dev

# Or start the production server
npm start
```

## 📦 Deployment (Render / Heroku)

1. Connect your platform to the repository.
2. Provide the build command: `npm install`
3. Provide the start command: `npm start`
4. Populate the server's Environment Variables (make sure to use live URLs for `CLIENT_URL` and `ADMIN_URL`).
