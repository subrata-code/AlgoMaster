# Project Structure

```
AlgoMaster/
├── backend/
│   └── README.md                 # Placeholder only
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENT_TREE.md
│   ├── ROUTES.md
│   ├── SERVICES.md
│   ├── STYLE_GUIDE.md
│   └── PROJECT_STRUCTURE.md
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn-style primitives
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ProblemCard.tsx
│   │   │   ├── PremiumModal.tsx
│   │   │   ├── HintsDialog.tsx
│   │   │   ├── ProblemForm.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── constants/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components.json
│   ├── index.html
│   ├── package.json
│   ├── tsconfig*.json
│   └── vite.config.ts
├── .gitignore
├── LICENSE
└── README.md
```

## Conventions

- Prefer `@/` imports for anything under `src/`
- Colocate admin pages under `pages/admin/`
- Keep mock data in `data/`; never import mock arrays directly into presentational UI components (pages may go through services only)
- Add new API methods to services first, then wire pages
