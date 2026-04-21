import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  name: z.string().min(2).max(100).transform(v => v.trim()),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z
    .string()
    .optional()
    .refine(v => !v || /^(\+355|0)[0-9]{8,9}$/.test(v.replace(/\s/g, '')), {
      message: 'Invalid Albanian phone number',
    }),
  user_type: z.enum(['private', 'agent']),
  company_name: z.string().max(200).optional().transform(v => v?.trim() || undefined),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
