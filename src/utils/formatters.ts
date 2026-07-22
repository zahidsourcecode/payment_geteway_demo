export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function generateOrderId(): string {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD-${segment}`
}
