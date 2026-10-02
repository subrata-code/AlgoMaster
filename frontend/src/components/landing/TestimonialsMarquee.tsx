import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import type { Testimonial } from '@/types'
import InfiniteSpiral, { type InfiniteSpiralItem } from '@/components/ui/InfiniteSpiral'

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

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  if (testimonials.length === 0) return null

  // Map testimonials to InfiniteSpiral items
  const spiralItems: InfiniteSpiralItem[] = testimonials.map((t, index) => ({
    id: `testim-${t.id || index}`,
    content: <TestimonialCard t={t} />,
    alt: t.name,
  }))

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
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

          {/* ─── Right: Infinite Spiral ─── */}
          <div className="relative h-[600px] w-full" aria-hidden="true">
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
        </div>
      </div>
    </section>
  )
}
