import { getBkashHealth } from './bkash.js'
import { getStripeHealth } from './stripe.js'

export function getApiHealth() {
  const stripe = getStripeHealth()
  const bkash = getBkashHealth()

  return {
    ok: true,
    stripeConfigured: stripe.stripeConfigured,
    bkashConfigured: bkash.bkashConfigured,
  }
}
