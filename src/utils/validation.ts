import { z } from 'zod'
import { isExpiryValid, luhnCheck, normalizeCardNumber } from '@/utils/cardValidation'

export const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  fullName: z.string().min(2, 'Full name is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
})

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .transform(normalizeCardNumber)
    .refine((value) => value.length === 16, 'Enter a 16-digit card number')
    .refine(luhnCheck, 'Invalid card number'),
  expiry: z.string().refine(isExpiryValid, 'Card has expired or invalid expiry'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
})

export const bkashSchema = z.object({
  bkashMobile: z
    .string()
    .regex(/^01\d{9}$/, 'Enter a valid bKash mobile number (01XXXXXXXXX)'),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type CardFormValues = z.infer<typeof cardSchema>
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
