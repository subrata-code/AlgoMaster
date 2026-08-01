import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const problemFormSchema = z.object({
  day: z.string().optional(),
  name: z.string().min(2, 'Problem name is required'),
  link: z.string().url('Enter a valid URL'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  platform: z.enum(['LeetCode', 'GeeksforGeeks', 'Codeforces', 'HackerRank', 'AtCoder']),
  companies: z.string().optional(),
  tags: z.string().min(1, 'At least one tag is required'),
  hints: z.string().optional(),
  solution: z.string().optional(),
  conceptVideoUrl: z.string().optional(),
  description: z.string().optional(),
  publish: z.boolean(),
  draft: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type NewsletterFormValues = z.infer<typeof newsletterSchema>
export type ProblemFormValues = z.infer<typeof problemFormSchema>
