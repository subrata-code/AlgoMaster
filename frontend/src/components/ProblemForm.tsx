import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DIFFICULTIES, PLATFORMS } from '@/constants'
import { problemFormSchema, type ProblemFormValues } from '@/lib/validations'
import type { CreateProblemInput } from '@/services/adminService'

interface ProblemFormProps {
  defaultValues?: Partial<ProblemFormValues>
  submitLabel: string
  onSubmit: (input: CreateProblemInput) => Promise<void>
}

export function ProblemForm({ defaultValues, submitLabel, onSubmit }: ProblemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemFormSchema),
    defaultValues: {
      day: '',
      name: '',
      link: '',
      difficulty: 'Easy',
      platform: 'LeetCode',
      companies: '',
      tags: '',
      hints: '',
      solution: '',
      conceptVideoUrl: '',
      description: '',
      publish: true,
      draft: false,
      ...defaultValues,
    },
  })

  const publish = watch('publish')
  const draft = watch('draft')
  const difficulty = watch('difficulty')
  const platform = watch('platform')

  const submit = handleSubmit(async (values) => {
    const status = values.publish && !values.draft ? 'published' : 'draft'
    const dayNum = values.day?.trim() ? Number(values.day) : undefined
    const input: CreateProblemInput = {
      day: dayNum !== undefined && !Number.isNaN(dayNum) ? dayNum : undefined,
      name: values.name,
      link: values.link,
      difficulty: values.difficulty,
      platform: values.platform,
      companies: values.companies
        ? values.companies.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      tags: values.tags.split(',').map((s: string) => s.trim()).filter(Boolean),
      hints: values.hints
        ? values.hints.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [],
      solution: values.solution || undefined,
      conceptVideoUrl: values.conceptVideoUrl || undefined,
      description: values.description || undefined,
      status,
    }
    await onSubmit(input)
  })

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Problem details</CardTitle>
          <CardDescription>Core metadata shown on problem cards and detail pages.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="day">Day Number</Label>
            <Input id="day" type="number" min={1} {...register('day')} />
            {errors.day && <p className="text-sm text-destructive">{errors.day.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Problem Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="link">Problem Link</Label>
            <Input id="link" type="url" placeholder="https://..." {...register('link')} />
            {errors.link && <p className="text-sm text-destructive">{errors.link.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setValue('difficulty', v as ProblemFormValues['difficulty'])}>
              <SelectTrigger aria-label="Difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={(v) => setValue('platform', v as ProblemFormValues['platform'])}>
              <SelectTrigger aria-label="Platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="companies">Companies</Label>
            <Input id="companies" placeholder="Google, Amazon, Meta" {...register('companies')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="Array, Hash Table" {...register('tags')} />
            {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learning content</CardTitle>
          <CardDescription>Hints are free. Solution and video are premium (locked in UI).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hints">Hints (one per line)</Label>
            <Textarea id="hints" rows={4} {...register('hints')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="solution">Solution (Markdown)</Label>
            <Textarea
              id="solution"
              rows={10}
              className="font-mono text-xs"
              placeholder={"```ts\n// solution\n```"}
              {...register('solution')}
            />
            <p className="text-xs text-muted-foreground">Markdown editor UI — content stored as text for now.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="conceptVideoUrl">Concept Video URL</Label>
            <Input id="conceptVideoUrl" type="url" {...register('conceptVideoUrl')} />
            {errors.conceptVideoUrl && (
              <p className="text-sm text-destructive">{errors.conceptVideoUrl.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="publish">Publish</Label>
              <p className="text-sm text-muted-foreground">Make this problem visible on the public site</p>
            </div>
            <Switch
              id="publish"
              checked={publish}
              onCheckedChange={(v) => {
                setValue('publish', v)
                if (v) setValue('draft', false)
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="draft">Draft</Label>
              <p className="text-sm text-muted-foreground">Save without publishing</p>
            </div>
            <Switch
              id="draft"
              checked={draft}
              onCheckedChange={(v) => {
                setValue('draft', v)
                if (v) setValue('publish', false)
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
