<script setup lang="ts">
import BkashLogo from '@/components/payment/BkashLogo.vue'
import type { PaymentMethod } from '@/types'

const model = defineModel<PaymentMethod>({ required: true })

const cardIconClass = 'h-14 w-[11rem] object-contain object-left'

const methods: Array<{
  id: PaymentMethod
  label: string
  description: string
  image?: string
  useBkashLogo?: boolean
}> = [
  {
    id: 'stripe',
    label: 'Stripe',
    description: 'Visa, Mastercard, Amex — test mode',
    image: '/images/card-icon.png',
  },
  {
    id: 'bkash',
    label: 'bKash',
    description: 'Mobile financial service',
    useBkashLogo: true,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
      <div
        class="mb-3 flex items-center"
        :class="method.useBkashLogo ? 'h-11 w-[9rem]' : 'h-14 w-[11rem]'"
      >
        <BkashLogo v-if="method.useBkashLogo" height-class="h-11 w-[9rem]" />
        <img
          v-else-if="method.image"
          :src="method.image"
          :alt="method.label"
          :class="cardIconClass"
        />
      </div>
      <p v-if="!method.useBkashLogo" class="font-semibold ui-text-heading">{{ method.label }}</p>
      <p class="mt-1 text-xs ui-text-muted">{{ method.description }}</p>
    </button>
  </div>
</template>
