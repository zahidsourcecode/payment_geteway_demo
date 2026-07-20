# PayFlow — Payment Gateway Demo

A portfolio showcase project built with Vue.js to demonstrate payment gateway integration, checkout flows, and secure payment UX patterns.

> **Demo only** — Stripe runs in **test mode**. bKash is simulated. No real charges are made.

---

## Project Purpose

This project is designed for **portfolio and interview demonstrations**. It integrates **Stripe test mode** for card payments and includes a **simulated bKash wallet** flow for local payment UX.

**Goals:**

- Showcase how a modern checkout and payment flow works end to end  
- Demonstrate real Stripe PaymentIntent + Payment Element integration  
- Show server-side secret key handling (never exposed to the browser)  
- Provide a minimal e-commerce shell so the **payment gateway remains the main focus**  

**What you can explore in the demo:**

1. **Shop** — browse products and add items to cart  
2. **Cart** — review quantities and order total  
3. **Checkout** — enter basic billing details  
4. **Payment** — pay with **Stripe** (test mode) or **bKash** (simulated)  
5. **Result** — view a success receipt or retry after a failure  

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| [Vue 3.5](https://vuejs.org/) | Frontend framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application code |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Stripe.js](https://stripe.com/docs/stripe-js) | Payment Element & test-mode checkout |
| [Express](https://expressjs.com/) | Local dev API server |
| [Vercel Serverless](https://vercel.com/docs/functions) | Production API for PaymentIntents |
| [Vue Router 4](https://router.vuejs.org/) | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | State management (cart & checkout) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Zod](https://zod.dev/) | Form validation |

---

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (v20 recommended)  
- npm (comes with Node.js)  
- A [Stripe account](https://dashboard.stripe.com/register) (free) for test API keys  

### 1. Clone and install

```bash
git clone <your-repo-url>
cd payment_geteway_demo
npm install
```

### 2. Configure Stripe test keys

Copy the example env file and add your **test mode** keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):

```bash
cp .env.example .env
```

Edit `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> Never commit `.env` or use live keys in this demo project.

### 3. Start the app (frontend + API)

```bash
npm run dev
```

This runs:

- **Vue app** at http://localhost:5173  
- **Stripe API** at http://localhost:4242  

### 4. Build for production

```bash
npm run build
npm run preview
```

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vue app + Stripe API together |
| `npm run dev:client` | Start Vue app only |
| `npm run dev:server` | Start Stripe API only |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |

---

## Stripe test cards

Use these in the Stripe Payment Element (any future expiry, any CVC):

| Card number | Outcome |
|-------------|---------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined — insufficient funds |
| `4000 0000 0000 3220` | Requires 3D Secure |

More test cards: [Stripe testing docs](https://docs.stripe.com/testing)

**bKash demo:** use any valid `01XXXXXXXXX` number; include `0000` in the number to simulate a decline.

---

## Project Structure

```
server/             # Express API — creates Stripe PaymentIntents
src/
├── components/     # UI, cart, and payment components
├── composables/    # Payment flow logic
├── services/       # Stripe API client + mock bKash API
├── stores/         # Pinia stores (cart & checkout)
└── views/          # Route pages
```

---

## License

MIT — portfolio demo project.
