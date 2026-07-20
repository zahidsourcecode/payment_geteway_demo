import Stripe from 'stripe'

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  return stripeSecretKey ? new Stripe(stripeSecretKey) : null
}

export function getStripeHealth() {
  return {
    ok: true,
    stripeConfigured: Boolean(getStripe()),
  }
}

export async function createStripePaymentIntent({ amount, currency, orderId, email }) {
  const stripe = getStripe()

  if (!stripe) {
    const error = new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.')
    error.statusCode = 503
    throw error
  }

  if (typeof amount !== 'number' || amount <= 0) {
    const error = new Error('A valid amount is required.')
    error.statusCode = 400
    throw error
  }

  if (!currency || typeof currency !== 'string') {
    const error = new Error('Currency is required.')
    error.statusCode = 400
    throw error
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: orderId ?? 'demo-order',
    },
    receipt_email: email || undefined,
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  }
}
