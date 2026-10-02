import { useState, useEffect } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import type { Testimonial } from '@/types'
import InfiniteSpiral, { type InfiniteSpiralItem } from '@/components/ui/InfiniteSpiral'
import { cn } from '@/lib/utils'

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[]
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="flex h-full flex-col justify-between p-4 bg-[#111] backdrop-blur-md">
      <p className="text-xs leading-relaxed text-white/70">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        {t.avatar ? (
          <img src={t.avatar} alt={t.name} className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/70">
            {t.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white/90">{t.name}</p>
          <p className="truncate text-[10px] text-white/40">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

function MobileTestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const t = testimonials[current]
  if (!t) return null

  return (
    <div className="relative w-full mt-4">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#327CF6]/15 blur-[80px]" />

      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#121218]/95 via-[#0e0e14]/95 to-[#08080c]/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        {/* Stars Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-xs font-semibold text-amber-300 font-mono">5.0</span>
          </div>

          <span className="text-xs font-mono text-white/40">
            {current + 1} / {testimonials.length}
          </span>
        </div>

        {/* Animated review body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between min-h-[140px]"
          >
            <p className="text-sm leading-relaxed text-white/80 font-normal">
              &ldquo;{t.content}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#327CF6]/20 border border-[#327CF6]/30 text-xs font-bold text-[#60A5FA]">
                  {t.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{t.name}</h4>
                <p className="text-xs text-white/50 truncate">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation & pagination controls */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to review ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  current === i ? 'w-6 bg-[#327CF6]' : 'w-1.5 bg-white/25 hover:bg-white/50'
                )}
              />
            ))}
          </div>

          {/* Left / Right buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  if (testimonials.length === 0) return null

  // Map testimonials to InfiniteSpiral items for desktop
  const spiralItems: InfiniteSpiralItem[] = testimonials.map((t, index) => ({
    id: `testim-${t.id || index}`,
    content: <TestimonialCard t={t} />,
    alt: t.name,
  }))

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          {/* ─── Left: Text + CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#327CF6]">
              Testimonials
            </p>

            <h2 id="testimonials-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className="block">Trusted by</span>
              <span className="block font-accent italic text-[#327CF6]">
                Thousands of Engineers
              </span>
            </h2>

            <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-white/60">
              Hear from students and professionals who leveled up their DSA skills
              and landed their dream roles with AlgoJourney.
            </p>

            <div className="mt-6 lg:mt-8">
              <Link
                to={ROUTES.ABOUT}
                className="floating-navbar-cta !rounded-lg !px-5 !py-2.5 !text-sm inline-flex items-center gap-1.5"
              >
                Hall of Fame
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* ─── Right: Desktop Infinite Spiral (hidden on mobile/tablet) ─── */}
          <div className="hidden lg:block relative h-[600px] w-full" aria-hidden="true">
            {/* Glow behind spiral */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#327CF6]/15 blur-[120px]" />

            <InfiniteSpiral
              items={spiralItems}
              animationMode="auto"
              speed={0.35}
              radius={200}
              cardWidth={300}
              cardHeight={180}
              verticalSpacing={120}
              perspective={1000}
              cardRadius={10}
              centerScale={1.2}
              edgeBlur={4.25}
              cardsPerTurn={7}
              pauseOnHover={true}
              direction="up"
              rotation={-108}
              cardTilt={0}
              edgeFade={0.3}
              imageFit="cover"
              grayscale={0.55}
            />
          </div>

          {/* ─── Mobile / Tablet: Responsive Familiar Testimonials Slider ─── */}
          <div className="block lg:hidden w-full">
            <MobileTestimonialsSlider testimonials={testimonials} />
          </div>
        </div>
      </div>
    </section>
  )
}
