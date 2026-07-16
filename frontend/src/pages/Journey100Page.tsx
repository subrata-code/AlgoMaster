import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { contentService } from '@/services'
import { ROUTES } from '@/constants'
import type { JourneyDay } from '@/types'

export default function Journey100Page() {
  const [days, setDays] = useState<JourneyDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void contentService.getJourneyDays().then((data) => {
      setDays(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  const completed = days.filter((d) => d.isCompleted).length
  const current = days.find((d) => d.isCurrent)

  return (
    <div className="container-page py-12">
      <PageHeader
        title="100 Days Journey"
        description="One focused day at a time. Build consistency, track progress, and master DSA."
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{completed}/100 completed</Badge>
          {current && <Badge variant="outline">Current: Day {current.day}</Badge>}
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
        {days.map((day) => (
          <Link
            key={day.day}
            to={day.problemIds[0] ? `/problems/${day.problemIds[0]}` : ROUTES.PROBLEMS}
            className={cn(
              'rounded-lg border border-border p-3 text-center transition-colors hover:bg-accent',
              day.isCompleted && 'border-success/30 bg-success/5',
              day.isCurrent && 'ring-2 ring-ring',
            )}
            aria-label={`${day.title}${day.isCurrent ? ' (current)' : ''}${day.isCompleted ? ' (completed)' : ''}`}
          >
            <p className="text-xs text-muted-foreground">Day</p>
            <p className="text-lg font-semibold tabular-nums">{day.day}</p>
            <p className="mt-1 line-clamp-2 text-[10px] leading-tight text-muted-foreground">{day.focus}</p>
          </Link>
        ))}
      </div>

      {current && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Today&apos;s focus</p>
            <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{current.focus}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
