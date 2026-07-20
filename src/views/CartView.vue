<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CartItem from '@/components/cart/CartItem.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/formatters'

const cartStore = useCartStore()
const router = useRouter()

const isEmpty = computed(() => cartStore.lines.length === 0)

function updateQuantity(productId: string, quantity: number) {
  cartStore.setQuantity(productId, quantity)
}
</script>

<template>
  <section class="page-section max-w-4xl">
    <div class="mb-6 sm:mb-8">
      <h1 class="page-title">Your cart</h1>
      <p class="mt-2 text-sm ui-text-body sm:text-base">Review items before continuing to checkout.</p>
    </div>

    <div v-if="isEmpty" class="ui-card border-dashed p-6 text-center sm:p-10">
      <p class="text-lg font-medium ui-text-heading">Your cart is empty</p>
      <p class="mt-2 text-sm ui-text-muted">Browse products and add something to get started.</p>
      <BaseButton class="mt-6 w-full sm:w-auto" @click="router.push({ name: 'products' })">
        Browse products
      </BaseButton>
    </div>

    <template v-else>
      <div class="space-y-3 sm:space-y-4">
        <CartItem
          v-for="line in cartStore.lines"
          :key="line.productId"
          :product="line.product"
          :quantity="line.quantity"
          @increase="updateQuantity(line.productId, line.quantity + 1)"
          @decrease="updateQuantity(line.productId, line.quantity - 1)"
          @remove="cartStore.removeItem(line.productId)"
        />
      </div>

      <div class="ui-card mt-6 p-4 sm:mt-8 sm:p-6">
        <div class="flex items-center justify-between text-base font-semibold ui-text-heading sm:text-lg">
          <span>Total</span>
          <span>{{ formatCurrency(cartStore.total) }}</span>
        </div>
        <BaseButton class="mt-4 w-full sm:w-auto" @click="router.push({ name: 'checkout' })">
          Proceed to checkout
        </BaseButton>
      </div>
    </template>
  </section>
</template>
