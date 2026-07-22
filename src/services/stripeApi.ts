export interface CreatePaymentIntentPayload {
  amount: number
  currency: string
  orderId: string
  email: string
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
): Promise<CreatePaymentIntentResponse> {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as CreatePaymentIntentResponse & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to create payment intent.')
  }

  return data
}

export const stripeTestCards = [
  {
    number: '4242 4242 4242 4242',
    outcome: 'Success',
  },
  {
    number: '4000 0000 0000 0002',
    outcome: 'Declined — insufficient funds',
  },
  {
    number: '4000 0000 0000 3220',
    outcome: 'Requires 3D Secure authentication',
  },
  {
    number: '4000 0000 0000 9995',
    outcome: 'Declined — insufficient funds (alternate)',
  },
]
