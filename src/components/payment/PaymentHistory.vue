<script setup lang="ts">
import { computed } from 'vue'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { formatCurrency } from '@/utils/formatters'

const checkoutStore = useCheckoutStore()

const history = computed(() => [...checkoutStore.paymentHistory].reverse())

function formatTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(iso))
}

function methodLabel(method: string) {
  return method === 'bkash' ? 'bKash' : 'Stripe'
}
</script>

<template>
  <div class="ui-card p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold ui-text-heading">Payment history</h2>
        <p class="mt-1 text-xs ui-text-muted">This session only — cleared on page reload.</p>
      </div>
      <span
        v-if="history.length"
        class="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300"
      >
        {{ history.length }}
      </span>
    </div>

    <div
      v-if="!history.length"
      class="mt-4 rounded-xl ui-surface-muted px-4 py-6 text-center text-sm ui-text-muted"
    >
      No completed payments yet. Successful transactions will appear here.
    </div>

    <ul v-else class="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
      <li
        v-for="entry in history"
        :key="entry.transactionId"
        class="rounded-xl border ui-border-subtle p-3 text-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-medium ui-text-heading">{{ formatCurrency(entry.amount, entry.currency) }}</p>
            <p class="mt-0.5 text-xs ui-text-muted">{{ entry.orderId }}</p>
          </div>
          <span
            class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          >
            Paid
          </span>
        </div>

        <dl class="mt-3 grid gap-1.5 text-xs">
          <div class="flex justify-between gap-3">
            <dt class="ui-text-muted">Method</dt>
            <dd class="font-medium ui-text-heading">{{ methodLabel(entry.method) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="ui-text-muted">Detail</dt>
            <dd class="truncate font-medium ui-text-heading">{{ entry.maskedPayment }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="ui-text-muted">Time</dt>
            <dd class="font-medium ui-text-heading">{{ formatTime(entry.completedAt) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="ui-text-muted">Transaction</dt>
            <dd class="truncate font-mono text-[11px] font-medium ui-text-heading">{{ entry.transactionId }}</dd>
          </div>
        </dl>
      </li>
    </ul>
  </div>
</template>
