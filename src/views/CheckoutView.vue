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
  <section class="page-section">
    <div class="mb-6 sm:mb-8">
      <h1 class="page-title">Checkout details</h1>
      <p class="mt-2 text-sm ui-text-body sm:text-base">
        Just the essentials before entering the payment gateway.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      <OrderSummary class="order-1 lg:order-2" />

      <form class="ui-card order-2 space-y-4 p-4 sm:p-6 lg:order-1" @submit.prevent="submitCheckout">
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
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <BaseButton type="submit" class="w-full sm:w-auto">Continue to payment</BaseButton>
          <BaseButton variant="secondary" type="button" class="w-full sm:w-auto" @click="router.push({ name: 'cart' })">
            Back to cart
          </BaseButton>
        </div>
      </form>
    </div>
  </section>
</template>
