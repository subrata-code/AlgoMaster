import { useState } from 'react'
import { ArrowRight, Calendar, Code2, Layers, Map, Target, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'

interface FeatureTab {
  id: string
  label: string
  icon: typeof Code2
  title: string
  description: string
  subItems: { label: string; desc: string }[]
}

const tabs: FeatureTab[] = [
  {
    id: 'problems',
    label: 'Problems',
    icon: Code2,
    title: 'Curated Problem Sets',
    description: 'Hand-picked DSA problems tagged by difficulty, topic, and company — everything you need for interview prep.',
    subItems: [
      { label: 'By Difficulty', desc: 'Easy, Medium, Hard categorization' },
      { label: 'By Company', desc: 'Google, Amazon, Meta and more' },
      { label: 'By Topic', desc: 'Arrays, Trees, DP, Graphs...' },
      { label: 'Featured Problems', desc: 'High-signal interview favorites' },
      { label: 'Bookmarks', desc: 'Save problems for later review' },
    ],
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: Map,
    title: 'Structured Learning Path',
    description: 'A phase-by-phase roadmap from foundations to advanced design problems. Never wonder what to study next.',
    subItems: [
      { label: 'Foundations', desc: 'Arrays, strings, and hashing' },
      { label: 'Linear Structures', desc: 'Linked lists, stacks, queues' },
      { label: 'Trees & Recursion', desc: 'Binary trees, BST, DFS' },
      { label: 'Graphs', desc: 'BFS, DFS, shortest paths' },
      { label: 'Dynamic Programming', desc: '1D/2D DP, optimization' },
      { label: 'Advanced & Design', desc: 'Heaps, tries, system design' },
    ],
  },
  {
    id: '100-days',
    label: '100 Days Journey',
    icon: Calendar,
    title: 'Daily Challenge System',
    description: 'One day, one focus, one set of problems. Build consistent habits with our structured 100-day program.',
    subItems: [
      { label: 'Daily Focus', desc: 'Each day targets a specific topic' },
      { label: 'Streak Tracking', desc: 'Maintain your coding streak' },
      { label: 'Progress Calendar', desc: 'Visualize your consistency' },
      { label: 'Difficulty Progression', desc: 'Gradual difficulty ramp-up' },
    ],
  },
  {
    id: 'topics',
    label: 'Topics',
    icon: Layers,
    title: 'Topic-wise Mastery',
    description: 'Deep-dive into individual topics — from arrays and strings to dynamic programming and graph algorithms.',
    subItems: [
      { label: 'Arrays & Hashing', desc: 'Two pointers, prefix sums' },
      { label: 'Trees & Graphs', desc: 'Traversals, shortest paths' },
      { label: 'Dynamic Programming', desc: 'Memoization, tabulation' },
      { label: 'Binary Search', desc: 'Search-space reduction' },
      { label: 'Stacks & Queues', desc: 'Monotonic stacks, BFS' },
    ],
  },
  {
    id: 'companies',
    label: 'Companies',
    icon: Target,
    title: 'Company-wise Preparation',
    description: 'Practice problems frequently asked at top tech companies. Filter by Google, Amazon, Meta, Microsoft, and more.',
    subItems: [
      { label: 'Google', desc: '42 curated problems' },
      { label: 'Amazon', desc: '56 curated problems' },
      { label: 'Meta', desc: '38 curated problems' },
      { label: 'Microsoft', desc: '34 curated problems' },
      { label: 'Apple & more', desc: 'Uber, Bloomberg, Adobe...' },
    ],
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: Trophy,
    title: 'Solve & Track Progress',
    description: 'Practice problems with hints, solutions, and concept videos. Track every problem you solve and watch your progress grow.',
    subItems: [
      { label: 'Hints System', desc: 'Progressive hints for stuck moments' },
      { label: 'Editorial Solutions', desc: 'Clean, explained solutions' },
      { label: 'Video Walkthroughs', desc: 'Concept explanation videos' },
      { label: 'Progress Dashboard', desc: 'Charts, streaks, achievements' },
    ],
  },
]

export function PlatformOverview() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [activeSubIndex, setActiveSubIndex] = useState(0)
  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    setActiveSubIndex(0)
  }

  return (
    <section className="relative py-20 sm:py-28" id="platform-features" aria-labelledby="platform-heading">
      <div className="container-page relative z-10">
        {/* ─── Intro ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#327CF6]">
            Platform Overview
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="platform-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className="block">One platform.</span>
              <span className="block font-accent italic text-[#327CF6]">
                Every DSA advantage.
              </span>
            </h2>
            <Link
              to={ROUTES.ROADMAP}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:text-white sm:self-auto"
            >
              Explore Plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* ─── Tab bar ─── */}
        <div className="mb-8 flex flex-wrap gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Platform features">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`platform-tab ${activeTab === tab.id ? 'platform-tab-active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab panel ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 lg:grid-cols-[280px_1fr]"
            role="tabpanel"
            aria-labelledby={`tab-${currentTab.id}`}
          >
            {/* Sidebar */}
            <aside className="rounded-xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <h3 className="mb-1 text-base font-semibold text-white">{currentTab.title}</h3>
              <div className="mb-4 h-px bg-white/8" />
              <ul className="space-y-1">
                {currentTab.subItems.map((sub, i) => (
                  <li key={sub.label}>
                    <button
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                        activeSubIndex === i
                          ? 'bg-white/10 font-medium text-white'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                      }`}
                      onClick={() => setActiveSubIndex(i)}
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Preview area */}
            <div className="flex flex-col justify-center rounded-xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#327CF6]/10">
                  <currentTab.icon className="h-6 w-6 text-[#327CF6]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{currentTab.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{currentTab.description}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentTab.id}-${activeSubIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 rounded-xl border border-white/6 bg-white/[0.02] p-5"
                >
                  <p className="text-sm font-medium text-white/90">
                    {currentTab.subItems[activeSubIndex]?.label}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {currentTab.subItems[activeSubIndex]?.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
