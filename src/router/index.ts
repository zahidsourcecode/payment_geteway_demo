import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/ProductsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/PaymentView.vue'),
      meta: { requiresCheckout: true },
    },
    {
      path: '/payment/bkash/callback',
      name: 'bkash-callback',
      component: () => import('@/views/BkashCallbackView.vue'),
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('@/views/PaymentResultView.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresCheckout) {
    const checkoutRaw = sessionStorage.getItem('checkout-ready')
    if (!checkoutRaw) {
      next({ name: 'checkout' })
      return
    }
  }
  next()
})

export default router
