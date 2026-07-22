import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  fullName: z.string().min(2, 'Full name is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
})

export const bkashSchema = z.object({
  bkashMobile: z
    .string()
    .regex(/^01\d{9}$/, 'Enter a valid bKash mobile number (01XXXXXXXXX)'),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type BkashFormValues = z.infer<typeof bkashSchema>

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}
