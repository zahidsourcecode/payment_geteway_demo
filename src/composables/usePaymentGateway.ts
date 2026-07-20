import { computed, ref } from 'vue'
import { confirmThreeDS, processPayment } from '@/services/paymentApi'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import type { CardDetails, PaymentFlowStatus, PaymentMethod } from '@/types'
import { maskCardNumber } from '@/utils/formatters'
import {
  cardSchema,
  formatZodErrors,
  walletSchema,
  type CardFormValues,
  type WalletFormValues,
} from '@/utils/validation'

export function usePaymentGateway() {
  const cartStore = useCartStore()
  const checkoutStore = useCheckoutStore()

  const status = ref<PaymentFlowStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})
  const pendingCard = ref<CardDetails | null>(null)
  const pendingWalletEmail = ref<string | null>(null)

  const isBusy = computed(() =>
    ['validating', 'processing', 'requires_3ds'].includes(status.value),
  )

  function resetErrors() {
    errorMessage.value = null
    fieldErrors.value = {}
  }

  async function submitCardPayment(form: CardFormValues) {
    resetErrors()
    status.value = 'validating'

    const parsed = cardSchema.safeParse(form)
    if (!parsed.success) {
      fieldErrors.value = formatZodErrors(parsed.error)
      status.value = 'idle'
      return
    }

    pendingCard.value = {
      cardNumber: parsed.data.cardNumber,
      expiry: form.expiry,
      cvv: form.cvv,
      cardholderName: parsed.data.cardholderName,
    }

    await executePayment('card')
  }

  async function submitWalletPayment(form: WalletFormValues) {
    resetErrors()
    status.value = 'validating'

    const parsed = walletSchema.safeParse(form)
    if (!parsed.success) {
      fieldErrors.value = formatZodErrors(parsed.error)
      status.value = 'idle'
      return
    }

    pendingWalletEmail.value = parsed.data.walletEmail
    await executePayment('wallet')
  }

  async function submitBankPayment() {
    resetErrors()
    pendingCard.value = null
    pendingWalletEmail.value = null
    await executePayment('bank')
  }

  async function executePayment(method: PaymentMethod) {
    status.value = 'processing'
    errorMessage.value = null

    try {
      const response = await processPayment({
        amount: cartStore.total,
        currency: cartStore.currency,
        method,
        orderId: checkoutStore.orderId,
        card: pendingCard.value ?? undefined,
        walletEmail: pendingWalletEmail.value ?? undefined,
      })

      if (response.status === 'requires_action' && response.actionType === '3ds') {
        status.value = 'requires_3ds'
        return
      }

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

      completeSuccess(method, response.transactionId!)
    } catch {
      status.value = 'failed'
      errorMessage.value = 'Unexpected error while processing payment.'
      checkoutStore.setFailureMessage(errorMessage.value)
    }
  }

  async function confirm3DS(otp: string) {
    if (otp.length !== 6) {
      errorMessage.value = 'Enter the 6-digit verification code.'
      return false
    }

    status.value = 'processing'
    errorMessage.value = null

    const response = await confirmThreeDS(otp)

    if (response.status === 'declined') {
      status.value = 'failed'
      errorMessage.value = response.declineMessage ?? 'Authentication failed.'
      checkoutStore.setFailureMessage(errorMessage.value)
      return false
    }

    completeSuccess('card', response.transactionId!)
    return true
  }

  function completeSuccess(method: PaymentMethod, transactionId: string) {
    status.value = 'success'

    const maskedPayment =
      method === 'card' && pendingCard.value
        ? maskCardNumber(pendingCard.value.cardNumber)
        : method === 'wallet'
          ? `Wallet · ${pendingWalletEmail.value}`
          : 'Bank transfer · Demo account'

    checkoutStore.setCompletedOrder({
      orderId: checkoutStore.orderId,
      transactionId,
      amount: cartStore.total,
      currency: cartStore.currency,
      method,
      maskedPayment,
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
    submitCardPayment,
    submitWalletPayment,
    submitBankPayment,
    confirm3DS,
    retry,
  }
}
