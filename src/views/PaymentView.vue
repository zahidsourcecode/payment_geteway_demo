<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CardForm from '@/components/payment/CardForm.vue'
import OrderSummary from '@/components/payment/OrderSummary.vue'
import PaymentMethodTabs from '@/components/payment/PaymentMethodTabs.vue'
import PaymentStatusBanner from '@/components/payment/PaymentStatusBanner.vue'
import ThreeDSModal from '@/components/payment/ThreeDSModal.vue'
import WalletForm from '@/components/payment/WalletForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { usePaymentGateway } from '@/composables/usePaymentGateway'
import { testCardNumbers } from '@/services/paymentApi'
import { useCheckoutStore } from '@/stores/checkoutStore'
import type { CardFormValues, WalletFormValues } from '@/utils/validation'

const checkoutStore = useCheckoutStore()
const router = useRouter()
const payment = usePaymentGateway()

const show3DS = ref(false)

const selectedMethod = computed({
  get: () => checkoutStore.selectedMethod,
  set: (value) => {
    checkoutStore.selectedMethod = value
  },
})

watch(
  () => payment.status.value,
  (status) => {
    show3DS.value = status === 'requires_3ds'
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

async function handleCardSubmit(form: CardFormValues) {
  await payment.submitCardPayment(form)
}

async function handleWalletSubmit(form: WalletFormValues) {
  await payment.submitWalletPayment(form)
}

async function handleBankSubmit() {
  await payment.submitBankPayment()
}

async function handle3DSConfirm(otp: string) {
  const ok = await payment.confirm3DS(otp)
  if (ok) {
    show3DS.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10">
    <div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">Payment gateway</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Secure checkout</h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          This is the core demo — method selection, validation, processing states, 3D Secure, and
          failure handling.
        </p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Customer: <span class="font-medium text-slate-900">{{ checkoutStore.checkoutDetails.fullName }}</span>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-slate-900">Choose payment method</h2>
          <PaymentMethodTabs v-model="selectedMethod" />
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <PaymentStatusBanner :status="payment.status.value" :message="payment.errorMessage.value" />

          <div class="mt-4">
            <CardForm
              v-if="selectedMethod === 'card'"
              :errors="payment.fieldErrors.value"
              :disabled="payment.isBusy.value"
              @submit="handleCardSubmit"
            >
              <template #actions>
                <BaseButton
                  type="submit"
                  class="mt-2 w-full"
                  :loading="payment.isBusy.value"
                  :disabled="payment.isBusy.value"
                >
                  Pay securely
                </BaseButton>
              </template>
            </CardForm>

            <WalletForm
              v-else-if="selectedMethod === 'wallet'"
              :errors="payment.fieldErrors.value"
              :disabled="payment.isBusy.value"
              @submit="handleWalletSubmit"
            >
              <template #actions>
                <BaseButton
                  type="submit"
                  class="mt-2 w-full"
                  :loading="payment.isBusy.value"
                  :disabled="payment.isBusy.value"
                >
                  Continue with wallet
                </BaseButton>
              </template>
            </WalletForm>

            <div v-else class="space-y-4">
              <div class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Demo bank transfer — instant confirmation with no extra fields.
              </div>
              <BaseButton
                class="w-full"
                :loading="payment.isBusy.value"
                :disabled="payment.isBusy.value"
                @click="handleBankSubmit"
              >
                Pay by bank transfer
              </BaseButton>
            </div>
          </div>

          <div
            v-if="payment.status.value === 'timeout'"
            class="mt-4 flex flex-wrap gap-3"
          >
            <BaseButton @click="payment.retry()">Retry payment</BaseButton>
            <BaseButton variant="secondary" @click="router.push({ name: 'checkout' })">
              Edit checkout
            </BaseButton>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="font-semibold text-slate-900">Test card numbers</h3>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-slate-500">
                <tr>
                  <th class="pb-2 pr-4 font-medium">Number</th>
                  <th class="pb-2 font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="card in testCardNumbers" :key="card.number" class="border-t border-slate-100">
                  <td class="py-2 pr-4 font-mono text-xs text-slate-700">{{ card.number }}</td>
                  <td class="py-2 text-slate-600">{{ card.outcome }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <OrderSummary show-method :method="selectedMethod" />
        <div class="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          <p class="font-medium text-slate-900">What this demo shows</p>
          <ul class="mt-3 list-disc space-y-2 pl-5">
            <li>Luhn validation and formatted card inputs</li>
            <li>Processing, timeout, and retry flows</li>
            <li>Simulated 3D Secure challenge modal</li>
            <li>Declines with human-readable error messages</li>
          </ul>
        </div>
      </div>
    </div>

    <ThreeDSModal
      v-model:open="show3DS"
      :loading="payment.status.value === 'processing'"
      @confirm="handle3DSConfirm"
    />
  </section>
</template>
