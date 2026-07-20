<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const checkoutStore = useCheckoutStore()

const isSuccess = computed(() => route.query.status === 'success')
const failureMessage = computed(
  () =>
    (typeof route.query.message === 'string' ? route.query.message : null) ??
    checkoutStore.lastFailureMessage,
)

const order = computed(() => checkoutStore.lastOrder)

function startOver() {
  checkoutStore.clearSession()
  sessionStorage.removeItem('checkout-ready')
  router.push({ name: 'products' })
}

function retryPayment() {
  sessionStorage.setItem('checkout-ready', 'true')
  router.push({ name: 'payment' })
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16">
    <div
      v-if="isSuccess && order"
      class="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm"
    >
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 class="mt-5 text-3xl font-bold text-slate-900">Payment successful</h1>
      <p class="mt-2 text-slate-600">Your demo transaction has been completed.</p>

      <dl class="mt-8 space-y-3 rounded-2xl bg-slate-50 p-6 text-left text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Order ID</dt>
          <dd class="font-medium text-slate-900">{{ order.orderId }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Transaction ID</dt>
          <dd class="font-mono text-xs font-medium text-slate-900">{{ order.transactionId }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Amount paid</dt>
          <dd class="font-medium text-slate-900">
            {{ formatCurrency(order.amount, order.currency) }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Payment method</dt>
          <dd class="font-medium capitalize text-slate-900">{{ order.method }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Payment detail</dt>
          <dd class="font-medium text-slate-900">{{ order.maskedPayment }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Receipt sent to</dt>
          <dd class="font-medium text-slate-900">{{ order.customerEmail }}</dd>
        </div>
      </dl>

      <BaseButton class="mt-8" @click="startOver">Start a new demo order</BaseButton>
    </div>

    <div
      v-else
      class="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm"
    >
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
        !
      </div>
      <h1 class="mt-5 text-3xl font-bold text-slate-900">Payment failed</h1>
      <p class="mt-2 text-slate-600">
        {{ failureMessage ?? 'The gateway could not complete this payment.' }}
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <BaseButton @click="retryPayment">Try again</BaseButton>
        <BaseButton variant="secondary" @click="router.push({ name: 'checkout' })">
          Edit checkout
        </BaseButton>
        <BaseButton variant="ghost" @click="startOver">Back to shop</BaseButton>
      </div>
    </div>
  </section>
</template>
