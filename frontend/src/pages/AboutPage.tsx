import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/EmptyState'
import { FadeIn, PageHeader } from '@/components/PageHeader'
import { contentService } from '@/services'
import { APP_NAME, ROUTES } from '@/constants'
import type { HomeStats } from '@/types'

export default function AboutPage() {
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void contentService.getHomeStats().then((s) => {
      setStats(s)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container-page py-12">
      <FadeIn>
        <PageHeader
          title={`About ${APP_NAME}`}
          description="A premium platform to document your Data Structures & Algorithms journey and help others learn with structure."
        />
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our mission</CardTitle>
            <CardDescription>
              Replace chaotic grinding with a clear, day-by-day path from foundations to interview-ready mastery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              AlgoJourney is built for engineers who want accountability, curated problems, company-aware practice,
              and premium learning assets — without drowning in noise.
            </p>
            <p>
              This phase ships a production-ready frontend foundation with mock data and a service layer ready for any REST API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What you get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Curated problem library with filters and company tags',
              'Structured roadmap and 100-day journey',
              'Progress dashboard with streaks and activity',
              'Premium solutions & concept videos (UI locked for now)',
              'Admin tools for managing problems',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Problems', value: stats.problems },
            { label: 'Learners', value: stats.learners.toLocaleString() },
            { label: 'Topics', value: stats.topics },
            { label: 'Companies', value: stats.companies },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <p className="text-2xl font-semibold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Button asChild>
          <Link to={ROUTES.PROBLEMS}>Start practicing</Link>
        </Button>
      </div>
    </div>
  )
}
