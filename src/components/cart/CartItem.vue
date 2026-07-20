<script setup lang="ts">
import ProductImage from '@/components/cart/ProductImage.vue'
import { formatCurrency } from '@/utils/formatters'
import type { Product } from '@/types'

defineProps<{
  product: Product
  quantity: number
}>()

const emit = defineEmits<{
  increase: []
  decrease: []
  remove: []
}>()
</script>

<template>
  <article class="ui-card flex gap-4 p-4">
    <ProductImage :product="product" size="sm" />

    <div class="flex flex-1 flex-col justify-between">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold ui-text-heading">{{ product.name }}</h3>
          <p class="mt-1 text-sm ui-text-muted">{{ formatCurrency(product.price) }} each</p>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 transition hover:text-red-500 dark:hover:text-red-400"
          @click="emit('remove')"
        >
          Remove
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <div class="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            class="px-3 py-1.5 text-sm ui-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-l-lg"
            @click="emit('decrease')"
          >
            −
          </button>
          <span class="min-w-8 text-center text-sm font-medium ui-text-heading">{{ quantity }}</span>
          <button
            type="button"
            class="px-3 py-1.5 text-sm ui-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg"
            @click="emit('increase')"
          >
            +
          </button>
        </div>
        <p class="font-semibold ui-text-heading">
          {{ formatCurrency(product.price * quantity) }}
        </p>
      </div>
    </div>
  </article>
</template>
