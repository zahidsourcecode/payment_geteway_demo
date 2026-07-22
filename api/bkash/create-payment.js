import { createBkashPayment } from '../../lib/bkash.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const result = await createBkashPayment(req.body ?? {})
    res.status(200).json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unable to create bKash payment.'
    res.status(statusCode).json({ error: message })
  }
}
