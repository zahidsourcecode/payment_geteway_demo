export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  return `•••• •••• •••• ${last4 || '0000'}`
}

export function generateOrderId(): string {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD-${segment}`
}

export function generateTransactionId(): string {
  const segment = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `txn_${segment}`
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
