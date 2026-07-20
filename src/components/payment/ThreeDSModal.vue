<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { threeDSHint } from '@/services/paymentApi'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: [otp: string]
}>()

const otp = ref('')
const localError = ref<string | null>(null)

watch(open, (isOpen) => {
  if (isOpen) {
    otp.value = ''
    localError.value = null
  }
})

function submit() {
  if (otp.value.length !== 6) {
    localError.value = 'Enter the 6-digit verification code.'
    return
  }
  localError.value = null
  emit('confirm', otp.value)
}

watch(
  () => otp.value,
  (value) => {
    otp.value = value.replace(/\D/g, '').slice(0, 6)
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div class="mb-4 flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-xl">
            🛡️
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">3D Secure verification</h3>
            <p class="text-sm text-slate-500">Confirm this payment with your bank</p>
          </div>
        </div>

        <p class="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {{ threeDSHint }}
        </p>

        <BaseInput
          id="otp"
          v-model="otp"
          label="Verification code"
          placeholder="123456"
          maxlength="6"
          :error="localError ?? undefined"
          :disabled="props.loading"
        />

        <div class="mt-6 flex justify-end gap-3">
          <BaseButton variant="secondary" :disabled="props.loading" @click="open = false">
            Cancel
          </BaseButton>
          <BaseButton :loading="props.loading" @click="submit">Verify & pay</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
