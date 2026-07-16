# Component Tree

```
App
├── ThemeProvider
├── BrowserRouter
├── AppRoutes
│   ├── MainLayout
│   │   ├── Navbar
│   │   ├── Outlet
│   │   │   ├── HomePage
│   │   │   │   ├── ProblemCard*
│   │   │   │   ├── PremiumModal
│   │   │   │   └── HintsDialog
│   │   │   ├── AboutPage
│   │   │   ├── RoadmapPage
│   │   │   ├── Journey100Page
│   │   │   ├── ProblemsPage
│   │   │   ├── ProblemDetailsPage
│   │   │   ├── TopicsPage
│   │   │   ├── CompaniesPage
│   │   │   └── NotFoundPage
│   │   └── Footer
│   ├── AuthLayout
│   │   ├── ThemeToggle
│   │   └── Outlet (Login / Signup / ForgotPassword)
│   ├── DashboardLayout
│   │   ├── Navbar
│   │   ├── Sidebar / MobileNavTabs
│   │   ├── Outlet (Dashboard / Bookmarks / Profile / Settings)
│   │   └── Footer
│   └── AdminLayout
│       ├── Navbar
│       ├── Sidebar (admin)
│       ├── Outlet
│       │   ├── AdminDashboardPage
│       │   ├── AdminProblemsPage
│       │   ├── CreateProblemPage → ProblemForm
│       │   └── EditProblemPage → ProblemForm
│       └── Footer
└── Toaster
```

## Shared components

| Component | Role |
|-----------|------|
| `Navbar` | Global navigation + theme toggle |
| `Footer` | Site links |
| `Sidebar` | Dashboard / Admin nav |
| `ProblemCard` | Problem summary + actions |
| `PremiumModal` | Locked content CTA |
| `HintsDialog` | Hint list dialog |
| `ProblemForm` | Create/edit admin form |
| `EmptyState` / `Loader` / `Pagination` | Feedback patterns |
| `PageHeader` / `FadeIn` / `Section` | Page chrome + subtle motion |

## UI primitives (`components/ui`)

Button, Input, Textarea, Label, Card, Badge, Dialog, Accordion, Select, Tabs, Switch, Separator, Skeleton, Toast, Table, Checkbox, Avatar, Breadcrumb.
