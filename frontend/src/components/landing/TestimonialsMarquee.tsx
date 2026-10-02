import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import type { Testimonial } from '@/types'

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[]
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="testimonial-card">
      <p className="text-sm leading-relaxed text-white/70">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        {t.avatar ? (
          <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70">
            {t.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-white/90">{t.name}</p>
          <p className="text-xs text-white/40">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  if (testimonials.length === 0) return null

  // Duplicate to create continuous marquee effect
  const col1 = [...testimonials, ...testimonials]
  const col2 = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container-page relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* ─── Left: Text + CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#327CF6]">
              Testimonials
            </p>

            <h2 id="testimonials-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className="block">Trusted by</span>
              <span className="block font-accent italic text-[#327CF6]">
                Thousands of Engineers
              </span>
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/55">
              Hear from students and professionals who leveled up their DSA skills
              and landed their dream roles with AlgoJourney.
            </p>

            <div className="mt-8">
              <Link
                to={ROUTES.ABOUT}
                className="floating-navbar-cta !rounded-lg !px-5 !py-2.5 !text-sm"
              >
                Hall of Fame
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* ─── Right: Masonry Marquee ─── */}
          <div className="relative grid grid-cols-2 gap-4 overflow-hidden" aria-hidden="true">
            {/* Column 1 — scrolling up */}
            <div className="testimonial-marquee-viewport h-[420px]">
              <div className="testimonial-marquee-track">
                {col1.map((t, i) => (
                  <TestimonialCard key={`c1-${t.id}-${i}`} t={t} />
                ))}
              </div>
            </div>

            {/* Column 2 — scrolling down (reverse) */}
            <div className="testimonial-marquee-viewport h-[420px]">
              <div className="testimonial-marquee-track testimonial-marquee-track-reverse">
                {col2.map((t, i) => (
                  <TestimonialCard key={`c2-${t.id}-${i}`} t={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
