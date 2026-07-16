import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, Lock, MessageSquare, Play } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DifficultyBadge, ProblemCard } from '@/components/ProblemCard'
import { PremiumModal } from '@/components/PremiumModal'
import { EmptyState, Loader } from '@/components/EmptyState'
import { bookmarkService, problemService } from '@/services'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'
import type { Problem } from '@/types'

export default function ProblemDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [related, setRelated] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [premiumType, setPremiumType] = useState<'solution' | 'video'>('solution')

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [p, rel, bm] = await Promise.all([
          problemService.getById(id!),
          problemService.getRelated(id!),
          bookmarkService.isBookmarked(id!),
        ])
        if (cancelled) return
        setProblem(p)
        setRelated(rel)
        setBookmarked(bm)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <Loader />
  if (!problem) {
    return (
      <div className="container-page py-12">
        <EmptyState title="Problem not found" description="This problem may have been removed." actionLabel="Back to problems" onAction={() => undefined} />
        <div className="mt-4 text-center">
          <Button asChild>
            <Link to={ROUTES.PROBLEMS}>Browse problems</Link>
          </Button>
        </div>
      </div>
    )
  }

  const openLocked = (type: 'solution' | 'video') => {
    setPremiumType(type)
    setPremiumOpen(true)
  }

  const toggleBookmark = async () => {
    const res = await bookmarkService.toggle(problem.id)
    setBookmarked(res.bookmarked)
    toast({ title: res.bookmarked ? 'Bookmarked' : 'Removed from bookmarks' })
  }

  return (
    <div className="container-page py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={ROUTES.PROBLEMS}>Problems</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{problem.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {problem.day != null && <Badge variant="outline">Day {problem.day}</Badge>}
              <DifficultyBadge difficulty={problem.difficulty} />
              <Badge variant="secondary">{problem.platform}</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">{problem.name}</h1>
            <p className="mt-3 text-muted-foreground">
              {problem.description ?? 'Practice this problem on the original platform and return here for hints and premium learning materials.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {problem.companies.map((c) => (
                <Badge key={c} variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <a href={problem.link} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open Problem
                </a>
              </Button>
              <Button variant="outline" onClick={toggleBookmark}>
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hints</CardTitle>
              <CardDescription>Nudge yourself before peeking at a solution.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {problem.hints.map((hint, i) => (
                  <AccordionItem key={i} value={`hint-${i}`}>
                    <AccordionTrigger>Hint {i + 1}</AccordionTrigger>
                    <AccordionContent>{hint}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Discussion
              </CardTitle>
              <CardDescription>Community discussion placeholder — coming in a later phase.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                Sign in to join the discussion. Comments and threads will appear here.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => openLocked('solution')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4" />
                Solution
              </CardTitle>
              <CardDescription>Premium walkthrough with code and complexity analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => openLocked('solution')}>
                Unlock Solution
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => openLocked('video')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Play className="h-4 w-4" />
                Concept Video
              </CardTitle>
              <CardDescription>Visual explanation of the core pattern behind this problem.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => openLocked('video')}>
                Unlock Video
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Solved</p>
                <p className="font-semibold tabular-nums">{problem.solvedCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Acceptance</p>
                <p className="font-semibold tabular-nums">{problem.acceptanceRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Related Problems</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                onLocked={(type) => {
                  setPremiumType(type)
                  setPremiumOpen(true)
                }}
              />
            ))}
          </div>
        </section>
      )}

      <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} contentType={premiumType} />
    </div>
  )
}
