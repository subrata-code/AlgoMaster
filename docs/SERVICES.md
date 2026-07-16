# Services

All services live in `frontend/src/services` and return Promises.

## problemService

| Method | Description |
|--------|-------------|
| `getAll(filters)` | Paginated, filtered, sorted published problems |
| `getById(id)` | Single problem by id or slug |
| `getFeatured()` | Featured problems |
| `getRecent(limit)` | Newest problems |
| `getRelated(id)` | Related by tags/difficulty |
| `getByDay(day)` | Problem for a journey day |
| `getCurrentDayProblem()` | Convenience helper |

## contentService

| Method | Description |
|--------|-------------|
| `getTopics()` / `getTopic(slug)` | Topic catalog |
| `getCompanies()` / `getCompany(id)` | Company catalog |
| `getRoadmap()` | Roadmap phases |
| `getJourneyDays()` / `getCurrentJourneyDay()` | 100-day journey |
| `getHomeStats()` | Landing stats |
| `getTestimonials()` / `getFaqs()` | Marketing content |
| `subscribeNewsletter(email)` | Mock subscribe |

## userService

| Method | Description |
|--------|-------------|
| `getCurrentUser()` | Mock current user |
| `getAdminUser()` | Mock admin |
| `getAchievements()` | Achievement list |
| `getActivities()` | Activity feed |
| `updateProfile(partial)` | Mock profile update |

## dashboardService

| Method | Description |
|--------|-------------|
| `getStats()` | Progress, streak, charts data |
| `getRecentActivity()` | Recent activity items |

## bookmarkService

| Method | Description |
|--------|-------------|
| `getAll()` | Bookmark list |
| `isBookmarked(problemId)` | Boolean check |
| `toggle(problemId)` | Toggle bookmark (non-persistent) |

## authService

| Method | Description |
|--------|-------------|
| `login` / `signup` / `forgotPassword` / `logout` | Mock auth (UI only) |

## adminService

| Method | Description |
|--------|-------------|
| `getStats()` | Admin metrics |
| `getProblems()` | All problems including drafts |
| `getProblem(id)` | Single problem |
| `createProblem` / `updateProblem` / `deleteProblem` | Mock mutations |

## Swapping to REST

Replace method bodies with HTTP calls. Keep signatures and return types unchanged so pages and components continue to work.
