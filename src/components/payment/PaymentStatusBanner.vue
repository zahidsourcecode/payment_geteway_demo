<script setup lang="ts">
import type { PaymentFlowStatus } from '@/types'

defineProps<{
  status: PaymentFlowStatus
  message?: string | null
}>()

const statusCopy: Record<
  Exclude<PaymentFlowStatus, 'idle' | 'success'>,
  { title: string; tone: 'info' | 'error' }
> = {
  validating: { title: 'Validating payment details…', tone: 'info' },
  processing: { title: 'Securing your payment…', tone: 'info' },
  failed: { title: 'Payment failed', tone: 'error' },
}
</script>

<template>
  <div
    v-if="status !== 'idle' && status !== 'success'"
    class="rounded-xl border px-4 py-3 text-sm"
    :class="{
      'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-100':
        statusCopy[status]?.tone === 'info',
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200':
        statusCopy[status]?.tone === 'error',
    }"
  >
    <p class="font-medium">{{ statusCopy[status]?.title }}</p>
    <p v-if="message" class="mt-1">{{ message }}</p>
  </div>
</template>
