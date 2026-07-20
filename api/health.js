import { getStripeHealth } from '../lib/stripe.js'

export default function handler(_req, res) {
  res.status(200).json(getStripeHealth())
}
