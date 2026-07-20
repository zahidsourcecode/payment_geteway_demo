<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { formatCardNumber, formatExpiry } from '@/utils/formatters'
import { getCardBrand } from '@/utils/cardValidation'

const props = defineProps<{
  errors: Record<string, string>
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [
    payload: {
      cardNumber: string
      expiry: string
      cvv: string
      cardholderName: string
    },
  ]
}>()

const form = reactive({
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardholderName: '',
})

const cardBrand = computed(() => getCardBrand(form.cardNumber))

watch(
  () => form.cardNumber,
  (value) => {
    form.cardNumber = formatCardNumber(value)
  },
)

watch(
  () => form.expiry,
  (value) => {
    form.expiry = formatExpiry(value)
  },
)

watch(
  () => form.cvv,
  (value) => {
    form.cvv = value.replace(/\D/g, '').slice(0, 4)
  },
)

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="flex items-center justify-between rounded-xl ui-surface-muted px-4 py-3">
      <p class="text-sm ui-text-body">Card network</p>
      <p class="text-sm font-semibold ui-text-heading">{{ cardBrand }}</p>
    </div>

    <BaseInput
      id="cardNumber"
      v-model="form.cardNumber"
      label="Card number"
      placeholder="XXXX XXXX XXXX XXXX"
      autocomplete="cc-number"
      type="tel"
      inputmode="numeric"
      maxlength="19"
      :error="props.errors.cardNumber"
      :disabled="disabled"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <BaseInput
        id="expiry"
        v-model="form.expiry"
        label="Expiry"
        placeholder="MM/YY"
        autocomplete="cc-exp"
        maxlength="5"
        :error="props.errors.expiry"
        :disabled="disabled"
      />
      <BaseInput
        id="cvv"
        v-model="form.cvv"
        label="CVV"
        placeholder="123"
        autocomplete="cc-csc"
        maxlength="4"
        :error="props.errors.cvv"
        :disabled="disabled"
      />
    </div>

    <BaseInput
      id="cardholderName"
      v-model="form.cardholderName"
      label="Cardholder name"
      placeholder="Jane Doe"
      autocomplete="cc-name"
      :error="props.errors.cardholderName"
      :disabled="disabled"
    />

    <slot name="actions" />
  </form>
</template>
