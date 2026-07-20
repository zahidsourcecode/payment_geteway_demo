import type { PaymentApiResponse, PaymentPayload } from '@/types'
import { delay, generateTransactionId } from '@/utils/formatters'
import { normalizeCardNumber } from '@/utils/cardValidation'

const TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  timeout: '4000000000000069',
  threeDS: '4000000000003220',
} as const

function resolveCardOutcome(cardNumber: string): PaymentApiResponse {
  const normalized = normalizeCardNumber(cardNumber)

  if (normalized === TEST_CARDS.declined) {
    return {
      status: 'declined',
      declineCode: 'insufficient_funds',
      declineMessage: 'Your card was declined due to insufficient funds.',
    }
  }

  if (normalized === TEST_CARDS.timeout) {
    return { status: 'timeout' }
  }

  if (normalized === TEST_CARDS.threeDS) {
    return { status: 'requires_action', actionType: '3ds' }
  }

  if (normalized === TEST_CARDS.success || luhnPasses(normalized)) {
    if (Math.random() < 0.35) {
      return { status: 'requires_action', actionType: '3ds' }
    }
    return {
      status: 'succeeded',
      transactionId: generateTransactionId(),
    }
  }

  return {
    status: 'declined',
    declineCode: 'card_not_supported',
    declineMessage: 'This card is not supported by the demo gateway.',
  }
}

function luhnPasses(cardNumber: string): boolean {
  let sum = 0
  let shouldDouble = false
  for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumber[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

export async function processPayment(payload: PaymentPayload): Promise<PaymentApiResponse> {
  await delay(1600 + Math.random() * 900)

  if (payload.method === 'bkash') {
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

  if (!payload.card) {
    return {
      status: 'declined',
      declineCode: 'missing_card',
      declineMessage: 'Card details are required.',
    }
  }

  return resolveCardOutcome(payload.card.cardNumber)
}

export async function confirmThreeDS(_otp: string): Promise<PaymentApiResponse> {
  await delay(1200)

  if (_otp === '000000') {
    return {
      status: 'declined',
      declineCode: 'authentication_failed',
      declineMessage: '3D Secure authentication failed. Please try again.',
    }
  }

  return {
    status: 'succeeded',
    transactionId: generateTransactionId(),
  }
}

export const testCardNumbers = [
  {
    number: '4242 4242 4242 4242',
    outcome: 'Success (may prompt 3D Secure)',
  },
  {
    number: '4000 0000 0000 0002',
    outcome: 'Declined — insufficient funds',
  },
  {
    number: '4000 0000 0000 0069',
    outcome: 'Timeout — retry available',
  },
  {
    number: '4000 0000 0000 3220',
    outcome: 'Always requires 3D Secure',
  },
]

export const threeDSHint = 'Use any 6-digit code except 000000 to approve.'
