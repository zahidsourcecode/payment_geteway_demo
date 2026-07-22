<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  clearBkashPendingSession,
  executeBkashPayment,
  readBkashPendingSession,
} from '@/services/bkashApi'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useErrorLogStore } from '@/stores/errorLogStore'
import { getErrorDetails } from '@/utils/errors'

const route = useRoute()
const router = useRouter()
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const errorLogStore = useErrorLogStore()

const message = ref('Finalizing your bKash payment…')

function maskBkashMobile(mobile: string) {
  return `bKash · ${mobile.slice(0, 3)}***${mobile.slice(-3)}`
}

function redirectFailed(errorMessage: string, details?: unknown) {
  errorLogStore.addError({
    source: 'bkash',
    message: errorMessage,
    details,
    route: route.fullPath,
  })
  clearBkashPendingSession()
  sessionStorage.removeItem('checkout-ready')
  checkoutStore.setFailureMessage(errorMessage)
  router.replace({
    name: 'payment-result',
    query: { status: 'failed', message: errorMessage },
  })
}

function redirectSuccess(transactionId: string, bkashMobile: string, pending: NonNullable<ReturnType<typeof readBkashPendingSession>>) {
  checkoutStore.setCompletedOrder({
    orderId: pending.orderId,
    transactionId,
    amount: pending.amount,
    currency: pending.currency,
    method: 'bkash',
    maskedPayment: maskBkashMobile(bkashMobile),
    customerEmail: pending.email,
    completedAt: new Date().toISOString(),
  })

  cartStore.clearCart()
  clearBkashPendingSession()
  sessionStorage.removeItem('checkout-ready')

  router.replace({
    name: 'payment-result',
    query: { status: 'success' },
  })
}

onMounted(async () => {
  const paymentID = typeof route.query.paymentID === 'string' ? route.query.paymentID : null
  const status = typeof route.query.status === 'string' ? route.query.status.toLowerCase() : null
  const pending = readBkashPendingSession()

  if (status === 'cancel') {
    redirectFailed('bKash payment was cancelled.')
    return
  }

  if (status === 'failure' || status === 'failed') {
    redirectFailed('bKash payment failed. Please try again.')
    return
  }

  if (!paymentID) {
    redirectFailed('Missing bKash payment reference. Please try again.')
    return
  }

  if (!pending) {
    redirectFailed('Payment session expired. Start checkout again from the shop.')
    return
  }

  if (pending.paymentID !== paymentID) {
    redirectFailed('bKash payment reference did not match this checkout session.')
    return
  }

  try {
    const result = await executeBkashPayment(paymentID)
    const mobile = result.customerMsisdn ?? pending.bkashMobile
    redirectSuccess(result.transactionId, mobile, pending)
  } catch (error) {
    redirectFailed(
      error instanceof Error ? error.message : 'Unable to finalize bKash payment.',
      getErrorDetails(error),
    )
  }
})
</script>

<template>
  <section class="page-section flex min-h-[50vh] max-w-lg flex-col items-center justify-center">
    <div class="ui-card w-full p-6 text-center sm:p-8">
      <div class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <h1 class="page-title mt-6">Processing bKash payment</h1>
      <p class="mt-2 text-sm ui-text-body">{{ message }}</p>
    </div>
  </section>
</template>
