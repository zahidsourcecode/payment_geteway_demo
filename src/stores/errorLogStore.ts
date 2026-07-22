import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ErrorLogSource = 'stripe' | 'bkash' | 'checkout' | 'system'

export interface ErrorLogEntry {
  id: string
  source: ErrorLogSource
  message: string
  details?: unknown
  route: string
  createdAt: string
}

function createEntryId() {
  return `err_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export const useErrorLogStore = defineStore('errorLog', () => {
  const entries = ref<ErrorLogEntry[]>([])

  function addError(payload: {
    source: ErrorLogSource
    message: string
    details?: unknown
    route?: string
  }) {
    entries.value.push({
      id: createEntryId(),
      source: payload.source,
      message: payload.message,
      details: payload.details,
      route: payload.route ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
      createdAt: new Date().toISOString(),
    })
  }

  function clearErrors() {
    entries.value = []
  }

  return {
    entries,
    addError,
    clearErrors,
  }
})
