import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { createStripePaymentIntent, getStripe, getStripeHealth } from '../lib/stripe.js'

const app = express()
const port = Number(process.env.PORT ?? 4242)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json(getStripeHealth())
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

app.listen(port, () => {
  console.log(`Stripe demo API listening on http://localhost:${port}`)
  if (!getStripe()) {
    console.warn('Warning: STRIPE_SECRET_KEY is missing. Card payments will not work until it is set.')
  }
})
