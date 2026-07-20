<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
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
  <section class="mx-auto max-w-6xl px-4 py-10">
    <div class="mb-10 max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">Mini store</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
        Simple products, advanced checkout
      </h1>
      <p class="mt-3 text-slate-600">
        Add a few items to your cart, then experience a full payment gateway flow with validation,
        3D Secure, declines, and retries.
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div
          class="flex h-40 items-center justify-center bg-gradient-to-br text-5xl"
          :class="product.gradient"
        >
          {{ product.emoji }}
        </div>
        <div class="space-y-4 p-5">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ product.name }}</h2>
            <p class="mt-2 text-sm text-slate-500">{{ product.description }}</p>
          </div>
          <div class="flex items-center justify-between gap-3">
            <p class="text-lg font-bold text-slate-900">{{ formatCurrency(product.price) }}</p>
            <BaseButton @click="addToCart(product.id)">
              {{ addedProductId === product.id ? 'Added ✓' : 'Add to cart' }}
            </BaseButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
