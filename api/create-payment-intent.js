import { createStripePaymentIntent } from '../lib/stripe.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const result = await createStripePaymentIntent(req.body ?? {})
    res.status(200).json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unable to create payment intent.'
    res.status(statusCode).json({ error: message })
  }
}
