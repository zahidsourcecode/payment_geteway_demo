import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckoutDetails, CompletedOrder, PaymentMethod } from '@/types'
import { generateOrderId } from '@/utils/formatters'

const defaultCheckout: CheckoutDetails = {
  email: '',
  fullName: '',
  country: 'United States',
  postalCode: '',
}

export const useCheckoutStore = defineStore('checkout', () => {
  const orderId = ref(generateOrderId())
  const checkoutDetails = ref<CheckoutDetails>({ ...defaultCheckout })
  const selectedMethod = ref<PaymentMethod>('stripe')
  const lastOrder = ref<CompletedOrder | null>(null)
  const lastFailureMessage = ref<string | null>(null)

  function updateCheckoutDetails(details: Partial<CheckoutDetails>) {
    checkoutDetails.value = { ...checkoutDetails.value, ...details }
  }

  function resetOrder() {
    orderId.value = generateOrderId()
    lastFailureMessage.value = null
  }

  function setCompletedOrder(order: CompletedOrder) {
    lastOrder.value = order
    lastFailureMessage.value = null
  }

  function setFailureMessage(message: string) {
    lastFailureMessage.value = message
    lastOrder.value = null
  }

  function clearSession() {
    checkoutDetails.value = { ...defaultCheckout }
    selectedMethod.value = 'stripe'
    lastOrder.value = null
    lastFailureMessage.value = null
    orderId.value = generateOrderId()
  }

  return {
    orderId,
    checkoutDetails,
    selectedMethod,
    lastOrder,
    lastFailureMessage,
    updateCheckoutDetails,
    resetOrder,
    setCompletedOrder,
    setFailureMessage,
    clearSession,
  }
})
