import { useEffect, useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  GitBranch,
  Layers,
  Link as LinkIcon,
  Search,
  Share2,
  Sparkles,
  Type,
  Layers2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { contentService } from '@/services'
import { ROUTES } from '@/constants'
import type { Topic } from '@/types'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Layers,
  Type,
  Link: LinkIcon,
  GitBranch,
  Share2,
  Sparkles,
  Search,
  Stack: Layers2,
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void contentService.getTopics().then((data) => {
      setTopics(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container-page py-12">
      <PageHeader
        title="Topics"
        description="Browse problems by core DSA topics and build depth one area at a time."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => {
          const Icon = iconMap[topic.icon] ?? Layers
          return (
            <Link key={topic.id} to={`${ROUTES.PROBLEMS}?topic=${topic.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div
                    className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${topic.color}22`, color: topic.color }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-base">{topic.name}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{topic.problemCount} problems</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
