import type {
  Achievement,
  Activity,
  AdminStats,
  Bookmark,
  Company,
  DashboardStats,
  FAQ,
  HomeStats,
  JourneyDay,
  RoadmapPhase,
  Testimonial,
  Topic,
  User,
} from '@/types'

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Rivera',
  username: 'alexcodes',
  email: 'alex@algojourney.dev',
  bio: 'Software engineer documenting a 100-day DSA journey. Passionate about clean code and algorithms.',
  role: 'user',
  joinedAt: '2026-01-15T00:00:00Z',
  location: 'San Francisco, CA',
  github: 'alexcodes',
  linkedin: 'alex-rivera',
}

export const adminUser: User = {
  id: 'a1',
  name: 'Admin',
  username: 'admin',
  email: 'admin@algojourney.dev',
  role: 'admin',
  joinedAt: '2025-12-01T00:00:00Z',
}

export const topics: Topic[] = [
  {
    id: 't1',
    name: 'Arrays',
    slug: 'arrays',
    description: 'Foundation of DSA — indexing, two pointers, sliding window, and prefix sums.',
    problemCount: 24,
    icon: 'Layers',
    color: 'oklch(0.6 0.12 250)',
  },
  {
    id: 't2',
    name: 'Strings',
    slug: 'strings',
    description: 'Pattern matching, anagrams, sliding windows, and string manipulation.',
    problemCount: 18,
    icon: 'Type',
    color: 'oklch(0.62 0.12 160)',
  },
  {
    id: 't3',
    name: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Pointer manipulation, reversal, cycle detection, and merging.',
    problemCount: 14,
    icon: 'Link',
    color: 'oklch(0.58 0.14 300)',
  },
  {
    id: 't4',
    name: 'Trees',
    slug: 'trees',
    description: 'Binary trees, BST, traversals, and recursive tree problems.',
    problemCount: 22,
    icon: 'GitBranch',
    color: 'oklch(0.6 0.14 140)',
  },
  {
    id: 't5',
    name: 'Graphs',
    slug: 'graphs',
    description: 'BFS, DFS, shortest paths, topological sort, and union-find.',
    problemCount: 20,
    icon: 'Share2',
    color: 'oklch(0.58 0.14 30)',
  },
  {
    id: 't6',
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Optimal substructure, memoization, and bottom-up tabulation.',
    problemCount: 28,
    icon: 'Sparkles',
    color: 'oklch(0.62 0.14 80)',
  },
  {
    id: 't7',
    name: 'Binary Search',
    slug: 'binary-search',
    description: 'Search space reduction on sorted arrays and answer-space problems.',
    problemCount: 12,
    icon: 'Search',
    color: 'oklch(0.55 0.1 220)',
  },
  {
    id: 't8',
    name: 'Stacks & Queues',
    slug: 'stacks',
    description: 'LIFO/FIFO structures for parsing, monotonic stacks, and BFS queues.',
    problemCount: 16,
    icon: 'Stack',
    color: 'oklch(0.58 0.12 200)',
  },
]

