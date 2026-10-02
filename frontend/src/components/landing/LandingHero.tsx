import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code2, TrendingUp, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/constants'
import type { HomeStats } from '@/types'

interface LandingHeroProps {
  stats: HomeStats | null
}

export function LandingHero({ stats }: LandingHeroProps) {
  return (
    <section className="relative isolate min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ─── Left: Content ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Learner badge */}
            {stats && (
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#327CF6]" />
                {stats.learners.toLocaleString()}+ learners
              </span>
            )}

            {/* Headline */}
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              <span className="block">One Stop</span>
              <span className="block">Learning Platform</span>
              <span className="mt-1 block font-accent text-[1.05em] italic text-[#327CF6]">
                for DSA Mastery
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Learn DSA, System Design, and Core CS Subjects with personalised
              roadmaps, expert videos, and practice built for results.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.PROBLEMS}
                className="inline-flex items-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                Start for free
              </Link>
              <Link
                to={ROUTES.ROADMAP}
                className="floating-navbar-cta !rounded-lg !px-5 !py-2.5 !text-sm"
              >
                Explore Roadmap
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* ─── Right: Interactive Mock Card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 32, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="hero-mock-shell">
              <div className="relative z-10 space-y-5">
                {/* Mock header */}
                <div>
                  <h3 className="text-lg font-semibold text-white">Today&apos;s Challenge</h3>
                  <p className="mt-1 text-sm text-white/50">
                    Know exactly what you have to do each day. Planned.
                  </p>
                </div>

                {/* Mock cards stack */}
                <div className="space-y-3">
                  {[
                    { title: 'Two Sum', tag: 'Easy', icon: Code2, color: 'text-emerald-400' },
                    { title: 'Binary Search', tag: 'Medium', icon: Target, color: 'text-amber-400' },
                    { title: 'LRU Cache', tag: 'Hard', icon: TrendingUp, color: 'text-red-400' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 backdrop-blur-sm"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/90">{item.title}</p>
                        <p className="text-xs text-white/40">Arrays & Hashing</p>
                      </div>
                      <span className={`rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-medium ${item.color}`}>
                        {item.tag}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats row */}
                {stats && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {[
                      { label: 'Problems', value: stats.problems },
                      { label: 'Topics', value: stats.topics },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
                        <p className="text-lg font-semibold tabular-nums text-white">{s.value}</p>
                        <p className="text-xs text-white/40">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
