# Architecture

## Overview

AlgoJourney's frontend is a layered React application:

```
UI (Pages / Components)
        ↓
   Service Layer
        ↓
  Mock Data (now)  →  REST API (later)
```

Pages depend on **services**, not on raw mock arrays. Components are presentational and reusable. This keeps the UI stable when the backend arrives.

## Principles

1. **No hardcoded domain lists in components** — problems, topics, stats come from services.
2. **Promise-based services** — every method returns a `Promise` so async UI patterns (loading states) already match real APIs.
3. **Typed contracts** — shared TypeScript types in `src/types` define the data shape.
4. **Layouts by concern** — Main, Auth, Dashboard, Admin.
5. **Lazy routes** — pages are code-split via `React.lazy`.

## Layers

| Layer | Responsibility |
|-------|----------------|
| `pages/` | Route-level screens, data fetching, composition |
| `components/` | Reusable UI and feature widgets |
| `layouts/` | Shell chrome (nav, sidebar, footer) |
| `services/` | Data access abstraction |
| `data/` | Mock datasets |
| `context/` | Cross-cutting client state (theme) |
| `hooks/` | Shared hooks (toast, debounce, media) |
| `lib/` | Utilities + Zod schemas |

## Data flow

```
User action → Page handler → Service method → Mock / API → State update → Render
```

## Auth (current phase)

Auth pages call `authService` which returns mock tokens/users. There are **no protected route guards** and **no session persistence**. Premium content opens a login modal only.

## Admin (current phase)

Admin routes are publicly reachable for demo. Create/edit/delete call mock services and do not persist across reloads.

## Theming

`ThemeProvider` toggles `light` / `dark` / `system` classes on `<html>` and persists preference in `localStorage`.
