<script setup lang="ts">
import type { PaymentMethod } from '@/types'

const model = defineModel<PaymentMethod>({ required: true })

const methods: Array<{ id: PaymentMethod; label: string; description: string; icon: string }> = [
  { id: 'card', label: 'Card', description: 'Visa, Mastercard, Amex', icon: '💳' },
  { id: 'wallet', label: 'Wallet', description: 'PayPal-style demo wallet', icon: '👛' },
  { id: 'bank', label: 'Bank', description: 'Instant bank transfer demo', icon: '🏦' },
]
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <button
      v-for="method in methods"
      :key="method.id"
      type="button"
      class="rounded-2xl border p-4 text-left transition"
      :class="
        model === method.id
          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100 dark:border-brand-400 dark:bg-brand-950/40 dark:ring-brand-900'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
      "
      @click="model = method.id"
    >
      <div class="mb-2 text-2xl">{{ method.icon }}</div>
      <p class="font-semibold ui-text-heading">{{ method.label }}</p>
      <p class="mt-1 text-xs ui-text-muted">{{ method.description }}</p>
    </button>
  </div>
</template>
