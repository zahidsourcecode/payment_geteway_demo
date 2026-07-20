import { computed, ref } from 'vue'
import { processPayment } from '@/services/paymentApi'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import type { PaymentFlowStatus, PaymentMethod } from '@/types'
import { formatZodErrors, bkashSchema, type BkashFormValues } from '@/utils/validation'

function maskBkashMobile(mobile: string) {
  return `bKash · ${mobile.slice(0, 3)}***${mobile.slice(-3)}`
}

export function usePaymentGateway() {
  const cartStore = useCartStore()
  const checkoutStore = useCheckoutStore()

  const status = ref<PaymentFlowStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})
  const pendingBkashMobile = ref<string | null>(null)

  const isBusy = computed(() =>
    ['validating', 'processing', 'requires_3ds'].includes(status.value),
  )

  function resetErrors() {
    errorMessage.value = null
    fieldErrors.value = {}
  }

  function setProcessing() {
    status.value = 'processing'
    errorMessage.value = null
  }

  async function submitBkashPayment(form: BkashFormValues) {
    resetErrors()
    status.value = 'validating'

    const parsed = bkashSchema.safeParse(form)
    if (!parsed.success) {
      fieldErrors.value = formatZodErrors(parsed.error)
      status.value = 'idle'
      return
    }

    pendingBkashMobile.value = parsed.data.bkashMobile
    await executeBkashPayment()
  }

  async function executeBkashPayment() {
    status.value = 'processing'
    errorMessage.value = null

    try {
      const response = await processPayment({
        amount: cartStore.total,
        currency: cartStore.currency,
        method: 'bkash',
        orderId: checkoutStore.orderId,
        bkashMobile: pendingBkashMobile.value ?? undefined,
      })

      if (response.status === 'timeout') {
        status.value = 'timeout'
        errorMessage.value = 'The payment gateway timed out. Please retry when ready.'
        return
      }

      if (response.status === 'declined') {
        status.value = 'failed'
        errorMessage.value = response.declineMessage ?? 'Payment was declined.'
        checkoutStore.setFailureMessage(errorMessage.value)
        return
      }

      completeSuccess('bkash', response.transactionId!)
    } catch {
      status.value = 'failed'
      errorMessage.value = 'Unexpected error while processing payment.'
      checkoutStore.setFailureMessage(errorMessage.value)
    }
  }

  function completeStripeSuccess(transactionId: string, maskedPayment: string) {
    status.value = 'success'
    completeSuccess('stripe', transactionId, maskedPayment)
  }

  function completeStripeFailure(message: string) {
    status.value = 'failed'
    errorMessage.value = message
    checkoutStore.setFailureMessage(message)
  }

  function completeSuccess(method: PaymentMethod, transactionId: string, maskedPayment?: string) {
    status.value = 'success'

    const paymentDetail =
      maskedPayment ??
      (method === 'bkash' && pendingBkashMobile.value
        ? maskBkashMobile(pendingBkashMobile.value)
        : 'Payment confirmed')

    checkoutStore.setCompletedOrder({
      orderId: checkoutStore.orderId,
      transactionId,
      amount: cartStore.total,
      currency: cartStore.currency,
      method,
      maskedPayment: paymentDetail,
      customerEmail: checkoutStore.checkoutDetails.email,
      completedAt: new Date().toISOString(),
    })

    cartStore.clearCart()
  }

  function retry() {
    resetErrors()
    status.value = 'idle'
  }

  return {
    status,
    errorMessage,
    fieldErrors,
    isBusy,
    setProcessing,
    submitBkashPayment,
    completeStripeSuccess,
    completeStripeFailure,
    retry,
  }
}
