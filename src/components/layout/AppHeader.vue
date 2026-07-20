<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { developer } from '@/data/developer'

const cartStore = useCartStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

const itemCount = computed(() => cartStore.itemCount)

const navLinks = [
  { label: 'Shop', to: { name: 'products' } },
  { label: 'Cart', to: { name: 'cart' } },
  { label: 'Checkout', to: { name: 'checkout' } },
  { label: 'Payment', to: { name: 'payment' } },
]

const navLinkClass =
  'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'

const navActiveClass =
  'router-link-active !bg-white !text-brand-600 shadow-sm dark:!bg-slate-900 dark:!text-brand-400'

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  },
)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b ui-chrome">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:py-4">
      <RouterLink to="/" class="flex min-w-0 items-center gap-2 sm:gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm sm:h-10 sm:w-10"
        >
          PF
        </div>
        <div class="min-w-0">
          <p class="truncate text-base font-semibold ui-text-heading sm:text-lg">PayFlow</p>
          <p class="hidden text-xs ui-text-muted sm:block">Payment Gateway Demo</p>
        </div>
      </RouterLink>

      <!-- Desktop menu -->
      <nav
        class="hidden items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 md:inline-flex dark:border-slate-700 dark:bg-slate-800/80"
        aria-label="Main menu"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          :class="navLinkClass"
          :active-class="navActiveClass"
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

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <RouterLink
          to="/cart"
          class="relative inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600 sm:min-w-0 sm:px-4 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:text-brand-400"
          aria-label="Cart"
        >
          <span class="hidden sm:inline">Cart</span>
          <svg class="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            v-if="itemCount > 0"
            class="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-semibold text-white sm:static sm:ml-0"
          >
            {{ itemCount }}
          </span>
        </RouterLink>

        <ThemeToggle />

        <!-- About developer — photo only on small screens -->
        <a
          :href="developer.portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex cursor-pointer sm:hidden"
          title="About developer — {{ developer.name }}"
        >
          <div class="h-10 w-10 overflow-hidden rounded-xl ring-2 ring-brand-100 dark:ring-brand-900">
            <img
              :src="developer.photoUrl"
              :alt="developer.name"
              class="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </div>
        </a>

        <!-- About developer — full card on sm+ -->
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
          <div class="hidden text-left lg:block">
            <p class="text-[10px] font-medium uppercase tracking-wide ui-text-muted">About developer</p>
            <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">{{ developer.name }}</p>
          </div>
        </a>

        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:text-brand-400"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          @click="toggleMobileMenu"
        >
          <svg v-if="!mobileMenuOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="mobileMenuOpen"
      id="mobile-menu"
      class="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800"
    >
      <nav
        class="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/80"
        aria-label="Mobile menu"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          :class="navLinkClass"
          :active-class="navActiveClass"
          @click="mobileMenuOpen = false"
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
    </div>
  </header>
</template>
