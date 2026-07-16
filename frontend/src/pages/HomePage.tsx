import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ProblemCard } from '@/components/ProblemCard'
import { PremiumModal } from '@/components/PremiumModal'
import { HintsDialog } from '@/components/HintsDialog'
import { Loader } from '@/components/EmptyState'
import { FadeIn, Section } from '@/components/PageHeader'
import { APP_NAME, APP_TAGLINE, ROUTES } from '@/constants'
import { contentService, problemService } from '@/services'
import { newsletterSchema, type NewsletterFormValues } from '@/lib/validations'
import { toast } from '@/hooks/use-toast'
import type { FAQ, HomeStats, JourneyDay, Problem, RoadmapPhase, Testimonial } from '@/types'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [featured, setFeatured] = useState<Problem[]>([])
  const [recent, setRecent] = useState<Problem[]>([])
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([])
  const [currentDay, setCurrentDay] = useState<JourneyDay | null>(null)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [premiumType, setPremiumType] = useState<'solution' | 'video'>('solution')
  const [hintsProblem, setHintsProblem] = useState<Problem | null>(null)

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, f, r, road, day, t, faq] = await Promise.all([
          contentService.getHomeStats(),
          problemService.getFeatured(),
          problemService.getRecent(6),
          contentService.getRoadmap(),
          contentService.getCurrentJourneyDay(),
          contentService.getTestimonials(),
          contentService.getFaqs(),
        ])
        if (cancelled) return
        setStats(s)
        setFeatured(f)
        setRecent(r)
        setRoadmap(road.slice(0, 4))
        setCurrentDay(day)
        setTestimonials(t)
        setFaqs(faq)
        if (day?.day) {
          const p = await problemService.getByDay(day.day)
          if (!cancelled) setCurrentProblem(p)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const onNewsletter = form.handleSubmit(async (values) => {
    await contentService.subscribeNewsletter(values.email)
    toast({ title: 'Subscribed', description: 'Thanks for joining the AlgoJourney newsletter.' })
    form.reset()
  })

  if (loading) return <Loader label="Loading AlgoJourney..." />

  return (
    <>
      <section className="gradient-mesh border-b border-border">
        <div className="container-page py-20 sm:py-28">
          <FadeIn>
            <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">{APP_NAME}</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {APP_TAGLINE}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Curated problems, structured roadmaps, and a 100-day journey — built for engineers who want clarity, not chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to={ROUTES.PROBLEMS}>
                  Explore Problems
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.ROADMAP}>View Roadmap</Link>
              </Button>
            </div>
          </FadeIn>

          {stats && (
            <FadeIn delay={0.1} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Problems', value: stats.problems },
                { label: 'Learners', value: stats.learners.toLocaleString() },
                { label: 'Topics', value: stats.topics },
                { label: 'Companies', value: stats.companies },
              ].map((item) => (
                <Card key={item.label} className="bg-card/80">
                  <CardContent className="p-5">
                    <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </FadeIn>
          )}
        </div>
      </section>

      <Section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured Problems</h2>
            <p className="mt-1 text-muted-foreground">High-signal problems interviewers love to ask.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to={ROUTES.PROBLEMS}>View all</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onHints={setHintsProblem}
              onLocked={(type) => {
                setPremiumType(type)
                setPremiumOpen(true)
              }}
            />
          ))}
        </div>
      </Section>

      {currentDay && (
        <Section className="bg-muted/30">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
                <Flame className="h-3.5 w-3.5 text-warning" />
                Current Day
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">{currentDay.title}</h2>
              <p className="mt-2 text-muted-foreground">
                Focus: {currentDay.focus}. Keep your streak alive and stay consistent.
              </p>
              <Button className="mt-6" asChild>
                <Link to={ROUTES.JOURNEY_100}>Open 100 Days Journey</Link>
              </Button>
            </div>
            {currentProblem ? (
              <ProblemCard
                problem={currentProblem}
                onHints={setHintsProblem}
                onLocked={(type) => {
                  setPremiumType(type)
                  setPremiumOpen(true)
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Day {currentDay.day}</CardTitle>
                  <CardDescription>Problems for this day are coming soon.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </Section>
      )}

      <Section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Roadmap Preview</h2>
          <p className="mt-1 text-muted-foreground">A clear path from foundations to advanced design problems.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roadmap.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    Phase {phase.order}: {phase.title}
                  </CardTitle>
                  {phase.isCompleted && <CheckCircle2 className="h-4 w-4 text-success" aria-label="Completed" />}
                </div>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{phase.duration}</CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" className="mt-6" asChild>
          <Link to={ROUTES.ROADMAP}>See full roadmap</Link>
        </Button>
      </Section>

      <Section className="bg-muted/30">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Problems</h2>
          <p className="mt-1 text-muted-foreground">Fresh additions to the practice set.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onHints={setHintsProblem}
              onLocked={(type) => {
                setPremiumType(type)
                setPremiumOpen(true)
              }}
            />
          ))}
        </div>
      </Section>

      <Section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">What learners say</h2>
          <p className="mt-1 text-muted-foreground">Testimonials placeholder — real stories coming soon.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-4 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">FAQ</h2>
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section>
        <Card className="overflow-hidden">
          <CardContent className="grid gap-6 p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Stay in the loop</h2>
              <p className="mt-2 text-muted-foreground">
                Weekly DSA tips, new problems, and journey updates. No spam.
              </p>
            </div>
            <form onSubmit={onNewsletter} className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="you@email.com"
                aria-label="Email for newsletter"
                {...form.register('email')}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Subscribe
              </Button>
            </form>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive md:col-span-2">{form.formState.errors.email.message}</p>
            )}
          </CardContent>
        </Card>
      </Section>

      <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} contentType={premiumType} />
      <HintsDialog
        problem={hintsProblem}
        open={Boolean(hintsProblem)}
        onOpenChange={(open) => !open && setHintsProblem(null)}
      />
    </>
  )
}
