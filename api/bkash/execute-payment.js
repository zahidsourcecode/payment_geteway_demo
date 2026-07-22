import { executeBkashPayment, formatBkashApiError } from '../../lib/bkash.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const result = await executeBkashPayment(req.body?.paymentID)
    res.status(200).json(result)
  } catch (error) {
    const statusCode = error.statusCode ?? 500
    res.status(statusCode).json(formatBkashApiError(error))
  }
}
