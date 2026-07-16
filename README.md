# AlgoJourney

**Master DSA. Track your journey. Level up.**

AlgoJourney is a premium web platform for documenting a Data Structures & Algorithms journey and helping others learn DSA with curated problems, structured roadmaps, and guided progress tracking.

> **Current phase:** Frontend foundation only. No backend, database, or real authentication. All data is mocked through a service layer designed to swap to REST APIs later.

---

## Features

- Premium SaaS UI (light & dark mode)
- Home, About, Roadmap, 100 Days Journey
- Problem library with search, filters, sort, pagination
- Problem details with hints and locked premium content
- Topics & Companies browsing
- User dashboard with charts and activity
- Bookmarks, Profile, Settings
- Auth screens (Login / Signup / Forgot Password) — UI only
- Admin UI: dashboard, manage/create/edit problems, delete confirmation, preview
- Service layer over mock data (Promise-based)
- Lazy-loaded routes and reusable layouts

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| Motion | Framer Motion |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

---

## Folder Structure

```
AlgoMaster/
├── frontend/          # React application
├── backend/           # Placeholder for future API
├── docs/              # Architecture & guides
├── README.md
└── .gitignore
```

Frontend `src/` layout:

```
src/
├── assets/
├── components/     # Shared UI + feature components
├── layouts/
├── pages/
├── routes/
├── services/       # Mock API layer
├── hooks/
├── context/
├── utils/          # (helpers live in lib/utils)
├── constants/
├── data/           # Mock datasets
├── types/
├── styles/
├── lib/
├── App.tsx
└── main.tsx
```

---

## Installation

```bash
cd frontend
npm install
```

---

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Typecheck + production build
npm run preview   # Preview production build
npm run lint      # Lint with oxlint
```

Open the app at the URL Vite prints (typically `http://localhost:5173`).

---

## Architecture

```
Pages → Services → Mock Data
         ↓
   (future) REST API
```

- **Pages** never hardcode lists of problems/users/stats.
- **Services** return `Promise.resolve(...)` with artificial delay.
- **Components** stay API-agnostic; swap service implementations later without UI rewrites.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/SERVICES.md](docs/SERVICES.md).

---

## Backend Integration Guide

When the API is ready:

1. Add `VITE_API_BASE_URL` to `frontend/.env`.
2. Replace each method in `src/services/*` with `fetch`/`axios` calls.
3. Keep return types in `src/types` stable so pages keep working.
4. Wire real auth tokens in `authService` and protected route guards.

Example:

```ts
// before
async getById(id: string) {
  await delay()
  return problems.find((p) => p.id === id) ?? null
}

// after
async getById(id: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/problems/${id}`)
  if (!res.ok) return null
  return res.json()
}
```

---

## Future Roadmap

- [ ] REST API + MongoDB
- [ ] Real authentication & authorization
- [ ] Persisted bookmarks, progress, streaks
- [ ] Unlock premium solutions & concept videos
- [ ] AI-assisted hints and explanations
- [ ] Payments / premium plans
- [ ] Full admin RBAC

---

## Documentation

| Doc | Description |
|-----|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [COMPONENT_TREE.md](docs/COMPONENT_TREE.md) | Component hierarchy |
| [ROUTES.md](docs/ROUTES.md) | Route map |
| [SERVICES.md](docs/SERVICES.md) | Service contracts |
| [STYLE_GUIDE.md](docs/STYLE_GUIDE.md) | Design tokens & UX |
| [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Folder reference |

---

## License

See [LICENSE](LICENSE).
