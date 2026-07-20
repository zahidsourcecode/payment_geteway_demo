import type { PaymentApiResponse, PaymentPayload } from '@/types'
import { delay, generateTransactionId } from '@/utils/formatters'

export async function processPayment(payload: PaymentPayload): Promise<PaymentApiResponse> {
  await delay(1600 + Math.random() * 900)

  if (payload.method !== 'bkash') {
    return {
      status: 'declined',
      declineCode: 'unsupported_method',
      declineMessage: 'This payment method is not supported by the mock gateway.',
    }
  }

  const mobile = payload.bkashMobile?.replace(/\D/g, '') ?? ''

  if (!/^01\d{9}$/.test(mobile)) {
    return {
      status: 'declined',
      declineCode: 'invalid_bkash',
      declineMessage: 'bKash account could not be verified.',
    }
  }

  if (mobile.includes('0000')) {
    return {
      status: 'declined',
      declineCode: 'bkash_declined',
      declineMessage: 'bKash payment was declined. Please check your balance and try again.',
    }
  }

  return {
    status: 'succeeded',
    transactionId: generateTransactionId(),
  }
}