export const companies: Company[] = [
  { id: 'c1', name: 'Google', problemCount: 42, description: 'Frequently asked problems from Google interviews.' },
  { id: 'c2', name: 'Amazon', problemCount: 56, description: 'Top Amazon interview questions across levels.' },
  { id: 'c3', name: 'Meta', problemCount: 38, description: 'Meta (Facebook) coding interview favorites.' },
  { id: 'c4', name: 'Microsoft', problemCount: 34, description: 'Microsoft interview problem set.' },
  { id: 'c5', name: 'Apple', problemCount: 22, description: 'Apple engineering interview staples.' },
  { id: 'c6', name: 'Uber', problemCount: 18, description: 'Uber-style system and coding problems.' },
  { id: 'c7', name: 'Bloomberg', problemCount: 16, description: 'Bloomberg terminal and coding interviews.' },
  { id: 'c8', name: 'Adobe', problemCount: 14, description: 'Adobe product and platform interview set.' },
]

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'r1',
    title: 'Foundations',
    description: 'Complexity analysis, arrays, strings, and hashing.',
    topics: ['arrays', 'strings', 'hashing'],
    duration: '2 weeks',
    order: 1,
    isCompleted: true,
  },
  {
    id: 'r2',
    title: 'Linear Structures',
    description: 'Linked lists, stacks, queues, and two pointers.',
    topics: ['linked-lists', 'stacks', 'two-pointers'],
    duration: '2 weeks',
    order: 2,
    isCompleted: true,
  },
  {
    id: 'r3',
    title: 'Trees & Recursion',
    description: 'Binary trees, BST, recursion patterns, and DFS.',
    topics: ['trees', 'recursion'],
    duration: '3 weeks',
    order: 3,
    isCompleted: false,
  },
  {
    id: 'r4',
    title: 'Graphs',
    description: 'BFS, DFS, topological sort, and shortest paths.',
    topics: ['graphs', 'bfs', 'dfs-bfs'],
    duration: '3 weeks',
    order: 4,
    isCompleted: false,
  },
  {
    id: 'r5',
    title: 'Dynamic Programming',
    description: '1D/2D DP, knapsack patterns, and optimization.',
    topics: ['dynamic-programming'],
    duration: '4 weeks',
    order: 5,
    isCompleted: false,
  },
  {
    id: 'r6',
    title: 'Advanced & Design',
    description: 'Heaps, tries, design problems, and system thinking.',
    topics: ['design', 'heaps'],
    duration: '2 weeks',
    order: 6,
    isCompleted: false,
  },
]

export const journeyDays: JourneyDay[] = Array.from({ length: 100 }, (_, i) => {
  const day = i + 1
  const focuses = [
    'Arrays & Hashing',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Binary Search',
    'Linked List',
    'Trees',
    'Tries',
    'Heap / Priority Queue',
    'Backtracking',
    'Graphs',
    'Dynamic Programming',
    'Greedy',
    'Intervals',
    'Math & Geometry',
  ]
  return {
    day,
    title: `Day ${day}: ${focuses[i % focuses.length]}`,
    problemIds: day <= 12 ? [String(day)] : [],
    focus: focuses[i % focuses.length],
    isCompleted: day < 15,
    isCurrent: day === 15,
  }
})

export const bookmarks: Bookmark[] = [
  { id: 'b1', problemId: '1', createdAt: '2026-06-10T10:00:00Z' },
  { id: 'b2', problemId: '7', createdAt: '2026-06-12T14:30:00Z' },
  { id: 'b3', problemId: '10', createdAt: '2026-06-14T09:15:00Z' },
  { id: 'b4', problemId: '14', createdAt: '2026-06-15T16:45:00Z' },
]

export const activities: Activity[] = [
  {
    id: 'act1',
    type: 'solved',
    title: 'Solved Two Sum',
    description: 'Completed an Easy problem on LeetCode',
    timestamp: '2026-07-15T18:30:00Z',
    problemId: '1',
  },
  {
    id: 'act2',
    type: 'bookmarked',
    title: 'Bookmarked LRU Cache',
    description: 'Saved for later review',
    timestamp: '2026-07-15T12:00:00Z',
    problemId: '10',
  },
  {
    id: 'act3',
    type: 'streak',
    title: '15-day streak!',
    description: 'You maintained consistency for 15 days',
    timestamp: '2026-07-14T23:59:00Z',
  },
  {
    id: 'act4',
    type: 'solved',
    title: 'Solved Maximum Subarray',
    description: 'Completed a Medium DP problem',
    timestamp: '2026-07-14T20:10:00Z',
    problemId: '7',
  },
  {
    id: 'act5',
    type: 'achievement',
    title: 'Unlocked: Array Ace',
    description: 'Solved 10 array problems',
    timestamp: '2026-07-13T11:00:00Z',
  },
  {
    id: 'act6',
    type: 'viewed',
    title: 'Reviewed Number of Islands',
    description: 'Opened problem details',
    timestamp: '2026-07-12T15:20:00Z',
    problemId: '9',
  },
]

