export interface CreateBkashPaymentPayload {
  amount: number
  payerReference: string
  callbackURL: string
  merchantInvoiceNumber: string
}

export interface CreateBkashPaymentResponse {
  bkashURL: string
  paymentID: string
  bdtAmount: string
}

export interface ExecuteBkashPaymentResponse {
  paymentID: string
  transactionId: string
  amount: string
  currency: string
  customerMsisdn?: string
  merchantInvoiceNumber?: string
}

export interface BkashPendingSession {
  orderId: string
  amount: number
  currency: string
  email: string
  bkashMobile: string
  paymentID: string
  bdtAmount: string
}

export const BKASH_PENDING_SESSION_KEY = 'bkash-pending-session'

export async function createBkashPayment(
  payload: CreateBkashPaymentPayload,
): Promise<CreateBkashPaymentResponse> {
  const response = await fetch('/api/bkash/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as CreateBkashPaymentResponse & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to create bKash payment.')
  }

  return data
}

export async function executeBkashPayment(paymentID: string): Promise<ExecuteBkashPaymentResponse> {
  const response = await fetch('/api/bkash/execute-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentID }),
  })

  const data = (await response.json()) as ExecuteBkashPaymentResponse & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to execute bKash payment.')
  }

  return data
}

export function saveBkashPendingSession(session: BkashPendingSession) {
  sessionStorage.setItem(BKASH_PENDING_SESSION_KEY, JSON.stringify(session))
}

export function readBkashPendingSession(): BkashPendingSession | null {
  const raw = sessionStorage.getItem(BKASH_PENDING_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as BkashPendingSession
  } catch {
    return null
  }
}

export function clearBkashPendingSession() {
  sessionStorage.removeItem(BKASH_PENDING_SESSION_KEY)
}
