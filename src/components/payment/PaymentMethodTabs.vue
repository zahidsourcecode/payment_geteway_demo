<script setup lang="ts">
import BkashLogo from '@/components/payment/BkashLogo.vue'
import type { PaymentMethod } from '@/types'

const model = defineModel<PaymentMethod>({ required: true })

const emit = defineEmits<{
  showTestInfo: [method: PaymentMethod]
}>()

const cardIconClass = 'h-12 w-full max-w-[11rem] object-contain object-left sm:h-14'

const methods: Array<{
  id: PaymentMethod
  label: string
  description: string
  image?: string
  useBkashLogo?: boolean
  testInfoLabel: string
}> = [
  {
    id: 'stripe',
    label: 'Stripe',
    description: 'Visa, Mastercard, Amex — test mode',
    image: '/images/card-icon.png',
    testInfoLabel: 'Show Stripe test cards',
  },
  {
    id: 'bkash',
    label: 'bKash',
    description: 'Mobile financial service',
    useBkashLogo: true,
    testInfoLabel: 'Show bKash sandbox test info',
  },
]

function openTestInfo(method: PaymentMethod, event: MouseEvent) {
  event.stopPropagation()
  emit('showTestInfo', method)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div
      v-for="method in methods"
      :key="method.id"
      role="button"
      tabindex="0"
      class="relative cursor-pointer rounded-2xl border p-3 pr-12 text-left transition sm:p-4 sm:pr-14"
      :class="
        model === method.id
          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100 dark:border-brand-400 dark:bg-brand-950/40 dark:ring-brand-900'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
      "
      @click="model = method.id"
      @keydown.enter="model = method.id"
      @keydown.space.prevent="model = method.id"
    >
      <button
        type="button"
        class="hint-bulb-glow absolute right-3 top-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-100 text-base transition hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:bg-brand-950 dark:hover:bg-brand-900"
        :aria-label="method.testInfoLabel"
        :title="method.testInfoLabel"
        @click="openTestInfo(method.id, $event)"
      >
        💡
      </button>

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
    </div>
  </div>
</template>
