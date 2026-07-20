<script setup lang="ts">
import type { Product } from '@/types'

withDefaults(
  defineProps<{
    product: Product
    size?: 'sm' | 'lg'
  }>(),
  { size: 'lg' },
)
</script>

<template>
  <div
    class="overflow-hidden"
    :class="
      size === 'lg'
        ? 'flex h-40 items-center justify-center bg-white dark:bg-slate-800'
        : 'flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800'
    "
  >
    <img
      v-if="product.image"
      :src="product.image"
      :alt="product.name"
      class="object-contain transition-transform duration-300 ease-out"
      :class="size === 'lg' ? 'h-full w-full p-4 group-hover:scale-105' : 'h-full w-full p-1.5'"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-gradient-to-br"
      :class="[product.gradient, size === 'lg' ? 'text-5xl' : 'rounded-xl text-3xl']"
    >
      {{ product.emoji }}
    </div>
  </div>
</template>
