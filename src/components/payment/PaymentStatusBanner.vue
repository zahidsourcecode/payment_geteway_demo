<script setup lang="ts">
import type { PaymentFlowStatus } from '@/types'

defineProps<{
  status: PaymentFlowStatus
  message?: string | null
}>()

const statusCopy: Record<
  Exclude<PaymentFlowStatus, 'idle' | 'success'>,
  { title: string; tone: 'info' | 'error' | 'warning' }
> = {
  validating: { title: 'Validating payment details…', tone: 'info' },
  processing: { title: 'Securing your payment…', tone: 'info' },
  requires_3ds: { title: 'Additional authentication required', tone: 'warning' },
  failed: { title: 'Payment failed', tone: 'error' },
  timeout: { title: 'Gateway timeout', tone: 'warning' },
}
</script>

<template>
  <div
    v-if="status !== 'idle' && status !== 'success'"
    class="rounded-xl border px-4 py-3 text-sm"
    :class="{
      'border-sky-200 bg-sky-50 text-sky-900': statusCopy[status]?.tone === 'info',
      'border-red-200 bg-red-50 text-red-900': statusCopy[status]?.tone === 'error',
      'border-amber-200 bg-amber-50 text-amber-900': statusCopy[status]?.tone === 'warning',
    }"
  >
    <p class="font-medium">{{ statusCopy[status]?.title }}</p>
    <p v-if="message" class="mt-1">{{ message }}</p>
  </div>
</template>
