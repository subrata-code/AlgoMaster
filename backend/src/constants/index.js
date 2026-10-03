export const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

export const AUTH_COOKIE = 'token';

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

export const API_PREFIX = '/api';

export const DIFFICULTIES = Object.freeze(['Easy', 'Medium', 'Hard']);
export const PLATFORMS = Object.freeze(['LeetCode', 'GeeksforGeeks', 'Codeforces', 'HackerRank', 'AtCoder']);
export const PROBLEM_STATUS = Object.freeze(['published', 'draft']);
export const CONTENT_TYPES = Object.freeze(['topic', 'company', 'roadmap', 'testimonial', 'faq', 'journey', 'stats']);
export const ACTIVITY_TYPES = Object.freeze(['solved', 'bookmarked', 'viewed', 'streak', 'achievement']);
export const ONBOARDING_DIFFICULTIES = Object.freeze(['Beginner', 'Intermediate', 'Advanced']);
export const EVENT_TYPES = Object.freeze([
  'problem_opened', 'video_opened', 'solution_viewed',
  'hint_0_viewed', 'hint_1_viewed', 'hint_2_viewed',
]);
export const ACHIEVEMENTS = Object.freeze([
  { id: 'first_solve', title: 'First Blood', description: 'Solve your first problem', icon: 'Target', total: 1 },
  { id: 'streak_3', title: 'Getting Warmed Up', description: 'Maintain a 3-day streak', icon: 'Flame', total: 3 },
  { id: 'streak_10', title: 'Consistency is Key', description: 'Maintain a 10-day streak', icon: 'Flame', total: 10 },
  { id: 'solve_50', title: 'Half Century', description: 'Solve 50 problems', icon: 'Trophy', total: 50 },
  { id: 'solve_100', title: 'Centurion', description: 'Solve 100 problems', icon: 'Trophy', total: 100 },
]);
