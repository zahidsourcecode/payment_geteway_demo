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
  <section class="mx-auto max-w-3xl px-4 py-8 sm:py-16">
    <div
      v-if="isSuccess && order"
      class="ui-card rounded-2xl border-emerald-200 p-5 text-center sm:rounded-3xl sm:p-8 dark:border-emerald-800"
    >
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl sm:h-16 sm:w-16 sm:text-3xl dark:bg-emerald-950">
        ✓
      </div>
      <h1 class="page-title mt-4 sm:mt-5">Payment successful</h1>
      <p class="mt-2 text-sm ui-text-body sm:text-base">Your demo transaction has been completed.</p>

      <dl class="mt-6 space-y-3 rounded-2xl ui-surface-muted p-4 text-left text-sm sm:mt-8 sm:p-6">
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Order ID</dt>
          <dd class="font-medium ui-text-heading sm:text-right">{{ order.orderId }}</dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Transaction ID</dt>
          <dd class="break-all font-mono text-xs font-medium ui-text-heading sm:text-right">{{ order.transactionId }}</dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Amount paid</dt>
          <dd class="font-medium ui-text-heading sm:text-right">
            {{ formatCurrency(order.amount, order.currency) }}
          </dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Payment method</dt>
          <dd class="font-medium capitalize ui-text-heading sm:text-right">{{ order.method }}</dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Payment detail</dt>
          <dd class="font-medium ui-text-heading sm:text-right">{{ order.maskedPayment }}</dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt class="ui-text-muted">Receipt sent to</dt>
          <dd class="break-all font-medium ui-text-heading sm:text-right">{{ order.customerEmail }}</dd>
        </div>
      </dl>

      <BaseButton class="mt-6 w-full sm:mt-8 sm:w-auto" @click="startOver">Start a new demo order</BaseButton>
    </div>

    <div v-else class="ui-card rounded-2xl border-red-200 p-5 text-center sm:rounded-3xl sm:p-8 dark:border-red-800">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl sm:h-16 sm:w-16 sm:text-3xl dark:bg-red-950">
        !
      </div>
      <h1 class="page-title mt-4 sm:mt-5">Payment failed</h1>
      <p class="mt-2 text-sm ui-text-body sm:text-base">
        {{ failureMessage ?? 'The gateway could not complete this payment.' }}
      </p>

      <div class="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center">
        <BaseButton class="w-full sm:w-auto" @click="retryPayment">Try again</BaseButton>
        <BaseButton variant="secondary" class="w-full sm:w-auto" @click="router.push({ name: 'checkout' })">
          Edit checkout
        </BaseButton>
        <BaseButton variant="ghost" class="w-full sm:w-auto" @click="startOver">Back to shop</BaseButton>
      </div>
    </div>
  </section>
</template>
