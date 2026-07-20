<script setup lang="ts">
import { reactive } from 'vue'
import BkashLogo from '@/components/payment/BkashLogo.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

defineProps<{
  errors: Record<string, string>
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { bkashMobile: string }]
}>()

const form = reactive({
  bkashMobile: '',
})

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 dark:border-brand-800 dark:bg-brand-950/40">
      <BkashLogo height-class="h-12" class="shrink-0" />
      <p class="text-sm text-brand-900 dark:text-brand-100">
        Pay with your bKash mobile wallet. Use any valid Bangladesh number — include
        <code class="rounded bg-white px-1 dark:bg-slate-800">0000</code>
        in the number to simulate a decline.
      </p>
    </div>

    <BaseInput
      id="bkashMobile"
      v-model="form.bkashMobile"
      label="bKash mobile number"
      placeholder="01XXXXXXXXX"
      autocomplete="tel"
      maxlength="11"
      :error="errors.bkashMobile"
      :disabled="disabled"
    />

    <slot name="actions" />
  </form>
</template>
