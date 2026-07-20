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
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Order summary</h2>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {{ checkoutStore.orderId }}
      </span>
    </div>

    <div v-if="lines.length" class="space-y-3 border-b border-slate-100 pb-4">
      <div v-for="line in lines" :key="line.productId" class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-slate-800">{{ line.product.name }}</p>
          <p class="text-xs text-slate-500">Qty {{ line.quantity }}</p>
        </div>
        <p class="text-sm font-medium text-slate-800">
          {{ formatCurrency(line.product.price * line.quantity) }}
        </p>
      </div>
    </div>

    <div v-else class="border-b border-slate-100 pb-4 text-sm text-slate-500">
      No items in cart.
    </div>

    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between text-slate-600">
        <dt>Subtotal</dt>
        <dd>{{ formatCurrency(cartStore.subtotal) }}</dd>
      </div>
      <div class="flex justify-between text-slate-600">
        <dt>Tax (8%)</dt>
        <dd>{{ formatCurrency(cartStore.tax) }}</dd>
      </div>
      <div class="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
        <dt>Total</dt>
        <dd>{{ formatCurrency(cartStore.total) }}</dd>
      </div>
    </dl>

    <div
      v-if="showMethod && method"
      class="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
    >
      Payment method:
      <span class="font-medium capitalize text-slate-800">{{ method }}</span>
    </div>

    <div class="mt-4 flex items-center gap-2 text-xs text-slate-500">
      <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
