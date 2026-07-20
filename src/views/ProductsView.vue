<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductImage from '@/components/cart/ProductImage.vue'
import { products } from '@/data/products'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/formatters'

const cartStore = useCartStore()
const addedProductId = ref<string | null>(null)

function addToCart(productId: string) {
  const product = products.find((item) => item.id === productId)
  if (!product) return
  cartStore.addItem(product)
  addedProductId.value = productId
  window.setTimeout(() => {
    if (addedProductId.value === productId) {
      addedProductId.value = null
    }
  }, 1800)
}
</script>

<template>
  <section class="page-section">
    <div class="mb-8 max-w-2xl sm:mb-10">
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Mini store</p>
      <h1 class="page-title mt-2 md:text-4xl">
        Simple products, advanced checkout
      </h1>
      <p class="mt-3 text-sm ui-text-body sm:text-base">
        Add a few items to your cart, then experience a full payment gateway flow with validation,
        3D Secure, declines, and retries.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="group ui-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-brand-950/20"
      >
        <ProductImage :product="product" size="lg" />
        <div class="space-y-4 p-4 sm:p-5">
          <div>
            <h2 class="text-lg font-semibold ui-text-heading">{{ product.name }}</h2>
            <p class="mt-2 text-sm ui-text-muted">{{ product.description }}</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-lg font-bold ui-text-heading">{{ formatCurrency(product.price) }}</p>
            <BaseButton class="w-full sm:w-auto" @click="addToCart(product.id)">
              {{ addedProductId === product.id ? 'Added ✓' : 'Add to cart' }}
            </BaseButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
