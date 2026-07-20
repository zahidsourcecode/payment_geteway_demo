<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrderSummary from '@/components/payment/OrderSummary.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useCartStore } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { checkoutSchema, formatZodErrors } from '@/utils/validation'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const router = useRouter()

const errors = ref<Record<string, string>>({})
const form = reactive({ ...checkoutStore.checkoutDetails })

function submitCheckout() {
  errors.value = {}
  const parsed = checkoutSchema.safeParse(form)

  if (!parsed.success) {
    errors.value = formatZodErrors(parsed.error)
    return
  }

  if (cartStore.lines.length === 0) {
    router.push({ name: 'products' })
    return
  }

  checkoutStore.updateCheckoutDetails(parsed.data)
  checkoutStore.resetOrder()
  sessionStorage.setItem('checkout-ready', 'true')
  router.push({ name: 'payment' })
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Checkout details</h1>
      <p class="mt-2 text-slate-600">Just the essentials before entering the payment gateway.</p>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        @submit.prevent="submitCheckout"
      >
        <BaseInput
          id="email"
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          :error="errors.email"
        />
        <BaseInput
          id="fullName"
          v-model="form.fullName"
          label="Full name"
          placeholder="Jane Doe"
          autocomplete="name"
          :error="errors.fullName"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            id="country"
            v-model="form.country"
            label="Country"
            placeholder="United States"
            autocomplete="country-name"
            :error="errors.country"
          />
          <BaseInput
            id="postalCode"
            v-model="form.postalCode"
            label="Postal code"
            placeholder="10001"
            autocomplete="postal-code"
            :error="errors.postalCode"
          />
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <BaseButton type="submit">Continue to payment</BaseButton>
          <BaseButton variant="secondary" type="button" @click="router.push({ name: 'cart' })">
            Back to cart
          </BaseButton>
        </div>
      </form>

      <OrderSummary />
    </div>
  </section>
</template>
