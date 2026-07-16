import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProblemCard } from '@/components/ProblemCard'
import { PremiumModal } from '@/components/PremiumModal'
import { HintsDialog } from '@/components/HintsDialog'
import { EmptyState, Loader, Pagination } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { DIFFICULTIES, PAGE_SIZE, PLATFORMS } from '@/constants'
import { bookmarkService, problemService } from '@/services'
import { useDebounce } from '@/hooks/use-media-query'
import { toast } from '@/hooks/use-toast'
import type { Difficulty, Platform, Problem, ProblemFilters } from '@/types'

export default function ProblemsPage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [platform, setPlatform] = useState<Platform | 'All'>('All')
  const [sortBy, setSortBy] = useState<ProblemFilters['sortBy']>('newest')
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [premiumType, setPremiumType] = useState<'solution' | 'video'>('solution')
  const [hintsProblem, setHintsProblem] = useState<Problem | null>(null)

  const debouncedSearch = useDebounce(search, 300)
  const topic = searchParams.get('topic') ?? undefined
  const company = searchParams.get('company') ?? undefined

  useEffect(() => {
    void bookmarkService.getAll().then((list) => {
      setBookmarks(new Set(list.map((b) => b.problemId)))
    })
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, difficulty, platform, sortBy, topic, company])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await problemService.getAll({
          search: debouncedSearch || undefined,
          difficulty,
          platform,
          topic,
          company,
          sortBy,
          page,
          pageSize: PAGE_SIZE,
        })
        if (cancelled) return
        setProblems(res.data)
        setTotalPages(res.pagination.totalPages)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, difficulty, platform, sortBy, page, topic, company])

  const handleBookmark = async (id: string) => {
    const res = await bookmarkService.toggle(id)
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (res.bookmarked) next.add(id)
      else next.delete(id)
      return next
    })
    toast({
      title: res.bookmarked ? 'Bookmarked' : 'Removed',
      description: res.bookmarked ? 'Problem saved to bookmarks.' : 'Problem removed from bookmarks.',
    })
  }

  return (
    <div className="container-page py-12">
      <PageHeader
        title="Problems"
        description="Search, filter, and practice curated DSA problems across platforms and companies."
      />

      {(topic || company) && (
        <p className="mb-4 text-sm text-muted-foreground">
          Filtering by {topic ? `topic: ${topic}` : ''}
          {topic && company ? ' · ' : ''}
          {company ? `company: ${company}` : ''}
        </p>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            className="pl-9"
            placeholder="Search problems, tags, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search problems"
          />
        </div>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty | 'All')}>
          <SelectTrigger aria-label="Filter by difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All difficulties</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={(v) => setPlatform(v as Platform | 'All')}>
          <SelectTrigger aria-label="Filter by platform">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as ProblemFilters['sortBy'])}>
          <SelectTrigger aria-label="Sort problems" className="sm:col-span-2 lg:col-span-1">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Loader />
      ) : problems.length === 0 ? (
        <EmptyState title="No problems found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                bookmarked={bookmarks.has(problem.id)}
                onBookmark={handleBookmark}
                onHints={setHintsProblem}
                onLocked={(type) => {
                  setPremiumType(type)
                  setPremiumOpen(true)
                }}
              />
            ))}
          </div>
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} contentType={premiumType} />
      <HintsDialog
        problem={hintsProblem}
        open={Boolean(hintsProblem)}
        onOpenChange={(open) => !open && setHintsProblem(null)}
      />
    </div>
  )
}
