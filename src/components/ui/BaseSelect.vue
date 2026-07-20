<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  id: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="w-full cursor-pointer appearance-none rounded-xl border bg-white py-2.5 pl-4 pr-10 text-sm leading-normal text-slate-900 outline-none transition hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-brand-400 dark:focus:ring-brand-900 dark:disabled:bg-slate-900 dark:disabled:text-slate-500"
        :class="error ? 'border-red-300 dark:border-red-700' : 'border-slate-200'"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
