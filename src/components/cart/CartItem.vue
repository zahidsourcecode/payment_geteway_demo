<script setup lang="ts">
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
  <article class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div
      class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-3xl"
      :class="product.gradient"
    >
      {{ product.emoji }}
    </div>

    <div class="flex flex-1 flex-col justify-between">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold text-slate-900">{{ product.name }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ formatCurrency(product.price) }} each</p>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 transition hover:text-red-500"
          @click="emit('remove')"
        >
          Remove
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <div class="inline-flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            class="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            @click="emit('decrease')"
          >
            −
          </button>
          <span class="min-w-8 text-center text-sm font-medium">{{ quantity }}</span>
          <button
            type="button"
            class="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            @click="emit('increase')"
          >
            +
          </button>
        </div>
        <p class="font-semibold text-slate-900">
          {{ formatCurrency(product.price * quantity) }}
        </p>
      </div>
    </div>
  </article>
</template>
