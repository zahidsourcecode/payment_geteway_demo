<script setup lang="ts">
import { reactive } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'

defineProps<{
  errors: Record<string, string>
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { walletEmail: string }]
}>()

const form = reactive({
  walletEmail: '',
})

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
      You will be redirected to a simulated wallet provider. Use any email — add
      <code class="rounded bg-white px-1 dark:bg-slate-800">decline</code>
      to force a failure.
    </div>

    <BaseInput
      id="walletEmail"
      v-model="form.walletEmail"
      label="Wallet email"
      placeholder="you@wallet.demo"
      autocomplete="email"
      :error="errors.walletEmail"
      :disabled="disabled"
    />

    <slot name="actions" />
  </form>
</template>
