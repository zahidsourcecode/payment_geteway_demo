import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'prod_headphones',
    name: 'Studio Headphones',
    description: 'Noise-isolating over-ear headphones with studio-grade clarity.',
    price: 129.99,
    emoji: '🎧',
    gradient: 'from-violet-500 to-indigo-600',
    image: '/images/products/headphones.png',
  },
  {
    id: 'prod_keyboard',
    name: 'Mechanical Keyboard',
    description: 'Compact 75% layout with hot-swappable switches and RGB backlight.',
    price: 89.99,
    emoji: '⌨️',
    gradient: 'from-sky-500 to-blue-600',
    image: '/images/products/keyboard.png',
  },
  {
    id: 'prod_webcam',
    name: '4K Webcam',
    description: 'Auto-focus webcam with dual microphones for crisp video calls.',
    price: 79.99,
    emoji: '📷',
    gradient: 'from-emerald-500 to-teal-600',
    image: '/images/products/webcam.png',
  },
  {
    id: 'prod_mouse',
    name: 'Ergo Mouse',
    description: 'Vertical ergonomic mouse designed for all-day comfort.',
    price: 59.99,
    emoji: '🖱️',
    gradient: 'from-amber-500 to-orange-600',
    image: '/images/products/mouse.png',
  },
]

export const TAX_RATE = 0.08
export const CURRENCY = 'USD'
