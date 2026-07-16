import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { ProblemForm } from '@/components/ProblemForm'
import { adminService, type CreateProblemInput } from '@/services/adminService'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'

export default function CreateProblemPage() {
  const navigate = useNavigate()

  const onSubmit = async (input: CreateProblemInput) => {
    await adminService.createProblem(input)
    toast({ title: 'Problem created', description: 'Mock create succeeded. Refresh resets mock data.' })
    void navigate(ROUTES.ADMIN_PROBLEMS)
  }

  return (
    <div>
      <PageHeader title="Create Problem" description="Add a new problem to the library." />
      <ProblemForm submitLabel="Create Problem" onSubmit={onSubmit} />
    </div>
  )
}
