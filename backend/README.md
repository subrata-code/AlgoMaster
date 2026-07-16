# AlgoJourney Backend

Express.js API foundation for **AlgoJourney** — authentication, security middleware, and MongoDB Atlas connectivity.

> This phase builds the **backend infrastructure only**. No problem CRUD APIs. No OAuth. Frontend is separate and must not be modified by this package.

---

## Tech Stack

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- helmet, cors, cookie-parser, morgan
- express-validator
- express-rate-limit
- multer / cloudinary (prepared, not wired to routes yet)
- nodemon (dev)

---

## Folder Structure

```
backend/
├── .env.example
├── package.json
├── README.md
└── src/
    ├── app.js                 # Express app setup
    ├── server.js              # DB connect + listen
    ├── config/
    │   ├── cloudinary.js      # Placeholder
    │   ├── db.js
    │   └── env.js
    ├── constants/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── types/
    ├── utils/
    └── validators/
```

---

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas URI, JWT secret, and admin email.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `ADMIN_EMAIL` | Email that receives `admin` role on signup |
| `CLIENT_URL` | Frontend origin for CORS (`http://localhost:5173`) |
| `CLOUDINARY_*` | Optional — prepare for future uploads |

---

## MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access (or `0.0.0.0/0` for development).
3. Copy the connection string into `MONGODB_URI`.
4. Example:

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/algojourney?retryWrites=true&w=majority
```

The API creates collections automatically when documents are first written (e.g. on signup). Empty collections are fine — the server starts as long as the URI is valid.

---

## Scripts

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start with node (production-style)
```

---

## Run Project

```bash
cd backend
npm install
cp .env.example .env   # then fill values
npm run dev
```

Health check:

```
GET http://localhost:5000/api/health
```

---

## Auth API

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/signup` | No | Create account (role from `ADMIN_EMAIL`) |
| `POST` | `/api/auth/login` | No | Log in, returns JWT + httpOnly cookie |
| `POST` | `/api/auth/logout` | No | Clear auth cookie |
| `GET` | `/api/auth/me` | Yes | Current user |
| `POST` | `/api/auth/forgot-password` | No | Issue reset token |
| `POST` | `/api/auth/reset-password` | No | Reset password with token |

### Signup body

```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "password": "password123"
}
```

If `email` equals `ADMIN_EMAIL`, `role` is set to `admin`. Otherwise `role` is `user`.

### Auth header / cookie

- Cookie: `token` (httpOnly)
- Or header: `Authorization: Bearer <token>`

---

## Security

- Helmet HTTP headers
- CORS locked to `CLIENT_URL` with credentials
- Rate limiting on `/api`
- Input validation via express-validator
- Passwords hashed with bcrypt (cost 12)
- Secrets loaded from environment variables
- Centralized error handler

---

## Architecture

```
Route → Validator → Controller → Service → Model
                      ↓
              Middleware (auth / role / errors)
```

MVC with a service layer for business logic.

---

## Next Steps (not in this phase)

- Problem / topic / company CRUD
- Wire frontend service layer to this API
- Cloudinary image uploads
- Email delivery for password reset
- OAuth providers
