import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { createBkashPayment, executeBkashPayment, formatBkashApiError } from '../lib/bkash.js'
import { getApiHealth } from '../lib/health.js'
import { createStripePaymentIntent, getStripe } from '../lib/stripe.js'

const app = express()
const port = Number(process.env.PORT ?? 4242)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json(getApiHealth())
})

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const result = await createStripePaymentIntent(req.body ?? {})
    res.json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unable to create payment intent.'
    res.status(statusCode).json({ error: message })
  }
})

app.post('/api/bkash/create-payment', async (req, res) => {
  try {
    const result = await createBkashPayment(req.body ?? {})
    res.json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    res.status(statusCode).json(formatBkashApiError(error))
  }
})

app.post('/api/bkash/execute-payment', async (req, res) => {
  try {
    const result = await executeBkashPayment(req.body?.paymentID)
    res.json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    res.status(statusCode).json(formatBkashApiError(error))
  }
})

app.listen(port, () => {
  console.log(`Payment demo API listening on http://localhost:${port}`)
  const health = getApiHealth()
  if (!health.stripeConfigured) {
    console.warn('Warning: STRIPE_SECRET_KEY is missing. Stripe payments will not work until it is set.')
  }
  if (!health.bkashConfigured) {
    console.warn('Warning: BKASH_* variables are missing. bKash payments will not work until they are set.')
  }
})
