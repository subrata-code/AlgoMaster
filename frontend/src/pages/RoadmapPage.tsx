import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { contentService } from '@/services'
import type { RoadmapPhase } from '@/types'

export default function RoadmapPage() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void contentService.getRoadmap().then((data) => {
      setPhases(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container-page py-12">
      <PageHeader
        title="DSA Roadmap"
        description="A phased path covering foundations through advanced design problems."
      />
      <ol className="relative space-y-6 border-l border-border pl-6">
        {phases.map((phase) => (
          <li key={phase.id} className="relative">
            <span className="absolute -left-[1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
              {phase.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground" />
              )}
            </span>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Phase {phase.order}</Badge>
                  <Badge variant="outline">{phase.duration}</Badge>
                  {phase.isCompleted && <Badge variant="success">Completed</Badge>}
                </div>
                <CardTitle className="text-lg">{phase.title}</CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {phase.topics.map((t) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  )
}
