<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useErrorLogStore, type ErrorLogSource } from '@/stores/errorLogStore'

const open = defineModel<boolean>('open', { required: true })

const errorLogStore = useErrorLogStore()

const history = computed(() => [...errorLogStore.entries].reverse())

function formatTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(iso))
}

function sourceLabel(source: ErrorLogSource) {
  if (source === 'bkash') return 'bKash'
  if (source === 'stripe') return 'Stripe'
  if (source === 'checkout') return 'Checkout'
  return 'System'
}

function sourceClass(source: ErrorLogSource) {
  if (source === 'bkash') return 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200'
  if (source === 'stripe') return 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200'
  if (source === 'checkout') return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

function formatDetails(details: unknown) {
  if (details === undefined || details === null) return ''
  if (typeof details === 'string') return details
  try {
    return JSON.stringify(details, null, 2)
  } catch {
    return String(details)
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
      @click.self="open = false"
    >
      <div
        class="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-log-title"
      >
        <div class="border-b ui-border-subtle p-5 sm:p-6">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 id="error-log-title" class="text-lg font-semibold ui-text-heading">Error log</h3>
              <p class="mt-1 text-sm ui-text-muted">
                Payment and API errors from this session — cleared on page reload.
              </p>
            </div>
            <span
              v-if="history.length"
              class="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"
            >
              {{ history.length }}
            </span>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div
            v-if="!history.length"
            class="rounded-xl ui-surface-muted px-4 py-10 text-center text-sm ui-text-muted"
          >
            No errors logged yet. Failed Stripe or bKash payments will appear here.
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="entry in history"
              :key="entry.id"
              class="rounded-xl border border-red-100 p-4 dark:border-red-900/50"
            >
              <div class="flex flex-wrap items-start justify-between gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="sourceClass(entry.source)"
                >
                  {{ sourceLabel(entry.source) }}
                </span>
                <time class="text-xs ui-text-muted">{{ formatTime(entry.createdAt) }}</time>
              </div>

              <p class="mt-3 text-sm font-medium text-red-800 dark:text-red-200">{{ entry.message }}</p>

              <p class="mt-1 text-xs ui-text-muted">{{ entry.route }}</p>

              <pre
                v-if="entry.details !== undefined && entry.details !== null"
                class="mt-3 max-h-40 overflow-auto rounded-lg bg-slate-950 p-3 text-left text-xs text-slate-100"
              >{{ formatDetails(entry.details) }}</pre>
            </li>
          </ul>
        </div>

        <div class="flex flex-col-reverse gap-2 border-t ui-border-subtle p-5 sm:flex-row sm:justify-end sm:p-6">
          <BaseButton
            v-if="history.length"
            variant="ghost"
            class="w-full sm:w-auto"
            @click="errorLogStore.clearErrors()"
          >
            Clear log
          </BaseButton>
          <BaseButton variant="secondary" class="w-full sm:w-auto" @click="open = false">
            Close
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
