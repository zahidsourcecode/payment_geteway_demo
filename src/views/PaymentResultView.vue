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
      class="ui-card rounded-3xl border-emerald-200 p-8 text-center dark:border-emerald-800"
    >
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-950">
        ✓
      </div>
      <h1 class="mt-5 text-3xl font-bold ui-text-heading">Payment successful</h1>
      <p class="mt-2 ui-text-body">Your demo transaction has been completed.</p>

      <dl class="mt-8 space-y-3 rounded-2xl ui-surface-muted p-6 text-left text-sm">
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Order ID</dt>
          <dd class="font-medium ui-text-heading">{{ order.orderId }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Transaction ID</dt>
          <dd class="font-mono text-xs font-medium ui-text-heading">{{ order.transactionId }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Amount paid</dt>
          <dd class="font-medium ui-text-heading">
            {{ formatCurrency(order.amount, order.currency) }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Payment method</dt>
          <dd class="font-medium capitalize ui-text-heading">{{ order.method }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Payment detail</dt>
          <dd class="font-medium ui-text-heading">{{ order.maskedPayment }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="ui-text-muted">Receipt sent to</dt>
          <dd class="font-medium ui-text-heading">{{ order.customerEmail }}</dd>
        </div>
      </dl>

      <BaseButton class="mt-8" @click="startOver">Start a new demo order</BaseButton>
    </div>

    <div v-else class="ui-card rounded-3xl border-red-200 p-8 text-center dark:border-red-800">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl dark:bg-red-950">
        !
      </div>
      <h1 class="mt-5 text-3xl font-bold ui-text-heading">Payment failed</h1>
      <p class="mt-2 ui-text-body">
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
