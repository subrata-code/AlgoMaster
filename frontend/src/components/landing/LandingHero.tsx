import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code2, Layers, Trophy, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/constants'
import type { HomeStats } from '@/types'
import CardSwap, { Card } from '@/components/ui/CardSwap'

interface LandingHeroProps {
  stats: HomeStats | null
}

export function LandingHero({ stats }: LandingHeroProps) {
  return (
    <section className="relative isolate min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
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

          {/* ─── Right: Interactive CardSwap ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center relative w-full h-[560px]"
          >
            {/* Ambient backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-gradient-to-tr from-[#327CF6]/20 via-[#9333EA]/15 to-transparent blur-[110px] pointer-events-none rounded-full" />

            <div className="relative w-full h-full flex items-center justify-center">
              <CardSwap
                width={420}
                height={280}
                cardDistance={55}
                verticalDistance={65}
                delay={3500}
                pauseOnHover={false}
                skewAmount={5}
                className="absolute left-[44%] top-[54%] -translate-x-1/2 -translate-y-1/2 perspective-[1000px] overflow-visible"
              >
                {/* ─── Card 1: Journey 100 DSA ─── */}
                <Card className="p-6 flex flex-col justify-between border-white/15 bg-gradient-to-br from-[#121216]/95 via-[#0d0d11]/95 to-[#08080a]/95 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#327CF6]/20 text-[#60A5FA] border border-[#327CF6]/30">
                        <Code2 className="w-3.5 h-3.5" /> Journey 100
                      </span>
                      <span className="text-[11px] text-white/40 font-mono tracking-wider">TOP TRACK</span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      Curated 100 DSA Problems
                    </h3>
                    <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
                      Structured path through Two Pointers, Trees, Graphs, and Dynamic Programming with visual intuition.
                    </p>
                  </div>

                  <div className="space-y-2 mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Array & Hashing
                      </span>
                      <span className="text-emerald-400 font-mono font-medium">100% Solved</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#327CF6] to-[#60A5FA] h-full rounded-full w-[88%]" />
                    </div>
                    <div className="flex justify-between items-center pt-1 text-[11px] text-white/40">
                      <span>18 Patterns</span>
                      <span>Video Solutions Included</span>
                    </div>
                  </div>
                </Card>

                {/* ─── Card 2: System Design ─── */}
                <Card className="p-6 flex flex-col justify-between border-purple-500/25 bg-gradient-to-br from-[#15111c]/95 via-[#0e0c15]/95 to-[#08070d]/95 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Layers className="w-3.5 h-3.5" /> System Design
                      </span>
                      <span className="text-[11px] text-purple-300/50 font-mono tracking-wider">HIGH SCALE</span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white tracking-tight">
                      Architecting for 10M+ Users
                    </h3>
                    <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
                      Interactive distributed blueprints: Caching strategies, Message Queues, and Database Partitioning.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {['Redis Cluster', 'Kafka Streams', 'Rate Limiter', 'Consistent Hashing'].map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/25 text-[10px] text-purple-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[11px] text-white/40">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Production Case Studies
                      </span>
                      <span>4.9★ Rated</span>
                    </div>
                  </div>
                </Card>

                {/* ─── Card 3: FAANG Interview Prep ─── */}
                <Card className="p-6 flex flex-col justify-between border-emerald-500/25 bg-gradient-to-br from-[#0c1512]/95 via-[#080f0c]/95 to-[#050907]/95 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Trophy className="w-3.5 h-3.5" /> Company Prep
                      </span>
                      <span className="text-[11px] text-emerald-300/50 font-mono tracking-wider">FAANG +</span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white tracking-tight">
                      Targeted Interview Questions
                    </h3>
                    <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
                      Real company test patterns asked at Google, Meta, Uber, and Amazon with optimal complexity breakdowns.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-xs font-bold text-white">Google</p>
                        <p className="text-[10px] text-white/40">98 Qs</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-xs font-bold text-white">Meta</p>
                        <p className="text-[10px] text-white/40">114 Qs</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-xs font-bold text-white">Amazon</p>
                        <p className="text-[10px] text-white/40">142 Qs</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-[11px] text-emerald-400 font-mono">
                      <span>Optimal O(1) Space Solutions</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
