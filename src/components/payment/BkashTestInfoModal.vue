<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { bkashTestInfo } from '@/data/bkashTestInfo'

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
      @click.self="open = false"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bkash-test-info-title"
      >
        <div class="mb-4 flex items-start gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl dark:bg-brand-950"
          >
            💡
          </div>
          <div>
            <h3 id="bkash-test-info-title" class="text-lg font-semibold ui-text-heading">
              bKash sandbox test info
            </h3>
            <p class="mt-1 text-sm ui-text-muted">
              Use these credentials on the bKash checkout page (sandbox only).
            </p>
          </div>
        </div>

        <dl class="space-y-4 text-sm">
          <div>
            <dt class="font-medium ui-text-heading">Test wallets</dt>
            <dd class="mt-2 space-y-1.5">
              <p
                v-for="wallet in bkashTestInfo.wallets"
                :key="wallet"
                class="font-mono text-xs text-slate-700 dark:text-slate-300"
              >
                {{ wallet }}
              </p>
            </dd>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl ui-surface-muted p-3">
              <dt class="text-xs font-medium uppercase tracking-wide ui-text-muted">PIN</dt>
              <dd class="mt-1 font-mono text-base font-semibold ui-text-heading">{{ bkashTestInfo.pin }}</dd>
            </div>
            <div class="rounded-xl ui-surface-muted p-3">
              <dt class="text-xs font-medium uppercase tracking-wide ui-text-muted">OTP</dt>
              <dd class="mt-1 font-mono text-base font-semibold ui-text-heading">{{ bkashTestInfo.otp }}</dd>
            </div>
          </div>
        </dl>

        <div class="mt-6 flex justify-end">
          <BaseButton variant="secondary" @click="open = false">Close</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
