import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { ProblemForm } from '@/components/ProblemForm'
import { Loader, EmptyState } from '@/components/EmptyState'
import { adminService, type CreateProblemInput } from '@/services/adminService'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'
import type { ProblemFormValues } from '@/lib/validations'

export default function EditProblemPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [defaults, setDefaults] = useState<Partial<ProblemFormValues> | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!id) return
    void adminService.getProblem(id).then((problem) => {
      if (!problem) {
        setMissing(true)
        setLoading(false)
        return
      }
      setDefaults({
        day: problem.day != null ? String(problem.day) : '',
        name: problem.name,
        link: problem.link,
        difficulty: problem.difficulty,
        platform: problem.platform,
        companies: problem.companies.join(', '),
        tags: problem.tags.join(', '),
        hints: problem.hints.join('\n'),
        solution: problem.solution ?? '',
        conceptVideoUrl: problem.conceptVideoUrl ?? '',
        description: problem.description ?? '',
        publish: problem.status === 'published',
        draft: problem.status === 'draft',
      })
      setLoading(false)
    })
  }, [id])

  const onSubmit = async (input: CreateProblemInput) => {
    if (!id) return
    await adminService.updateProblem(id, input)
    toast({ title: 'Problem updated', description: 'Mock update succeeded.' })
    void navigate(ROUTES.ADMIN_PROBLEMS)
  }

  if (loading) return <Loader />
  if (missing || !defaults) {
    return <EmptyState title="Problem not found" description="This problem does not exist in mock data." />
  }

  return (
    <div>
      <PageHeader title="Edit Problem" description="Update problem details and publishing status." />
      <ProblemForm key={id} defaultValues={defaults} submitLabel="Save Changes" onSubmit={onSubmit} />
    </div>
  )
}
