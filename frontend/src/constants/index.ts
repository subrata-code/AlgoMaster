export const APP_NAME = 'AlgoJourney'
export const APP_TAGLINE = 'Master DSA. Track your journey. Level up.'
export const APP_DESCRIPTION =
  'A premium platform to document your Data Structures & Algorithms journey and help others learn DSA.'

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  ROADMAP: '/roadmap',
  JOURNEY_100: '/100-days',
  PROBLEMS: '/problems',
  PROBLEM_DETAILS: '/problems/:id',
  TOPICS: '/topics',
  COMPANIES: '/companies',
  DASHBOARD: '/dashboard',
  BOOKMARKS: '/bookmarks',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN: '/admin',
  ADMIN_PROBLEMS: '/admin/problems',
  ADMIN_CREATE_PROBLEM: '/admin/problems/create',
  ADMIN_EDIT_PROBLEM: '/admin/problems/:id/edit',
  NOT_FOUND: '*',
} as const

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
export const PLATFORMS = ['LeetCode', 'GeeksforGeeks', 'Codeforces', 'HackerRank', 'AtCoder'] as const

export const PAGE_SIZE = 9

export const NAV_LINKS = [
  { label: 'Problems', href: ROUTES.PROBLEMS },
  { label: 'Roadmap', href: ROUTES.ROADMAP },
  { label: '100 Days', href: ROUTES.JOURNEY_100 },
  { label: 'Topics', href: ROUTES.TOPICS },
  { label: 'Companies', href: ROUTES.COMPANIES },
] as const

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Problems', href: ROUTES.PROBLEMS, icon: 'Code2' },
  { label: 'Bookmarks', href: ROUTES.BOOKMARKS, icon: 'Bookmark' },
  { label: 'Profile', href: ROUTES.PROFILE, icon: 'User' },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: 'Settings' },
] as const

export const ADMIN_NAV = [
  { label: 'Overview', href: ROUTES.ADMIN, icon: 'LayoutDashboard' },
  { label: 'Problems', href: ROUTES.ADMIN_PROBLEMS, icon: 'Code2' },
  { label: 'Create Problem', href: ROUTES.ADMIN_CREATE_PROBLEM, icon: 'Plus' },
] as const
