<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { developer } from '@/data/developer'

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

      <nav
        class="hidden items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 md:inline-flex dark:border-slate-700 dark:bg-slate-800/80"
        aria-label="Main menu"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
          active-class="router-link-active !bg-white !text-brand-600 shadow-sm dark:!bg-slate-900 dark:!text-brand-400"
        >
          {{ link.label }}
          <span
            v-if="link.label === 'Cart' && itemCount > 0"
            class="inline-flex min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-semibold text-white"
          >
            {{ itemCount }}
          </span>
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
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
        <ThemeToggle />
        <a
          :href="developer.portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group hidden cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-600 sm:inline-flex"
          title="View developer portfolio"
        >
          <div class="h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-2 ring-brand-100 dark:ring-brand-900">
            <img
              :src="developer.photoUrl"
              :alt="developer.name"
              class="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </div>
          <div class="text-left">
            <p class="text-[10px] font-medium uppercase tracking-wide ui-text-muted">About developer</p>
            <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">{{ developer.name }}</p>
          </div>
        </a>
      </div>
    </div>
  </header>
</template>
