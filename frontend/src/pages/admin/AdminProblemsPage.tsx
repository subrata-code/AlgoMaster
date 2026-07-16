import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader, EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { DifficultyBadge } from '@/components/ProblemCard'
import { adminService } from '@/services'
import { ROUTES } from '@/constants'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import type { Problem } from '@/types'

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Problem | null>(null)
  const [preview, setPreview] = useState<Problem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await adminService.getProblems()
    setProblems(data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await adminService.deleteProblem(deleteTarget.id)
    setProblems((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
    setDeleting(false)
    toast({ title: 'Problem deleted', description: 'Mock delete — data resets on refresh.' })
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Manage Problems" description="Create, edit, preview, and delete problems.">
        <Button asChild>
          <Link to={ROUTES.ADMIN_CREATE_PROBLEM}>Create Problem</Link>
        </Button>
      </PageHeader>

      {problems.length === 0 ? (
        <EmptyState title="No problems" description="Create your first problem to get started." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="tabular-nums text-muted-foreground">{p.day ?? '—'}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <DifficultyBadge difficulty={p.difficulty} />
                    </TableCell>
                    <TableCell>{p.platform}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'published' ? 'success' : 'secondary'}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(p.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Preview" onClick={() => setPreview(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Edit" asChild>
                          <Link to={`/admin/problems/${p.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete problem?</DialogTitle>
            <DialogDescription>
              This will remove &ldquo;{deleteTarget?.name}&rdquo;. In this phase the delete is mocked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
            <DialogDescription>Problem preview</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <DifficultyBadge difficulty={preview.difficulty} />
                <Badge variant="outline">{preview.platform}</Badge>
                <Badge variant="secondary">{preview.status}</Badge>
              </div>
              <p className="text-muted-foreground">{preview.description}</p>
              <p>
                <span className="font-medium">Tags:</span> {preview.tags.join(', ')}
              </p>
              <p>
                <span className="font-medium">Companies:</span> {preview.companies.join(', ')}
              </p>
              <Button asChild className="w-full">
                <Link to={`/problems/${preview.id}`} onClick={() => setPreview(null)}>
                  Open public page
                </Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
