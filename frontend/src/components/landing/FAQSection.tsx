import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FAQ } from '@/types'

/* ─── FAQ categories mapped from existing data ─── */
const categories = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'learning', label: 'Learning & Curriculum' },
  { id: 'practice', label: 'Practice & Problems' },
  { id: 'account', label: 'Account & Settings' },
  { id: 'premium', label: 'Premium Features' },
]

/**
 * Distribute FAQs across categories round-robin.
 * In production, FAQs would have a `category` field.
 */
function distributeFaqs(faqs: FAQ[]): Record<string, FAQ[]> {
  const result: Record<string, FAQ[]> = {}
  for (const cat of categories) result[cat.id] = []
  faqs.forEach((faq, i) => {
    const catId = categories[i % categories.length].id
    result[catId].push(faq)
  })
  return result
}

function FaqItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [open])

  return (
    <div className="faq-item">
      <button
        className="faq-item-button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{faq.question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="faq-answer"
        style={{
          maxHeight: open ? `${height}px` : '0px',
          opacity: open ? 1 : 0,
          paddingBottom: open ? '1rem' : '0',
        }}
      >
        <div ref={contentRef}>
          <p className="text-sm leading-relaxed text-white/55">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const distributed = distributeFaqs(faqs)
  const activeFaqs = distributed[activeCategory] ?? []

  // If active category has no FAQs, show all
  const displayFaqs = activeFaqs.length > 0 ? activeFaqs : faqs

  return (
    <section className="relative py-20 sm:py-28" id="faq" aria-labelledby="faq-heading">
      <div className="container-page relative z-10">
        {/* ─── Intro ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 max-w-lg text-base text-white/55">
            Find your starting point and learn how to make the most of AlgoJourney.
          </p>
        </motion.div>

        {/* ─── Body ─── */}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Category tabs (vertical) */}
          <div className="flex flex-row flex-wrap gap-1 lg:flex-col" role="tablist" aria-label="FAQ categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`faq-category ${activeCategory === cat.id ? 'faq-category-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              role="tabpanel"
            >
              {displayFaqs.map((faq) => (
                <FaqItem key={faq.id} faq={faq} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
