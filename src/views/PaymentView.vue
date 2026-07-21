<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BkashForm from '@/components/payment/BkashForm.vue'
import OrderSummary from '@/components/payment/OrderSummary.vue'
import PaymentHistory from '@/components/payment/PaymentHistory.vue'
import PaymentMethodTabs from '@/components/payment/PaymentMethodTabs.vue'
import PaymentStatusBanner from '@/components/payment/PaymentStatusBanner.vue'
import StripePaymentForm from '@/components/payment/StripePaymentForm.vue'
import StripeTestCardsModal from '@/components/payment/StripeTestCardsModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { usePaymentGateway } from '@/composables/usePaymentGateway'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import type { BkashFormValues } from '@/utils/validation'

const showTestCardsModal = ref(false)

const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const router = useRouter()
const payment = usePaymentGateway()

const selectedMethod = computed({
  get: () => checkoutStore.selectedMethod,
  set: (value) => {
    checkoutStore.selectedMethod = value
  },
})

watch(
  () => payment.status.value,
  (status) => {
    if (status === 'success') {
      sessionStorage.removeItem('checkout-ready')
      router.push({ name: 'payment-result', query: { status: 'success' } })
    }
    if (status === 'failed') {
      sessionStorage.removeItem('checkout-ready')
      router.push({
        name: 'payment-result',
        query: { status: 'failed', message: payment.errorMessage.value ?? undefined },
      })
    }
  },
)

async function handleBkashSubmit(form: BkashFormValues) {
  await payment.submitBkashPayment(form)
}

function handleStripeProcessing() {
  payment.setProcessing()
}

function handleStripeSuccess(payload: { transactionId: string; maskedPayment: string }) {
  payment.completeStripeSuccess(payload.transactionId, payload.maskedPayment)
}

function handleStripeFailed(message: string) {
  payment.completeStripeFailure(message)
}
</script>

<template>
  <section class="page-section">
    <div class="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Payment gateway
        </p>
        <h1 class="page-title mt-2">Secure checkout</h1>
        <p class="mt-2 max-w-2xl text-sm ui-text-body sm:text-base">
          Pay with Stripe test mode or try the simulated bKash wallet flow.
        </p>
      </div>
      <div class="ui-card w-full rounded-xl px-4 py-3 text-sm ui-text-body md:w-auto">
        Customer:
        <span class="font-medium ui-text-heading">{{ checkoutStore.checkoutDetails.fullName }}</span>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <div class="order-2 space-y-4 sm:space-y-6 lg:order-1">
        <div class="ui-card p-4 sm:p-6">
          <div class="mb-4 flex items-center gap-2">
            <h2 class="text-lg font-semibold ui-text-heading">Choose payment method</h2>
            <button
              type="button"
              class="hint-bulb-glow inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-100 text-base transition hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:bg-brand-950 dark:hover:bg-brand-900"
              aria-label="Show Stripe test cards"
              title="Stripe test cards"
              @click="showTestCardsModal = true"
            >
              💡
            </button>
          </div>
          <PaymentMethodTabs v-model="selectedMethod" />
        </div>

        <StripeTestCardsModal v-model:open="showTestCardsModal" />

        <div class="ui-card p-4 sm:p-6">
          <PaymentStatusBanner :status="payment.status.value" :message="payment.errorMessage.value" />

          <div class="mt-4">
            <StripePaymentForm
              v-if="selectedMethod === 'stripe'"
              :amount="cartStore.total"
              :currency="cartStore.currency"
              :order-id="checkoutStore.orderId"
              :email="checkoutStore.checkoutDetails.email"
              :disabled="payment.isBusy.value"
              @processing="handleStripeProcessing"
              @success="handleStripeSuccess"
              @failed="handleStripeFailed"
            />

            <BkashForm
              v-else
              :errors="payment.fieldErrors.value"
              :disabled="payment.isBusy.value"
              @submit="handleBkashSubmit"
            >
              <template #actions>
                <BaseButton
                  type="submit"
                  class="mt-2 w-full"
                  :loading="payment.isBusy.value"
                  :disabled="payment.isBusy.value"
                >
                  Pay with bKash
                </BaseButton>
              </template>
            </BkashForm>
          </div>

          <div
            v-if="payment.status.value === 'timeout'"
            class="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <BaseButton class="w-full sm:w-auto" @click="payment.retry()">Retry payment</BaseButton>
            <BaseButton variant="secondary" class="w-full sm:w-auto" @click="router.push({ name: 'checkout' })">
              Edit checkout
            </BaseButton>
          </div>
        </div>

      </div>

      <div class="order-1 space-y-4 lg:order-2">
        <OrderSummary show-method :method="selectedMethod" />
        <PaymentHistory />
        <div class="ui-card p-4 text-sm ui-text-body sm:p-5">
          <p class="font-medium ui-text-heading">What this demo shows</p>
          <ul class="mt-3 list-disc space-y-2 pl-5">
            <li>Stripe Payment Element in test mode</li>
            <li>Server-side PaymentIntent creation</li>
            <li>Real 3D Secure handling via Stripe.js</li>
            <li>Simulated bKash wallet for local payment UX</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
