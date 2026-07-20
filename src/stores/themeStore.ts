import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'payflow-theme'

function readStoredTheme(): ThemeMode | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(): ThemeMode {
  return readStoredTheme() ?? getSystemTheme()
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(resolveTheme())

  function init() {
    applyTheme(mode.value)
  }

  function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(next: ThemeMode) {
    mode.value = next
  }

  watch(mode, (value) => {
    applyTheme(value)
    localStorage.setItem(STORAGE_KEY, value)
  })

  return { mode, init, toggle, setTheme }
})
