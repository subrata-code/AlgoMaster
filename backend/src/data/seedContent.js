export const TOPICS = [
  { name: 'Arrays', slug: 'arrays', description: 'Foundation of DSA — indexing, two pointers, sliding window, and prefix sums.', problemCount: 24, icon: 'Layers', color: 'oklch(0.6 0.12 250)' },
  { name: 'Strings', slug: 'strings', description: 'Pattern matching, anagrams, sliding windows, and string manipulation.', problemCount: 18, icon: 'Type', color: 'oklch(0.62 0.12 160)' },
  { name: 'Linked Lists', slug: 'linked-lists', description: 'Pointer manipulation, reversal, cycle detection, and merging.', problemCount: 14, icon: 'Link', color: 'oklch(0.58 0.14 300)' },
  { name: 'Trees', slug: 'trees', description: 'Binary trees, BST, traversals, and recursive tree problems.', problemCount: 22, icon: 'GitBranch', color: 'oklch(0.6 0.14 140)' },
  { name: 'Graphs', slug: 'graphs', description: 'BFS, DFS, shortest paths, topological sort, and union-find.', problemCount: 20, icon: 'Share2', color: 'oklch(0.58 0.14 30)' },
  { name: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Optimal substructure, memoization, and bottom-up tabulation.', problemCount: 28, icon: 'Sparkles', color: 'oklch(0.62 0.14 80)' },
  { name: 'Binary Search', slug: 'binary-search', description: 'Search space reduction on sorted arrays and answer-space problems.', problemCount: 12, icon: 'Search', color: 'oklch(0.55 0.1 220)' },
  { name: 'Stacks & Queues', slug: 'stacks', description: 'LIFO/FIFO structures for parsing, monotonic stacks, and BFS queues.', problemCount: 16, icon: 'Stack', color: 'oklch(0.58 0.12 200)' },
];

export const COMPANIES = [
  { name: 'Google', problemCount: 42, description: 'Frequently asked problems from Google interviews.' },
  { name: 'Amazon', problemCount: 56, description: 'Top Amazon interview questions across levels.' },
  { name: 'Meta', problemCount: 38, description: 'Meta (Facebook) coding interview favorites.' },
  { name: 'Microsoft', problemCount: 34, description: 'Microsoft interview problem set.' },
  { name: 'Apple', problemCount: 22, description: 'Apple engineering interview staples.' },
  { name: 'Uber', problemCount: 18, description: 'Uber-style system and coding problems.' },
  { name: 'Bloomberg', problemCount: 16, description: 'Bloomberg terminal and coding interviews.' },
  { name: 'Adobe', problemCount: 14, description: 'Adobe product and platform interview set.' },
];

export const ROADMAP = [
  { id: 'r1', title: 'Foundations', description: 'Complexity analysis, arrays, strings, and hashing.', topics: ['arrays', 'strings', 'hashing'], duration: '2 weeks', order: 1, isCompleted: false },
  { id: 'r2', title: 'Linear Structures', description: 'Linked lists, stacks, queues, and two pointers.', topics: ['linked-lists', 'stacks', 'two-pointers'], duration: '2 weeks', order: 2, isCompleted: false },
  { id: 'r3', title: 'Trees & Recursion', description: 'Binary trees, BST, recursion patterns, and DFS.', topics: ['trees', 'recursion'], duration: '3 weeks', order: 3, isCompleted: false },
  { id: 'r4', title: 'Graphs', description: 'BFS, DFS, topological sort, and shortest paths.', topics: ['graphs', 'bfs', 'dfs-bfs'], duration: '3 weeks', order: 4, isCompleted: false },
  { id: 'r5', title: 'Dynamic Programming', description: '1D/2D DP, knapsack patterns, and optimization.', topics: ['dynamic-programming'], duration: '4 weeks', order: 5, isCompleted: false },
  { id: 'r6', title: 'Advanced & Design', description: 'Heaps, tries, design problems, and system thinking.', topics: ['design', 'heaps'], duration: '2 weeks', order: 6, isCompleted: false },
];

export const TESTIMONIALS = [
  { id: 'tes1', name: 'Priya Sharma', role: 'SDE @ Amazon', content: 'AlgoJourney turned my scattered LeetCode grinding into a structured path. The day-by-day format kept me accountable.' },
  { id: 'tes2', name: 'Jordan Lee', role: 'CS Student', content: 'The roadmap and company filters helped me focus on what actually shows up in interviews. Clean UI, zero clutter.' },
  { id: 'tes3', name: 'Sam Okonkwo', role: 'Backend Engineer', content: 'I love the locked premium content model — it motivates me to keep learning while the free problems stay excellent.' },
];

export const FAQS = [
  { id: 'faq1', question: 'Is AlgoJourney free?', answer: 'Core problem lists, roadmaps, and progress tracking are free. Premium solutions and concept videos unlock with an account (coming soon).' },
  { id: 'faq2', question: 'How does the 100 Days Journey work?', answer: 'Each day maps to a focused topic and curated problems. Track completion, maintain streaks, and build consistent habits.' },
  { id: 'faq3', question: 'Can I filter problems by company?', answer: 'Yes. Browse by company to practice questions frequently asked at Google, Amazon, Meta, and more.' },
  { id: 'faq4', question: 'Will there be authentication?', answer: 'Yes. Auth, dashboards, and personalized progress sync are live. Sign up to track solved problems, bookmarks, and streaks.' },
  { id: 'faq5', question: 'Do you support dark mode?', answer: 'Absolutely. Toggle light/dark from the navbar or settings. Your preference persists locally.' },
];

export const HOME_STATS = {
  problems: 150,
  learners: 12840,
  topics: 24,
  companies: 40,
};
