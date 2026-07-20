import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { products, TAX_RATE, CURRENCY } from '@/data/products'
import type { Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Record<string, number>>({})

  const lines = computed(() =>
    Object.entries(items.value)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
        product: products.find((product) => product.id === productId)!,
      }))
      .filter((line) => line.product),
  )

  const itemCount = computed(() =>
    lines.value.reduce((total, line) => total + line.quantity, 0),
  )

  const subtotal = computed(() =>
    lines.value.reduce((total, line) => total + line.product.price * line.quantity, 0),
  )

  const tax = computed(() => subtotal.value * TAX_RATE)
  const total = computed(() => subtotal.value + tax.value)

  function addItem(product: Product, quantity = 1) {
    items.value[product.id] = (items.value[product.id] ?? 0) + quantity
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      delete items.value[productId]
      return
    }
    items.value[productId] = quantity
  }

  function removeItem(productId: string) {
    delete items.value[productId]
  }

  function clearCart() {
    items.value = {}
  }

  return {
    currency: CURRENCY,
    taxRate: TAX_RATE,
    items,
    lines,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }
})
