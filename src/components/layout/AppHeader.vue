<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'

const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)

const navLinks = [
  { label: 'Shop', to: { name: 'products' } },
  { label: 'Cart', to: { name: 'cart' } },
  { label: 'Checkout', to: { name: 'checkout' } },
  { label: 'Payment', to: { name: 'payment' } },
]
</script>

<template>
  <header class="border-b ui-chrome">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
      <RouterLink to="/" class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm"
        >
          PF
        </div>
        <div>
          <p class="text-lg font-semibold ui-text-heading">PayFlow</p>
          <p class="text-xs ui-text-muted">Payment Gateway Demo</p>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-6 md:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="text-sm font-medium ui-text-body transition hover:text-brand-600 dark:hover:text-brand-400"
          active-class="!text-brand-600 dark:!text-brand-400"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <RouterLink
          to="/cart"
          class="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:text-brand-400"
        >
          Cart
          <span
            v-if="itemCount > 0"
            class="inline-flex min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-semibold text-white"
          >
            {{ itemCount }}
          </span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
