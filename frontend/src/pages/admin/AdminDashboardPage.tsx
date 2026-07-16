import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, Users, PenLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { DifficultyBadge } from '@/components/ProblemCard'
import { adminService } from '@/services'
import { ROUTES } from '@/constants'
import { formatDate } from '@/lib/utils'
import type { AdminStats, Problem } from '@/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, p] = await Promise.all([adminService.getStats(), adminService.getProblems()])
      setStats(s)
      setProblems(p.slice(0, 5))
      setLoading(false)
    }
    void load()
  }, [])

  if (loading || !stats) return <Loader />

  return (
    <div>
      <PageHeader title="Admin" description="Overview of content and platform metrics. UI only.">
        <Button asChild>
          <Link to={ROUTES.ADMIN_CREATE_PROBLEM}>Create Problem</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Problems', value: stats.totalProblems, icon: FileText },
          { label: 'Published', value: stats.published, icon: Eye },
          { label: 'Drafts', value: stats.drafts, icon: PenLine },
          { label: 'Users', value: stats.totalUsers.toLocaleString(), icon: Users },
          { label: 'Views (week)', value: stats.viewsThisWeek.toLocaleString(), icon: Eye },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <item.icon className="mb-2 h-4 w-4 text-muted-foreground" aria-hidden />
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent Problems</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.ADMIN_PROBLEMS}>Manage all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'published' ? 'success' : 'secondary'}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
