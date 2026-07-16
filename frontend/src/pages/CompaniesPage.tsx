import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { contentService } from '@/services'
import { ROUTES } from '@/constants'
import type { Company } from '@/types'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void contentService.getCompanies().then((data) => {
      setCompanies(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container-page py-12">
      <PageHeader
        title="Companies"
        description="Practice problems frequently asked at top tech companies."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <Link key={company.id} to={`${ROUTES.PROBLEMS}?company=${encodeURIComponent(company.name)}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden />
                </div>
                <CardTitle className="text-base">{company.name}</CardTitle>
                <CardDescription>{company.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{company.problemCount} problems</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
