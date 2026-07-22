const DEFAULT_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
const DEFAULT_USD_TO_BDT = 110

function trimEnv(value) {
  return typeof value === 'string' ? value.trim() : undefined
}

function normalizeBaseUrl(url) {
  let normalized = url.trim().replace(/\/+$/, '')
  // Common mistake when copying from tutorials that append /tokenized
  normalized = normalized.replace(/\/tokenized$/i, '')
  return normalized
}

function getBkashConfig() {
  const baseUrl = normalizeBaseUrl(trimEnv(process.env.BKASH_BASE_URL) ?? DEFAULT_BASE_URL)
  const appKey = trimEnv(process.env.BKASH_APP_KEY)
  const appSecret = trimEnv(process.env.BKASH_APP_SECRET)
  const username = trimEnv(process.env.BKASH_USERNAME)
  const password = trimEnv(process.env.BKASH_PASSWORD)
  const usdToBdtRate = Number(trimEnv(process.env.BKASH_USD_TO_BDT_RATE) ?? DEFAULT_USD_TO_BDT)

  return {
    baseUrl,
    appKey,
    appSecret,
    username,
    password,
    usdToBdtRate: Number.isFinite(usdToBdtRate) && usdToBdtRate > 0 ? usdToBdtRate : DEFAULT_USD_TO_BDT,
    isConfigured: Boolean(appKey && appSecret && username && password),
  }
}

function messageFromBkashData(fallback, data) {
  if (!data || typeof data !== 'object') return fallback

  const direct =
    data.statusMessage ?? data.errorMessage ?? data.message ?? data.error_description ?? null

  if (direct) return String(direct)

  if (data.statusCode) {
    return `${fallback} (bKash statusCode: ${data.statusCode})`
  }

  const keys = Object.keys(data)
  if (keys.length) {
    return `${fallback} (bKash response: ${JSON.stringify(data)})`
  }

  return fallback
}

function createBkashError(message, { statusCode = 502, details, hint } = {}) {
  const parts = [message]
  if (hint) parts.push(hint)

  const error = new Error(parts.join(' '))
  error.statusCode = statusCode
  if (details !== undefined) error.details = details
  return error
}

export function getBkashHealth() {
  const config = getBkashConfig()

  return {
    bkashConfigured: config.isConfigured,
    bkashBaseUrl: config.baseUrl,
  }
}

export function convertUsdToBdt(usdAmount) {
  const { usdToBdtRate } = getBkashConfig()
  const bdt = usdAmount * usdToBdtRate
  return Math.max(bdt, 1).toFixed(2)
}

async function bkashRequest(
  path,
  { method = 'GET', token, body, authHeaders = false, includeAppKey = true } = {},
) {
  const config = getBkashConfig()

  if (!config.isConfigured) {
    throw createBkashError('bKash is not configured. Add BKASH_* variables to your environment.', {
      statusCode: 503,
      hint: 'Set credentials in Vercel Project Settings, then redeploy.',
    })
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (includeAppKey) {
    headers['X-App-Key'] = config.appKey
  }

  if (authHeaders) {
    headers.username = config.username
    headers.password = config.password
  }

  if (token) {
    headers.Authorization = token
  }

  const url = `${config.baseUrl}${path}`
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const rawText = await response.text()
  let data = {}

  if (rawText) {
    try {
      data = JSON.parse(rawText)
    } catch {
      data = { raw: rawText.slice(0, 300) }
    }
  }

  if (!response.ok) {
    throw createBkashError(
      messageFromBkashData(`bKash API request failed (${response.status}).`, data),
      { statusCode: response.status >= 400 && response.status < 600 ? response.status : 502, details: data },
    )
  }

  return data
}

async function grantToken() {
  const config = getBkashConfig()
  const data = await bkashRequest('/tokenized/checkout/token/grant', {
    method: 'POST',
    authHeaders: true,
    includeAppKey: false,
    body: {
      app_key: config.appKey,
      app_secret: config.appSecret,
    },
  })

  if (data.statusCode && data.statusCode !== '0000') {
    throw createBkashError(messageFromBkashData('Unable to grant bKash token.', data), {
      details: data,
      hint: 'Verify BKASH_USERNAME, BKASH_PASSWORD, BKASH_APP_KEY, and BKASH_APP_SECRET on Vercel.',
    })
  }

  if (!data.id_token) {
    throw createBkashError(
      messageFromBkashData('bKash token response did not include id_token.', data),
      {
        details: data,
        hint: `Check BKASH_BASE_URL (currently "${config.baseUrl}"). It should be https://tokenized.sandbox.bka.sh/v1.2.0-beta without /tokenized at the end.`,
      },
    )
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
    throw createBkashError('A valid amount is required.', { statusCode: 400 })
  }

  if (!callbackURL || typeof callbackURL !== 'string') {
    throw createBkashError('callbackURL is required.', { statusCode: 400 })
  }

  if (!merchantInvoiceNumber || typeof merchantInvoiceNumber !== 'string') {
    throw createBkashError('merchantInvoiceNumber is required.', { statusCode: 400 })
  }

  const bdtAmount = convertUsdToBdt(amount)
  const token = await grantToken()

  const data = await bkashRequest('/tokenized/checkout/create', {
    method: 'POST',
    token,
    authHeaders: false,
    includeAppKey: true,
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
    throw createBkashError(messageFromBkashData('Unable to create bKash payment.', data), {
      details: data,
    })
  }

  if (!data.bkashURL || !data.paymentID) {
    throw createBkashError(messageFromBkashData('bKash did not return a payment URL.', data), {
      details: data,
    })
  }

  return {
    bkashURL: data.bkashURL,
    paymentID: data.paymentID,
    bdtAmount,
  }
}

export async function executeBkashPayment(paymentID) {
  if (!paymentID || typeof paymentID !== 'string') {
    throw createBkashError('paymentID is required.', { statusCode: 400 })
  }

  const token = await grantToken()

  const data = await bkashRequest('/tokenized/checkout/execute', {
    method: 'POST',
    token,
    authHeaders: false,
    includeAppKey: true,
    body: { paymentID },
  })

  if (data.statusCode && data.statusCode !== '0000') {
    throw createBkashError(messageFromBkashData('bKash payment could not be completed.', data), {
      statusCode: 402,
      details: data,
    })
  }

  if (data.transactionStatus !== 'Completed') {
    throw createBkashError(messageFromBkashData('bKash payment was not completed.', data), {
      statusCode: 402,
      details: data,
    })
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

export function formatBkashApiError(error) {
  const message = error instanceof Error ? error.message : 'Unable to process bKash request.'
  const payload = { error: message }

  if (error && typeof error === 'object' && 'details' in error && error.details) {
    payload.details = error.details
  }

  return payload
}
