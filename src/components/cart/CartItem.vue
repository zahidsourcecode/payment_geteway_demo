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
  <article class="ui-card flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
    <ProductImage :product="product" size="sm" />

    <div class="flex flex-1 flex-col justify-between">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold ui-text-heading">{{ product.name }}</h3>
          <p class="mt-1 text-sm ui-text-muted">{{ formatCurrency(product.price) }} each</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-red-500 dark:hover:text-red-400"
          aria-label="Remove item"
          @click="emit('remove')"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <div class="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            class="min-h-10 min-w-10 px-3 py-2 text-sm ui-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-l-lg"
            @click="emit('decrease')"
          >
            −
          </button>
          <span class="min-w-8 text-center text-sm font-medium ui-text-heading">{{ quantity }}</span>
          <button
            type="button"
            class="min-h-10 min-w-10 px-3 py-2 text-sm ui-text-body hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg"
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