export const achievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Solve your first problem',
    icon: 'Footprints',
    unlockedAt: '2026-01-16T00:00:00Z',
    progress: 1,
    total: 1,
  },
  {
    id: 'ach2',
    title: 'Array Ace',
    description: 'Solve 10 array problems',
    icon: 'Trophy',
    unlockedAt: '2026-07-13T00:00:00Z',
    progress: 10,
    total: 10,
  },
  {
    id: 'ach3',
    title: 'Streak Starter',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    unlockedAt: '2026-02-01T00:00:00Z',
    progress: 7,
    total: 7,
  },
  {
    id: 'ach4',
    title: 'Medium Master',
    description: 'Solve 25 medium problems',
    icon: 'Target',
    progress: 12,
    total: 25,
  },
  {
    id: 'ach5',
    title: 'Hard Mode',
    description: 'Solve 10 hard problems',
    icon: 'Zap',
    progress: 3,
    total: 10,
  },
  {
    id: 'ach6',
    title: 'Century Club',
    description: 'Complete the 100 Days Journey',
    icon: 'Award',
    progress: 14,
    total: 100,
  },
]

export const dashboardStats: DashboardStats = {
  solved: 47,
  easy: 22,
  medium: 18,
  hard: 7,
  streak: 15,
  longestStreak: 21,
  bookmarks: 4,
  totalProblems: 150,
  weeklyProgress: [
    { day: 'Mon', solved: 3 },
    { day: 'Tue', solved: 2 },
    { day: 'Wed', solved: 4 },
    { day: 'Thu', solved: 1 },
    { day: 'Fri', solved: 3 },
    { day: 'Sat', solved: 5 },
    { day: 'Sun', solved: 2 },
  ],
  topicProgress: [
    { topic: 'Arrays', solved: 12, total: 24 },
    { topic: 'Trees', solved: 8, total: 22 },
    { topic: 'DP', solved: 5, total: 28 },
    { topic: 'Graphs', solved: 6, total: 20 },
    { topic: 'Strings', solved: 9, total: 18 },
  ],
}

export const homeStats: HomeStats = {
  problems: 150,
  learners: 12840,
  topics: 24,
  companies: 40,
}

export const testimonials: Testimonial[] = [
  {
    id: 'tes1',
    name: 'Priya Sharma',
    role: 'SDE @ Amazon',
    content:
      'AlgoJourney turned my scattered LeetCode grinding into a structured path. The day-by-day format kept me accountable.',
  },
  {
    id: 'tes2',
    name: 'Jordan Lee',
    role: 'CS Student',
    content:
      'The roadmap and company filters helped me focus on what actually shows up in interviews. Clean UI, zero clutter.',
  },
  {
    id: 'tes3',
    name: 'Sam Okonkwo',
    role: 'Backend Engineer',
    content:
      'I love the locked premium content model — it motivates me to keep learning while the free problems stay excellent.',
  },
]

export const faqs: FAQ[] = [
  {
    id: 'faq1',
    question: 'Is AlgoJourney free?',
    answer:
      'Core problem lists, roadmaps, and progress tracking are free. Premium solutions and concept videos unlock with an account (coming soon).',
  },
  {
    id: 'faq2',
    question: 'How does the 100 Days Journey work?',
    answer:
      'Each day maps to a focused topic and curated problems. Track completion, maintain streaks, and build consistent habits.',
  },
  {
    id: 'faq3',
    question: 'Can I filter problems by company?',
    answer:
      'Yes. Browse by company to practice questions frequently asked at Google, Amazon, Meta, and more.',
  },
  {
    id: 'faq4',
    question: 'Will there be authentication?',
    answer:
      'Yes. Auth, dashboards, and personalized progress sync are planned for a later phase. This release is frontend-only with mock data.',
  },
  {
    id: 'faq5',
    question: 'Do you support dark mode?',
    answer: 'Absolutely. Toggle light/dark from the navbar or settings. Your preference persists locally.',
  },
]

export const adminStats: AdminStats = {
  totalProblems: 15,
  published: 14,
  drafts: 1,
  totalUsers: 12840,
  viewsThisWeek: 45230,
}
