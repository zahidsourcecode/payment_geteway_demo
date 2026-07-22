export type PaymentMethod = 'stripe' | 'bkash'

export type PaymentFlowStatus =
  | 'idle'
  | 'validating'
  | 'processing'
  | 'success'
  | 'failed'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  emoji: string
  gradient: string
  image?: string
}

export interface CheckoutDetails {
  email: string
  fullName: string
  country: string
  postalCode: string
}

export interface CompletedOrder {
  orderId: string
  transactionId: string
  amount: number
  currency: string
  method: PaymentMethod
  maskedPayment: string
  customerEmail: string
  completedAt: string
}
