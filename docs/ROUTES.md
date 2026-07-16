# Routes

| Path | Page | Layout |
|------|------|--------|
| `/` | Home | Main |
| `/about` | About | Main |
| `/roadmap` | Roadmap | Main |
| `/100-days` | 100 Days Journey | Main |
| `/problems` | Problems list | Main |
| `/problems/:id` | Problem details | Main |
| `/topics` | Topics | Main |
| `/companies` | Companies | Main |
| `/login` | Login | Auth |
| `/signup` | Signup | Auth |
| `/forgot-password` | Forgot password | Auth |
| `/dashboard` | Dashboard | Dashboard |
| `/bookmarks` | Bookmarks | Dashboard |
| `/profile` | Profile | Dashboard |
| `/settings` | Settings | Dashboard |
| `/admin` | Admin overview | Admin |
| `/admin/problems` | Manage problems | Admin |
| `/admin/problems/create` | Create problem | Admin |
| `/admin/problems/:id/edit` | Edit problem | Admin |
| `*` | 404 | Main |

## Query params

- `/problems?topic=<slug>`
- `/problems?company=<name>`

## Notes

- Pages are lazy-loaded via `React.lazy` + `Suspense`.
- Auth and admin routes are not guarded in this phase.
