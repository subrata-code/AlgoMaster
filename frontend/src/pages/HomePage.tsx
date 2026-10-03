import { useEffect, useState } from 'react'
import GradientWaves from '@/components/GradientWaves'
import { AmbientBlobs } from '@/components/landing/AmbientBlobs'
import { LandingHero } from '@/components/landing/LandingHero'
import { SocialReach } from '@/components/landing/SocialReach'
import { PlatformOverview } from '@/components/landing/PlatformOverview'
import { TestimonialsMarquee } from '@/components/landing/TestimonialsMarquee'
import { FAQSection } from '@/components/landing/FAQSection'
import { Loader } from '@/components/EmptyState'
import { contentService } from '@/services'
import type { FAQ, HomeStats, Testimonial } from '@/types'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, t, faq] = await Promise.all([
          contentService.getHomeStats(),
          contentService.getTestimonials(),
          contentService.getFaqs(),
        ])
        if (cancelled) return
        setStats(s)
        setTestimonials(t)
        setFaqs(faq)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <Loader label="Loading AlgoJourney..." />

  return (
    <div className="relative min-h-screen">
      {/* ─── Full-page GradientWaves background — stays fixed ─── */}
      <GradientWaves
        className="!fixed inset-0 !h-screen"
        horizonColor="#5227FF"
        waveColor="#FF9FFC"
        crestColor="#FFFFFF"
        speed={0.4}
        amplitude={2.5}
        waveScale={0.6}
        waveRatio={0.9}
        swell={35}
        turbulence={20}
        tilt={1.11}
        zoom={1}
        height={5.5}
        fogDepth={15}
        detail="medium"
        brightness={1}
        opacity={1}
        mouseInteraction
        parallaxStrength={0.5}
        grain
        grainIntensity={0.05}
      />

      {/* ─── Content overlay ─── */}
      <div className="relative z-10">
        {/* Hero Section — with ambient blobs overlay */}
        <div className="relative">
          <AmbientBlobs />
          <LandingHero stats={stats} />
        </div>

        {/* Social/Community Section */}
        <div className="relative border-t border-white/5 bg-background/40 backdrop-blur-md" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <SocialReach stats={stats} />
        </div>

        {/* Platform Overview Section */}
        <div className="relative border-t border-white/5 bg-background/60 backdrop-blur-md" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <PlatformOverview />
        </div>

        {/* Testimonials Section */}
        <div className="relative border-t border-white/5 bg-background/40 backdrop-blur-md" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <TestimonialsMarquee testimonials={testimonials} />
        </div>

        {/* FAQ Section */}
        <div className="relative border-t border-white/5 bg-background/60 backdrop-blur-md" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </div>
  )
}
