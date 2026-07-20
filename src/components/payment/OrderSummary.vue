<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { formatCurrency } from '@/utils/formatters'
import type { PaymentMethod } from '@/types'

defineProps<{
  showMethod?: boolean
  method?: PaymentMethod
}>()

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const lines = computed(() => cartStore.lines)
</script>

<template>
  <div class="ui-card p-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold ui-text-heading">Order summary</h2>
      <span class="rounded-full ui-surface-muted px-3 py-1 text-xs font-medium ui-text-muted">
        {{ checkoutStore.orderId }}
      </span>
    </div>

    <div v-if="lines.length" class="space-y-3 border-b ui-border-subtle pb-4">
      <div v-for="line in lines" :key="line.productId" class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ line.product.name }}</p>
          <p class="text-xs ui-text-muted">Qty {{ line.quantity }}</p>
        </div>
        <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
          {{ formatCurrency(line.product.price * line.quantity) }}
        </p>
      </div>
    </div>

    <div v-else class="border-b ui-border-subtle pb-4 text-sm ui-text-muted">
      No items in cart.
    </div>

    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between ui-text-body">
        <dt>Subtotal</dt>
        <dd>{{ formatCurrency(cartStore.subtotal) }}</dd>
      </div>
      <div class="flex justify-between ui-text-body">
        <dt>Tax (8%)</dt>
        <dd>{{ formatCurrency(cartStore.tax) }}</dd>
      </div>
      <div class="flex justify-between border-t ui-border-subtle pt-3 text-base font-semibold ui-text-heading">
        <dt>Total</dt>
        <dd>{{ formatCurrency(cartStore.total) }}</dd>
      </div>
    </dl>

    <div
      v-if="showMethod && method"
      class="mt-4 rounded-xl ui-surface-muted px-4 py-3 text-sm ui-text-body"
    >
      Payment method:
      <span class="font-medium capitalize text-slate-800 dark:text-slate-200">{{ method }}</span>
    </div>

    <div class="mt-4 flex items-center gap-2 text-xs ui-text-muted">
      <svg class="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      Secured with 256-bit SSL encryption (demo)
    </div>
  </div>
</template>
