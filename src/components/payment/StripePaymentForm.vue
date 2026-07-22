<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import BaseButton from '@/components/ui/BaseButton.vue'
import { createPaymentIntent } from '@/services/stripeApi'
import { useErrorLogStore } from '@/stores/errorLogStore'
import { getErrorDetails } from '@/utils/errors'

const props = defineProps<{
  amount: number
  currency: string
  orderId: string
  email: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  success: [payload: { transactionId: string; maskedPayment: string }]
  failed: [message: string]
  processing: []
}>()

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const errorLogStore = useErrorLogStore()
const paymentElementRef = ref<HTMLDivElement | null>(null)

const isReady = ref(false)
const isLoading = ref(true)
const setupError = ref<string | null>(null)
const paymentError = ref<string | null>(null)
const isSubmitting = ref(false)

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let paymentElement: StripePaymentElement | null = null

async function initializeStripe() {
  if (!publishableKey) {
    setupError.value =
      'Stripe publishable key is missing. Copy .env.example to .env and add your test keys.'
    errorLogStore.addError({ source: 'stripe', message: setupError.value })
    isLoading.value = false
    return
  }

  if (!paymentElementRef.value) return

  isLoading.value = true
  setupError.value = null
  paymentError.value = null
  isReady.value = false

  destroyPaymentElement()

  try {
    const { clientSecret } = await createPaymentIntent({
      amount: props.amount,
      currency: props.currency,
      orderId: props.orderId,
      email: props.email,
    })

    stripe = await loadStripe(publishableKey)
    if (!stripe) {
      throw new Error('Unable to load Stripe.js')
    }

    elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: document.documentElement.classList.contains('dark') ? 'night' : 'stripe',
        variables: {
          colorPrimary: '#4ebdd3',
          borderRadius: '12px',
        },
      },
    })

    paymentElement = elements.create('payment')
    paymentElement.mount(paymentElementRef.value)
    isReady.value = true
  } catch (error) {
    setupError.value =
      error instanceof Error
        ? error.message
        : 'Failed to initialize Stripe. Is the API server running?'
    errorLogStore.addError({
      source: 'stripe',
      message: setupError.value,
      details: getErrorDetails(error),
    })
  } finally {
    isLoading.value = false
  }
}

function destroyPaymentElement() {
  paymentElement?.destroy()
  paymentElement = null
  elements = null
  stripe = null
}

async function handleSubmit() {
  if (!stripe || !elements || !isReady.value || isSubmitting.value) return

  isSubmitting.value = true
  paymentError.value = null
  emit('processing')

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      receipt_email: props.email,
      payment_method_data: {
        billing_details: {
          email: props.email,
        },
      },
    },
    redirect: 'if_required',
  })

  isSubmitting.value = false

  if (error) {
    paymentError.value = error.message ?? 'Payment failed.'
    emit('failed', paymentError.value)
    return
  }

  if (paymentIntent?.status === 'succeeded') {
    emit('success', {
      transactionId: paymentIntent.id,
      maskedPayment: 'Stripe · Card',
    })
    return
  }

  paymentError.value = 'Payment could not be completed. Please try again.'
  emit('failed', paymentError.value)
}

watch(
  () => [props.amount, props.orderId],
  () => {
    void initializeStripe()
  },
)

onMounted(() => {
  void initializeStripe()
})

onBeforeUnmount(() => {
  destroyPaymentElement()
})
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="!publishableKey || setupError"
      class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <p class="font-medium">Stripe test mode setup required</p>
      <p class="mt-1">
        {{ setupError ?? 'Add VITE_STRIPE_PUBLISHABLE_KEY to .env and run npm run dev.' }}
      </p>
    </div>

    <div
      v-if="isLoading"
      class="rounded-xl ui-surface-muted px-4 py-8 text-center text-sm ui-text-muted"
    >
      Loading Stripe payment form…
    </div>

    <div ref="paymentElementRef" class="min-h-[12rem]" :class="{ hidden: isLoading || setupError }" />

    <p v-if="paymentError" class="text-sm text-red-600 dark:text-red-400">{{ paymentError }}</p>

    <BaseButton
      type="button"
      class="w-full"
      :loading="isSubmitting"
      :disabled="disabled || !isReady || isLoading || Boolean(setupError)"
      @click="handleSubmit"
    >
      Pay with Stripe
    </BaseButton>

    <p class="text-xs ui-text-muted">
      Secured by Stripe test mode — use test cards only. No real charges are made with test keys.
    </p>
  </div>
</template>
