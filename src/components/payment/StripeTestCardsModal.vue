<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { stripeTestCards } from '@/services/stripeApi'

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
        aria-labelledby="stripe-test-cards-title"
      >
        <div class="mb-4 flex items-start gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl dark:bg-brand-950"
          >
            💡
          </div>
          <div>
            <h3 id="stripe-test-cards-title" class="text-lg font-semibold ui-text-heading">
              Stripe test cards
            </h3>
            <p class="mt-1 text-sm ui-text-muted">Use any future expiry and any 3-digit CVC.</p>
          </div>
        </div>

        <div class="-mx-1 overflow-x-auto px-1">
          <table class="min-w-full text-left text-sm">
            <thead class="ui-text-muted">
              <tr>
                <th class="pb-2 pr-4 font-medium">Number</th>
                <th class="pb-2 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="card in stripeTestCards" :key="card.number" class="border-t ui-border-subtle">
                <td class="py-2.5 pr-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {{ card.number }}
                </td>
                <td class="py-2.5 ui-text-body">{{ card.outcome }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-end">
          <BaseButton variant="secondary" @click="open = false">Close</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
