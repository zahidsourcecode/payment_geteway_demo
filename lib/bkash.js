const DEFAULT_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
const DEFAULT_USD_TO_BDT = 110

function getBkashConfig() {
  const baseUrl = (process.env.BKASH_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  const appKey = process.env.BKASH_APP_KEY
  const appSecret = process.env.BKASH_APP_SECRET
  const username = process.env.BKASH_USERNAME
  const password = process.env.BKASH_PASSWORD
  const usdToBdtRate = Number(process.env.BKASH_USD_TO_BDT_RATE ?? DEFAULT_USD_TO_BDT)

  return {
    baseUrl,
    appKey,
    appSecret,
    username,
    password,
    usdToBdtRate,
    isConfigured: Boolean(appKey && appSecret && username && password),
  }
}

export function getBkashHealth() {
  return {
    bkashConfigured: getBkashConfig().isConfigured,
  }
}

export function convertUsdToBdt(usdAmount) {
  const { usdToBdtRate } = getBkashConfig()
  const bdt = usdAmount * usdToBdtRate
  return Math.max(bdt, 1).toFixed(2)
}

async function bkashRequest(path, { method = 'GET', token, body, authHeaders = true } = {}) {
  const config = getBkashConfig()

  if (!config.isConfigured) {
    const error = new Error('bKash is not configured. Add BKASH_* variables to your environment.')
    error.statusCode = 503
    throw error
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-App-Key': config.appKey,
  }

  if (authHeaders) {
    headers.username = config.username
    headers.password = config.password
  }

  if (token) {
    headers.Authorization = token
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data.statusMessage ??
      data.errorMessage ??
      data.message ??
      `bKash API request failed (${response.status}).`
    const error = new Error(message)
    error.statusCode = response.status
    error.details = data
    throw error
  }

  return data
}

async function grantToken() {
  const config = getBkashConfig()
  const data = await bkashRequest('/tokenized/checkout/token/grant', {
    method: 'POST',
    authHeaders: true,
    body: {
      app_key: config.appKey,
      app_secret: config.appSecret,
    },
  })

  if (data.statusCode && data.statusCode !== '0000') {
    const error = new Error(data.statusMessage ?? 'Unable to grant bKash token.')
    error.statusCode = 502
    throw error
  }

  if (!data.id_token) {
    const error = new Error('bKash token response did not include id_token.')
    error.statusCode = 502
    throw error
  }

  return data.id_token
}

export async function createBkashPayment({
  amount,
  payerReference,
  callbackURL,
  merchantInvoiceNumber,
}) {
  if (typeof amount !== 'number' || amount <= 0) {
    const error = new Error('A valid amount is required.')
    error.statusCode = 400
    throw error
  }

  if (!callbackURL || typeof callbackURL !== 'string') {
    const error = new Error('callbackURL is required.')
    error.statusCode = 400
    throw error
  }

  if (!merchantInvoiceNumber || typeof merchantInvoiceNumber !== 'string') {
    const error = new Error('merchantInvoiceNumber is required.')
    error.statusCode = 400
    throw error
  }

  const bdtAmount = convertUsdToBdt(amount)
  const token = await grantToken()

  const data = await bkashRequest('/tokenized/checkout/create', {
    method: 'POST',
    token,
    authHeaders: false,
    body: {
      mode: '0011',
      payerReference: payerReference ?? ' ',
      callbackURL,
      amount: bdtAmount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber,
    },
  })

  if (data.statusCode && data.statusCode !== '0000') {
    const error = new Error(data.statusMessage ?? 'Unable to create bKash payment.')
    error.statusCode = 502
    throw error
  }

  if (!data.bkashURL || !data.paymentID) {
    const error = new Error('bKash did not return a payment URL.')
    error.statusCode = 502
    throw error
  }

  return {
    bkashURL: data.bkashURL,
    paymentID: data.paymentID,
    bdtAmount,
  }
}

export async function executeBkashPayment(paymentID) {
  if (!paymentID || typeof paymentID !== 'string') {
    const error = new Error('paymentID is required.')
    error.statusCode = 400
    throw error
  }

  const token = await grantToken()

  const data = await bkashRequest('/tokenized/checkout/execute', {
    method: 'POST',
    token,
    authHeaders: false,
    body: { paymentID },
  })

  if (data.statusCode && data.statusCode !== '0000') {
    const error = new Error(data.statusMessage ?? 'bKash payment could not be completed.')
    error.statusCode = 402
    error.details = data
    throw error
  }

  if (data.transactionStatus !== 'Completed') {
    const error = new Error(data.statusMessage ?? 'bKash payment was not completed.')
    error.statusCode = 402
    error.details = data
    throw error
  }

  return {
    paymentID: data.paymentID,
    transactionId: data.trxID ?? data.paymentID,
    amount: data.amount,
    currency: data.currency,
    customerMsisdn: data.customerMsisdn,
    merchantInvoiceNumber: data.merchantInvoiceNumber,
  }
}
