import { computed, ref } from 'vue'
import {
  createBkashPayment,
  saveBkashPendingSession,
} from '@/services/bkashApi'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useErrorLogStore } from '@/stores/errorLogStore'
import type { PaymentFlowStatus, PaymentMethod } from '@/types'
import { getErrorDetails } from '@/utils/errors'
import { formatZodErrors, bkashSchema, type BkashFormValues } from '@/utils/validation'

function maskBkashMobile(mobile: string) {
  return `bKash · ${mobile.slice(0, 3)}***${mobile.slice(-3)}`
}

export function usePaymentGateway() {
  const cartStore = useCartStore()
  const checkoutStore = useCheckoutStore()
  const errorLogStore = useErrorLogStore()

  const status = ref<PaymentFlowStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})
  const pendingBkashMobile = ref<string | null>(null)

  const isBusy = computed(() => ['validating', 'processing'].includes(status.value))

  function logPaymentError(source: 'stripe' | 'bkash', message: string, details?: unknown) {
    errorLogStore.addError({ source, message, details })
  }

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

    if (cartStore.total <= 0) {
      status.value = 'failed'
      errorMessage.value = 'Your cart is empty. Add products before paying with bKash.'
      checkoutStore.setFailureMessage(errorMessage.value)
      logPaymentError('bkash', errorMessage.value)
      return
    }

    pendingBkashMobile.value = parsed.data.bkashMobile
    status.value = 'processing'
    errorMessage.value = null

    try {
      const callbackURL = `${window.location.origin}/payment/bkash/callback`
      const result = await createBkashPayment({
        amount: cartStore.total,
        payerReference: parsed.data.bkashMobile,
        callbackURL,
        merchantInvoiceNumber: checkoutStore.orderId,
      })

      saveBkashPendingSession({
        orderId: checkoutStore.orderId,
        amount: cartStore.total,
        currency: cartStore.currency,
        email: checkoutStore.checkoutDetails.email,
        bkashMobile: parsed.data.bkashMobile,
        paymentID: result.paymentID,
        bdtAmount: result.bdtAmount,
      })

      window.location.assign(result.bkashURL)
    } catch (error) {
      status.value = 'failed'
      errorMessage.value =
        error instanceof Error ? error.message : 'Unexpected error while starting bKash payment.'
      checkoutStore.setFailureMessage(errorMessage.value)
      logPaymentError('bkash', errorMessage.value, getErrorDetails(error))
    }
  }

  function completeStripeSuccess(transactionId: string, maskedPayment: string) {
    status.value = 'success'
    completeSuccess('stripe', transactionId, maskedPayment)
  }

  function completeStripeFailure(message: string, details?: unknown) {
    status.value = 'failed'
    errorMessage.value = message
    checkoutStore.setFailureMessage(message)
    logPaymentError('stripe', message, details)
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

  return {
    status,
    errorMessage,
    fieldErrors,
    isBusy,
    setProcessing,
    submitBkashPayment,
    completeStripeSuccess,
    completeStripeFailure,
  }
}
