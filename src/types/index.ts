export type PaymentMethod = 'card' | 'wallet' | 'bank'

export type PaymentFlowStatus =
  | 'idle'
  | 'validating'
  | 'processing'
  | 'requires_3ds'
  | 'success'
  | 'failed'
  | 'timeout'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  emoji: string
  gradient: string
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface CheckoutDetails {
  email: string
  fullName: string
  country: string
  postalCode: string
}

export interface CardDetails {
  cardNumber: string
  expiry: string
  cvv: string
  cardholderName: string
}

export interface PaymentPayload {
  amount: number
  currency: string
  method: PaymentMethod
  orderId: string
  card?: CardDetails
  walletEmail?: string
}

export interface PaymentApiResponse {
  status: 'succeeded' | 'declined' | 'requires_action' | 'timeout'
  transactionId?: string
  declineCode?: string
  declineMessage?: string
  actionType?: '3ds'
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
